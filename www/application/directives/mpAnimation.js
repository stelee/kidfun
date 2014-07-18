'use strict'
var setFrame=function($imgEl,frame)
{
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			$imgEl.attr("src",frame);
			resolve();
		},500);
	});
}
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {
			frames : '@'
		}
		,templateUrl: "views/templates/mp-animation-directive-tmp.html"
		,link : function(scope,element,attr){
			var frameArr=scope.frames.split("|");
			var $imgEl=$(element).find("img");
			$imgEl.attr("src",frameArr[0]);
			var promises=[];
			for(var i=0;i<frameArr.length;i++)
			{
				promises.push(function(){
					setFrame($imgEl,frameArr[i])
				});
			}
			for(var i=0;i<frameArr.length;i++)
			{
				promises.push(function(){
					setFrame($imgEl,frameArr[i])
				});
			}

			setInterval(function(){
				Promise.all(promises);
			},5000)
		}
	};
}