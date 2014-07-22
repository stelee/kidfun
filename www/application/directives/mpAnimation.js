'use strict'
module.exports=function(){
	return {
		restrict: 'E'
		,scope: {
			frames : '@'
		}
		,templateUrl: "views/templates/mp-animation-directive-tmp.html"
		,link : function(scope,element,attr){
			var frameArr=scope.frames.split("|");

			var $canvasEl=$(element).find("canvas");
			
			var animationPlayer=require('libs/animationPlayer').getInstance();
			animationPlayer.play($canvasEl,frameArr);
		}
	};
}