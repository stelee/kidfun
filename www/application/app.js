(function(global){
	'use strict';
	//global injection
	//Always to be the first of app.js
	//global.appConfig=require('application/configurations/appConfig').config;
	require('libs/utils/xdate');
	var app=angular.module('restoApp',['ngRoute'])
	var appConfig=require('application/configurations/appConfig').config;

	var migration=require('libs/database/migration').getInstance();

	migration.on("finished","migration finished").on("error","migratione failed").run(appConfig.migrationVersion);

	//Register the global configuration
	app.provider('appConfig',function AppConfigProvider(){
		var that=this;
		this.appConfig={};
		this.$get=function(){
			return this.appConfig;
		};
	});

	app.config(['appConfigProvider',function(appConfigProvider){
		appConfigProvider.appConfig=appConfig;
	}]);

	//Register the routers
	var router=require('application/configurations/router').getInstance();
	router.config(app);	

	//Register the controllers
	var controllers=require('application/configurations/controller').getInstance();
	controllers.config(app);

	//Register the directives
	var directive=require('application/configurations/directive').getInstance();
	directive.config(app);

	//Register the custom filters
	app.filter('cardNumberFmt',function(){
		return function(input)
		{
			return require('libs/utils').fmt(input, 4, " ");

		}
	})
})(this)