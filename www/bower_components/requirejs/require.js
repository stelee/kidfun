//require.js
//version 2.1.0
(function(scope){
	'use strict'

	var CONFIG_REQUIRE_ONCE=true;
	var __module_cache__={};
	var config={
		async:false,
		alias: {
			require : "require",
			injection: "injection",
			mix: "mix_traits"
		}
	}

	var pathResolver=function(path){
		if(config.pathResolver)
		{
			return config.pathResolver(path);
		}
		else
		{
			if(path.match(/\.js$/g)===null)
			{
				path += ".js";
			}
			return path;
		}
	}

	var contentResolver=function(path,callback){
		var ret=null;
		path=pathResolver(path);
		ajaxGet(path,function(data){
			if("function"==typeof(callback)){
				callback(data);
			}else
			{
				ret=data;
			}
		})
		return ret;
	}

	var errorHandler=function(url,xmlHttpRequest,textStatus)
	{
		console.error("Error fetch the content: "+url);
	}
	var createXMLHTTPRequest=function(){
		if(window.XMLHttpRequest){//firefox,mozillar, opera,safari,IE7, IE8
			var xmlHttpRequest=new XMLHttpRequest();
			if(xmlHttpRequest.overrideMimeType){
				xmlHttpRequest.overrideMimeType("text/xml");
			}
			return xmlHttpRequest;
		}else
		{
			console.error("Old browser is not supported");
			return null;
		}
	}
	var ajaxGet=function(url,callback){
		if('function'!=typeof(jQuery)){//work with no jquery
			var xmlHttpRequest=createXMLHTTPRequest();
			xmlHttpRequest.onreadystatechange=function(){
				if(xmlHttpRequest.readyState==4){
					if(xmlHttpRequest.status==200){
						callback(xmlHttpRequest.responseText);
					}else
					{
						errorHandler(url,xmlHttpRequest,xmlHttpRequest.status);
					}
				}
			}
			xmlHttpRequest.open('GET',url,config.async);
			xmlHttpRequest.send();
		}else
		{
			jQuery.ajax(url,{
				async:config.async,
				dataType:"html",
				scriptCharset:"UTF-8",
				success:function(data)
				{
					callback(data);
				},
				error: function(request, status, errorThrown){
					errorHandler(url,request,status)
				}
			})
		}
	}

	var define=function(fn){
		if("object"==typeof(fn)){
		    return fn;
		}else if("function"==typeof(fn)){
			var module={
			  exports:{}
			}
			fn(require,module.exports,module,scope);
			return module.exports;
		}
	}

	var webnpmEval=function(content,filePath){
		try{
			var fn=new Function("require","exports","module","scope",content);
			return define(fn);
		}catch(exception)
		{
			console.error("error on "+filePath)
			console.error(exception)
			console.error(exception.stack)
			return null;
		}
		
	}

	var require=function(path,callback){
		if(CONFIG_REQUIRE_ONCE&&__module_cache__[path])
		{
			return __module_cache__[path];
		}
		if("function"==typeof(callback)){
			contentResolver(path,function(content){
				var obj=webnpmEval(content,path);
				if(CONFIG_REQUIRE_ONCE){
					__module_cache__[path]=obj;
				}
				callback(obj);
			})
		}else{
			var content=contentResolver(path);
			var obj=webnpmEval(content,path);
			if(CONFIG_REQUIRE_ONCE){
				__module_cache__[path]=obj;
			}
			
			return obj;
		}
		
	}

	var injection=function(path,callback){
		if("function"==typeof(callback)){
			contentResolver(path,function(content){
				callback(eval(content));
			})
		}else{
			var content=contentResolver(path);
			return eval(content);
		}
	}

	var mix=function(targetClass, traits){
		for(var prop in traits){
			targetClass.prototype[prop]=traits[prop];
		}
	}
	//register alias
	
	scope[config.alias.require]=require;
	scope[config.alias.injection]=injection;
	scope[config.alias.mix]=mix;
})(this);