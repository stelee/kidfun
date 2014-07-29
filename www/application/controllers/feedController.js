var Credit=require('application/entities/credits').Credit;
module.exports=['$scope',function($scope)
{
	$scope.creditNumber=0;
	$scope.addCredit=function(){
		var credit=new Credit();
		var that=this;
		credit.on("insert",function(){
			that.creditNumber=0;
		}).insert(
		{
			deposit : that.creditNumber
		});
	}
}]