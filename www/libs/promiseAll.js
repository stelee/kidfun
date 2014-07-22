//This is not the implemenation of Promisee.all
//I need a better way to synchronized interate the array
var promiseAll=function(array,promiseFn)
{
	var fnArr=[];
	for(var i=0;i<array.length;i++)
	{
		fnArr.push(new Promise(function(resolve,reject){
			promiseFn(array[i],resolve,reject);
		}));
	}
	return Promise.all(fnArr);
}

exports.promiseAll=promiseAll;