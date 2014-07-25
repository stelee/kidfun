'use strict'
var Ctrl=function()
{

}
Ctrl.prototype.include=function(controllerName)
{
	var path='application/controllers/' + controllerName + '.js';
	return require(path);
}
Ctrl.prototype.config=function(app)
{
	var ctrlFn=app.controller;
	//register the controller with the controller js file
	ctrlFn('dogCtrl',this.include('dogController'));
	ctrlFn('feedCtrl',this.include('feedController'));
}
exports.getInstance=function(){
	return new Ctrl();
}