'use strict'
var options={
	path_prefix: "application/migrations/"
};
var DB_VERSION_KEY='_db_version_';


var Migration=function(){
}

//private
var onFinished=function(){
	context.storage.set(DB_VERSION_KEY,this.newVersion);
	this.trigger("finished");
}

//public
Migration.prototype.run=function(version){
	var path_prefix=options.path_prefix;
	this.newVersion=version;
	var db_version=context.storage.get(DB_VERSION_KEY);
	db_version=db_version || 0;
	var migrationArr=new Array();

	if(version>db_version)
	{
		for(var i=db_version+1;i<=version;i++)
		{
			migrationArr.push(require(path_prefix+'db'+i+'.js'));
		}
		this._runMigration('up',migrationArr)
	}else if(version<db_version)
	{
		for(var i=db_version;i>version;i--){
			migrationArr.push(require(path_prefix+'db'+i+'.js'));
		}
		this._runMigration('down',migrationArr)
	}else
	{
		onFinished.call(this);
	}
}

Migration.prototype._runMigration=function(direction,migrationArr)
{
	var that=this;
	this.migrationList.setArray(migrationArr);
	this.migrationList.each(function(migration,next){
		migration[direction](function(){
			next();
		},function(error){
			console.error(error);
			return;
		});
	},function(){
		onFinished.call(that);
	})
}

//mixin
mix_traits(Migration,require('application/traits/callbackable').callbackable);

exports.getInstance=function(){
	var ret= new Migration();
	ret.migrationList=require('libs/utils/list').list();
	return ret;
}