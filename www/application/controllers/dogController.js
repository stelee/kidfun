var Credit=require('application/entities/credits').Credit;
module.exports=['$scope',function($scope)
{
	$scope.username="Yichen";
	var credit=new Credit();
	credit.on("total credit",function(){
		$scope.creditTotal=this.entities[0].totalCredit;
	}).totalCredit();
	
}]