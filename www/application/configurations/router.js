'use strict';
var Router=function(app){
	this.app=app;
}

Router.prototype.config=function(app){
	app.config(['$routeProvider','appConfigProvider',function($routeProvider,appConfig){
		var defaultRoute=null;
		debugger;
		var menus=appConfig.menus;
		menus.forEach(function(menu){
			$routeProvider.when(menu.url,{
				templateUrl: menu.view
				,controller: menu.controller
			});
			if(menu.isDefault===true)
			{
				defaultRoute=menu;
			}
		})
		if(defaultRoute!=null)
		{
			$routeProvider.otherwise({
				redirectTo: defaultRoute.url
			})
		}
	}])
}
exports.getInstance=function()
{
	return new Router();
}