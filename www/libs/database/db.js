//db.js
//working specially for sqlite on browser
var DBClient=function(name,version,description,size){
	this.name=name;
	this.version=version;
	this.description=description;
	this.size=size;
	this.onSuccess=function(){};
	this.onError=function(error,sql){
		console.error(error);
		console.error(sql);
	}
	this.db=window.openDatabase(this.name,this.version,this.description,this.size);
}

var config={
	name:"kidfun",
	version: "1.0",
	description:"kidfun database",
	size: 1000
}
DBClient.prototype.bind=function(tag,fn)
{
	if(tag=="success"){
		this.onSuccess=fn;
	}else if(tag=="error")
	{
		this.onError=fn;
	}else if(tag=="onQuery"){
		this.onQuery=fn;
	}else
	{
		throw("Unacceptable event name "+tag);
	}
}

DBClient.prototype.execute=function(sql,onSuccess,onError)
{
	if('undefined'==typeof(onSuccess)){
		onSuccess=this.onSuccess;
	}

	if('undefined'==typeof(onError)){
		onError=this.onError;
	}

	 var sqls=new Array();
        
    if(typeof(sql)=='string')
    {
        sqls.push(sql);
    }else
    {
        sqls=sql;
    }
    var that=this;
	that.db.transaction
	(function(tx)
	 {
	    for(i in sqls)
	    {
	        tx.executeSql(sqls[i]);
	    }
	 },
	 function(error){onError(error,sqls)},
	 onSuccess
	);
}

DBClient.prototype.query=function(sql,onQuerySuccess,onError)
{
	if('undefined'==typeof(onError)){
		onError=this.onError;
	}
	this.db.transaction(function(tx){
		tx.executeSql(sql,[],onQuerySuccess,function(error){onError(error,sql)});
	},function(error){
		onError(error,sql)
	});
}

exports.getInstance=function(){
	if(arguments.length==0){
		return new DBClient(config.name,config.version,config.description,config.size);
	}else if(arguments.length==1)
	{
		var myConfig=arguments[0];
		return new DBClient(myConfig.name,myConfig.version,myConfig.description,myConfig.size);
	}else
	{
		return new DBClient(arguments[0],arguments[1],arguments[2],arguments[3]);
	}
}

