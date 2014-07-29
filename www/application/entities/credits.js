'use strict'
var BaseEntity=require('libs/database/base_entity').BaseEntity;
var Credit=function(){

}
Credit.prototype=new BaseEntity("credits");
Credit.prototype.totalCredit=function(){
	var sql="SELECT \
	sum((case when deposit is null then 0 else deposit end) -(case when withdraw is null then 0 else withdraw end)) \
	as totalCredit FROM credits"

	this.findBySql(sql,"total credit");
}
exports.Credit=Credit;