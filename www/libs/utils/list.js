function List(){
	this._array=new Array();
}
List.prototype.asList = function() {
	this._array=new Array();
	if(arguments.length==0){
		//do nothing
	}else if(arguments.length==1){
		if(Array.isArray(arguments[0]))
		{
			this._array = arguments[0];
		}else
		{
			this._array.push(arguments[0]);
		}
		
	}else
	{
		for(var i=0; i<arguments.length;i++){
			this._array.push(arguments[i])
		}
	}
	return this;
};

List.prototype.setArray=function(array){
	this._array=array;
}

List.prototype.length = function() {
	return this._array.length;
};
List.prototype.each=function(fnEach,fnFinished,currentIndex){
	if('undefined'==typeof(fnFinished))
	{
		fnFinished=function(){
			//void;
		}
	}
	if(fnEach.length<=1){
		for(var i=0;i<this._array.length;i++){
			fnEach(this._array[i]);
		}
		fnFinished();
	}else
	{
		var index=currentIndex||0;
		
		if(index>=this._array.length){
			fnFinished();
		}else{
			var that=this;

			fnEach(this._array[index],function(){
				index++;
				that.each(fnEach,fnFinished,index);
			})
		}
		
	}
}
List.prototype.run=function(){
	this.each(
		function(fn,next)
		{
			fn(next);
		}
	);
}

List.prototype.get=function(index){
	return this._array[index];
}
List.prototype.push=function(elem){
	this._array.push(elem);
	return this;
}
List.prototype.asArray=function(){
	return this._array;
}

List.prototype.remove=function(index){

}

exports.list=function(){
	var list=new List();
	list.asList.apply(list,arguments);
	return list;
}