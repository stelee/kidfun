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

			var $imgEl=$(element).find("canvas");
			//adjust the height
			$imgEl.height(
				($(document).height() - $imgEl.offset().top)*0.9
			);
			// $imgEl.attr("src",frameArr[0]);
			var animationPlayer=require('libs/animationPlayer').getInstance();
			animationPlayer.play($imgEl,frameArr);
		}
	};
}