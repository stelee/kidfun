var config={
	'appName' : 'Learn&Fun'
	,'menus' : [
		{name : 'My Dog' , url : '/myDog', isDefault: true, controller:'dogCtrl',view:'views/dog.html'}
		,{name : 'Feed My Dog' , url : '/feed', controller:'feedCtrl',view:'views/feed.html'}
		,{name : 'Challenge' , url : '/callenge',controller:'challengeCtrl', view: 'views/challenge.html'}
		,{name :'About' , url : '/about', controller: 'aboutCtrl', view: 'views/about.html'}
	]
	,'migrationVersion' : 1
	,'traits_path' : 'application/traits/'
}
exports.config=config;