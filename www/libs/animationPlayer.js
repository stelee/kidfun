'use strict'
var Player=function()
{
	this.frameIndex=0;
	this.frames=[];
}
//private
function calculate(image,canvas)
{
	var scaleWidth=canvas.width/image.width;
	var scaleHeight=canvas.height/image.height;
	var scale=Math.min(scaleWidth,scaleHeight);
	var newWidth=image.width*scale;

	return {
		x: canvas.width*0.5-newWidth*0.5,
		y: 0,
		width: newWidth,
		height: image.height*scale
	}
}

//protect

Player.prototype._cache=function(frameArr)
{
	this.frames=[];
	var that=this;
	return require("libs/promiseAll").promiseAll(
		frameArr,
		function(frame,resolve,reject)
		{
			var image=new Image();
			image.src=frame;
			image.onload=function()
			{
				that.frames.push(image);
				resolve();
			}
		}
	);
}

//public
Player.prototype.play=function($canvas, frameArr,fps)
{
	fps = fps || 2;
	var that=this;
	that._cache(frameArr).then(function(){
		var draw=function(){
			setTimeout(function(){
				requestAnimationFrame(draw);
			},1000/fps);
			var frame=that.frames[that.frameIndex];
			that.frameIndex++;
			if(that.frameIndex >= that.frames.length)
			{
				that.frameIndex=0;
			}
			$canvas.attr("width",$canvas.parent().width());
			$canvas.attr("height",$canvas.parent().height());
			var canvas=$canvas[0]; //extra the canvas from canvas jquery object
			var context=canvas.getContext('2d');
			var ps=calculate(frame,canvas); //to calculate the postion&size
			context.drawImage(frame,ps.x,ps.y,ps.width,ps.height);
		};
		draw();
	});
}
exports.getInstance=function()
{
	return new Player();
}