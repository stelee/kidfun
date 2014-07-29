function XString(){
	if(arguments.length==0){
		this._string=new String();
	}else{
		if('string'==typeof(arguments[0]))
		{
			this._string=arguments[0];
		}else
		{
			this._string=arguments[0].toString();
		}
	}
}
XString.prototype.asXString = function() {
	if(arguments.length==0){
		this._string=new String();
	}else{
		if('string'==typeof(arguments[0]))
		{
			this._string=arguments[0];
		}else
		{
			this._string=arguments[0].toString();
		}
	}
};
XString.prototype.toString=function(){
	return this._string;
}
XString.prototype.bind=function(){
	var reg=/\{\{(\w+.)*\w+\}\}/g;
	var path=require('libs/utils/path').path;
	if(arguments.length==1){//either this is a single binding or map binding
		if('string'==typeof(arguments[0])){
			this._string=this._string.replace(reg,arguments[0]);
		}else{
			var dataMap=arguments[0];
			//rebuild the datamap
			var dataMap2={};
			var matches=this._string.match(reg);
			if(matches==null)
			{
				return this;
			}
			for(var i=0;i<matches.length;i++)
			{
				var match=matches[i];
				var prop=match.substring(2,match.length-2);
				var value=path(dataMap,prop);
				if(value!=null)
				{
					dataMap2[prop]=value;
				}

			}

			for(var prop in dataMap2){
				var reg=new RegExp("\{\{"+prop+"\}\}","g");
				this._string=this._string.replace(reg,dataMap2[prop]);
			}
		}
	}else{//multiple argument bind
		for(var i=0;i<arguments.length;i++){
			var reg=new RegExp("\{\{["+i+"]\}\}","g");
			this._string=this._string.replace(reg,arguments[i]);
		}
	}
	return this;
}

var isNull=function(obj){
	 if(typeof(obj)=='undefined')
    {
        return true;
    }
    if(obj==null)
    {
        return true;
    }
    return false;
}

exports.xstring=function(){
	var instance=new XString();
	instance.asXString.apply(instance,arguments);
	return instance;
}
exports.sqlFormat=function(value){
	if('boolean' == typeof value)
	{
		if(value)
		{
			return 1;
		}else
		{
			return 0;
		}
	}
	else if(isNull(value))
  {
      return "null";
  }
  else if("number" == typeof value){
      return value;
  }else
  {
      return "'"+value.replace(/\'/g,"''")+"'"
  }
}

exports.isNull=isNull;
