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
	ctrlFn('dogCtrl',this.include('dogController'));
}
exports.getInstance=function(){
	return new Ctrl();
}