'use strict'
var Directive=function()
{

}
Directive.prototype.include=function(directiveName)
{
	var path='application/directives/' + directiveName + '.js';
	return require(path);
}
Directive.prototype.config=function(app)
{
	var that=this;
	var directive=function(directiveName)
	{
		app.directive(directiveName,that.include(directiveName));
	}
	directive('mpHeader');
	directive('mpMemberCard');
	directive('mpBarcode');
	directive('mpAnimation');
}
exports.getInstance=function(){
	return new Directive();
}