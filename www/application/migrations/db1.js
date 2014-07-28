var BaseEntity=require('libs/database/base_entity').BaseEntity;
var entity=new BaseEntity("credits",["deposit INTEGER,","withdraw INTEGER"]);
exports.up=function(onSuccess,onFailed)
{
	
	entity.on("drop",onSuccess).on("error",onFailed).drop();
}
exports.down=function(onSuccess,onFailed){
	entity.on("drop",onSuccess).on("error",onFailed).drop();
}