(function(global){
	var path=require('libs/utils/path').path;
	global.context={}
	var context=new Object();
	global.context=context;

	//storage is the permanent storage

	var Storage=function(){
	    this.storage=window.localStorage;
	}
	Storage.prototype.set = function(key,value) {
	 
	    value=JSON.stringify(value);

	    this.storage.setItem(key,value);
	}
	Storage.prototype.get=function(key){
	    var ret=this.storage.getItem(key);
	    if(ret==null){
	        return ret;
	    }else
	    {
	        return JSON.parse(ret);
	    }
	}
	Storage.prototype.getSystem=function(key)
	{
		return this.get("_"+key+"_");
	}
	Storage.prototype.setSystem=function(key,value)
	{
		this.set("_"+key+"_",value);
	}
	Storage.prototype.remove=function(key){
	    var ret=this.get(key);
	    this.storage.removeItem(key);
	    return ret;
	}
	Storage.prototype.clear=function(){
	    this.storage.clear();
	}
	Storage.prototype.flash=function(msg)
	{
	    if(typeof(msg)=='undefined')
	    {
	        return this.remove("__flash__");
	    }else
	    {
	        this.set("__flash__",msg);
	    }
	}

	//session only happens during the application runtime

	Session=function(){
	    this.data=new Object();
	}

	Session.prototype.reset=function()
	{
		this.data=new Object();
	}

	Session.prototype.set = function(key,value) {
		path(this.data,key,value);
	};

	Session.prototype.get = function(key) {
		return path(this.data,key);
	};
	Session.prototype.fetch = function(key) {
	    var ret= this.data[key];
	    delete this.data[key];
	    return ret;
	};

	Session.prototype.getObject = function(key,constructor) {
		var val=path(this.data,key);
	    if("undefined"==typeof val){
	        if(constructor){
	        	val=new constructor();
	        }
	        else
	        {
	        	val=new Object();
	        }
	        path(this.data,key,val);
	    }
	    return val;
	};
	Session.prototype.setFromPage=function(id){
	    var value=$("#"+id).val();
	    var ret=true;
	    if(isEmpty(value,"")){
	        var ret=false;
	    }
	    this.data[id]=value;
	    return ret;
	}

	Session.prototype.remove=function(key)
	{
		delete this.data[key];
	}

	Session.prototype.setSystem=function(key,value)
	{
		this.set("_"+key+"_",value);
	}
	Session.prototype.getSystem=function(key,value)
	{
		return this.get("_"+key+"_");
	}
	Session.prototype.removeSystem=function(key,value)
	{
		this.remove("_"+key+"_");
	}
	Session.prototype.hasFlashMessage=function()
	{
		return !isNull(this.get("__flash__"))
	}
	Session.prototype.flash=function(msg)
	{
	    if(typeof(msg)=='undefined')
	    {
	        var ret=this.get("__flash__");
	        this.remove("__flash__");
	        return ret;
	    }else
	    {
	        this.set("__flash__",msg);
	    }
	}

	//parameter is used to transfer the data between pages
	Parameter=function(){
	    this.data=new Object();
	}
	Parameter.prototype.set = function(key,value) {
		path(this.data,key,value);
	};

	Parameter.prototype.get = function(key) {
		return path(this.data,key);
	};
	Parameter.prototype.fetch = function(key) {
	    var ret= this.data[key];
	    delete this.data[key];
	    return ret;
	};
	Parameter.prototype.setById=function(id){
	    var value=$("#"+id).val();
	    var ret=true;
	    if(isEmpty(value,"")){
	        var ret=false;
	    }
	    this.data[id]=value;
	    return ret;
	}
	context.storage=new Storage();
	context.session=new Session();
	context.parameter=new Parameter();
})(this);