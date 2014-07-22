var options={
	path_prefix="application/migrations"
};
exports.run=function(version)
{
	var DB_VERSION="db_version";
	var @context
	var @
	var onFinished=function(){
		context.storage.setSystem(DB_VERSION,version);
		return;
	}
	var db_version=context.storage.getSystem(DB_VERSION);
	if(db_version)
}