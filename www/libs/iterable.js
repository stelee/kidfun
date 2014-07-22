var Iterable=function()
{
	this._index=-1;
	this._array=[];
}

Iterable.prototype.next=function()
{
	if(this._index>=this._array.length-1)
	{
		return null;
	}else
	{
		this._index++;
		return this._array[this._index];
	}
}
Iterable.prototype.hasNext=function()
{
	return this._index < (this._array.length-1)
}

Iterable.prototype.reset=function()
{
	this._index=-1;
}

Iterable.prototype.setArray=function(array)
{
	this._index=-1;
	this._array=array;
}

exports.getInstance=function(array)
{
	var it=new Iterable();
	it.setArray(array)
	return it;
}