var Player=function()
{
	this.frameIndex=0;
}

Player.prototype.play=function($imgTag, frameArr,frameDuration)
{
	
}
exports.getInstance=function()
{
	return new Player();
}