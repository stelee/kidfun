var callbackable=require("application/traits/callbackable").callbackable;
var xstring=require("libs/utils/xstring").xstring;
var sqlFormat=xstring.sqlFormat;

var config={
	driver: 'libs/db.js'
}

var init=function()
{
	this.dbi=require(config.driver).getInstance();
	if(arguments.length>0)
	{
		this.tableName=arguments[0];
	}
	if(arguments.length>1)
	{
		this.fields=arguments[1];
	}
}

var BaseEntity=function(){
	debugger;
	init.apply(this,arguments);
}

mix_traits(BaseEntity,callbackable);


BaseEntity.prototype.execute=function(sqls)
{
	var that=this;
	this.dbi.execute(sqls,function(){
		that.trigger('execute')
	},function(error){
		console.log(sqls);
		that.error(error);
	})
}

BaseEntity.prototype.create=function(){
	var that=this;
	var sql='CREATE TABLE IF NOT EXISTS "{{tableName}}" ({{fieldsString}})';
	var tableName=this.tableName;
	var fieldsString='"id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL\
	,code VARCHAR \
	,ddlDate DATETIME DEFAULT current_timestamp,ddlFlag VARCHAR';
	this.fields.forEach(function(field){
		if("string"==typeof(field))
		{
			fieldsString+=","+field
		}else
		{
			var tmpStr='"'+field.name+'"';
			if(field.type)
			{
				tmpStr+=" "+field.type;
			}
			if(field.constraint)
			{
				tmpStr+=" "+field.constraint;
			}
			fieldsString+=","+tmpStr;
		}
		
	});
	sql=xstring(sql).bind({
		tableName:tableName,
		fieldsString:fieldsString
	}).toString();
	this.dbi.execute(sql,function(){
		that.trigger('create')
	},function(error){
		that.error(error)
	});
}
BaseEntity.prototype.drop=function(onSuccess,onFailed)
{
	var sql=xstring('DROP TABLE IF EXISTS "{{tableName}}"').bind(this.tableName).toString();
	var that=this;
	this.dbi.execute(sql,function(){
		that.trigger('drop')
	});
}

BaseEntity.prototype.findBySql=function(sql,eventName)
{
	var that=this;
	eventName=eventName||"findBySql";
	find(that,sql,function(list){
		that.entities=list;
		that.trigger(eventName);
	})
}
BaseEntity.prototype.list=function(where,limit,orderby){
	var limitString="";
	var whereString="";
	var orderbyString="";
	if(!isNull(where)){
		whereString=" where "+where;
	}
	if(!isNull(limit)){
		limitString=" limit "+limit;
	}

	if(!isNull(orderby)){
		orderbyString=" order by "+ orderby;
	}
	this.findBySql("select * from "+this.tableName+whereString+limitString+orderbyString,'list');
}

/*
This function will use the ddlFlag to save/update/delete the value
The code will be the unique id to identify the data,unless it is specified

*/
BaseEntity.prototype.save=function(dataMap,batchFlag)
{
	var ids=["code"]
	var sqls=[];//initialize a sql array
	var that=this;

	if("getIds" in this)
	{
		ids=this.getIds();
	}
	var ddlFlag=String(dataMap.ddlFlag).toUpperCase();
	if(ddlFlag=='D')
	{
		this.prepareDeleteSql(sqls,ids,dataMap);
	 }
	//else if(ddlFlag=='I')
	// {
	// 	this.prepareInsertSql(sqls,dataMap);
	// }
	//if the ddlFlag is I, there should be no deletion of the record. but server is unstable and I have to make this
	else if(ddlFlag=='U'||ddlFlag=='E' ||ddlFlag=='I')
	{
		this.prepareUpdateSql(sqls,ids,dataMap);
	}
	if(batchFlag==true){
		return sqls;
	}

	if(sqls.length>0)
	{
		this.dbi.execute(sqls,function(){
			that.trigger('save');
		},function(error){
			console.error(error);
			console.log(sqls);
		})
	}
}
BaseEntity.prototype.prepareDeleteSql=function(sqls,ids,dataMap)
{
	var where=" where 1=1";
	ids.forEach(function(id){
		where +=" and " + id + " = " + sqlFormat(dataMap[id]);
	})
	var sql="delete from " + this.tableName + where;
	sqls.push(sql);
}
BaseEntity.prototype.prepareInsertSql=function(sqls,dataMap)
{
	sqls.push(this.insert(dataMap,true));
}

BaseEntity.prototype.prepareUpdateSql=function(sqls,ids,dataMap)
{
	this.prepareDeleteSql(sqls,ids,dataMap);
	this.prepareInsertSql(sqls,dataMap);
}

BaseEntity.prototype.insert=function(dataMap,batchFlag){
	var that=this;
	var timestamp=(new Date()).get_unixtimestamp();
	dataMap["ddlFlag"]=dataMap["ddlFlag"]||'I';
	dataMap["ddlDate"]=dataMap["ddlDate"]||timestamp;
	var fields=new Array();
	var values=new Array();
	for(prop in dataMap)
	{
		fields.push("'"+prop+"'");
		values.push(sqlFormat(dataMap[prop]));
	}
	var sql=xstring("INSERT INTO '{{tableName}}' ({{fields}})VALUES({{values}})").bind(
	{
		tableName:this.tableName,
		fields:fields.join(","),
		values:values.join(",")
	}).toString();
	if(batchFlag==true)
	{
		return sql;
	}else
	{
		this.dbi.execute(sql,function(){
			that.on('list',function(){
				that.trigger("insert");
			}).list("ddlDate="+timestamp);
		},function(error){
			that.error(error)
		});
	}
}

BaseEntity.prototype.update=function(dataMap,where)
{
	var that=this;
	var updateArray=new Array();
	for(key in dataMap)
	{
		var value=dataMap[key];
		updateArray.push(xstring("'{{key}}'={{value}}").bind({
			key:key,
			value:sqlFormat(value)
		}).toString());
	}
	updateArray.push("ddlDate="+(new Date).get_unixtimestamp());
	var sql=xstring("update {{tableName}} set {{updateStr}} where 1=1").bind({
		tableName:this.tableName,
		updateStr:updateArray.join(", ")
	}).toString();
	if(where)
	{
		sql+=" and "+where;
	}
	that.dbi.execute(sql,function(){
		that.trigger("update");
	},function(error){
		that.error(error)
	});
}
BaseEntity.prototype.delete=function(where,batchFlag)
{
	var that=this;
	if(isNull(where))
	{
		where = "";
	}else
	{
		where = " and " + where;
	}

	var sql="delete from "+this.tableName+" where 1=1" + where;

	if(batchFlag===true)
	{
		return sql;
	}
	that.dbi.execute(sql,function(){
		that.trigger("delete");
	},function(error){
		that.error(error)
	});
}
BaseEntity.prototype.deleteById=function(id,batchFlag)
{
	return this.delete('id='+id,batchFlag);
}
//private
var find=function(that,sql,callback)
{
	that.dbi.query(sql,function(tx,rs){
		var list=new Array();
		var len=rs.rows.length;
		for(var i=0;i<len;i++){
			list.push(rs.rows.item(i));
		}
		callback(list);
	},function(error){
		console.error("@"+sql);
		that.error(error);
	});
}

exports.BaseEntity=BaseEntity;
exports.getInstance=function(entityName){
	return new BaseEntity(entityName);
}

