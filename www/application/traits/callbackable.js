exports.callbackable={
    events:{error:function(error){console.error(error)}},
    on:function(eventname,callback)
    {
        if('undefined' === typeof this.events || this.events===null)
        {
            this.events=new Object();
        }
        if(arguments.length==1)
        {
            this.events["_lastbindedfunction"]=arguments[0];
        }else{
            this.events[eventname]=callback;
        }
        
        return this;
    },
    unbind:function(eventname)
    {
        delete this.events[eventname];
    },
    error:function(error)
    {
        this._error=error;
        this.trigger("error");
    },
    trigger:function(eventname)
    {
        if(typeof this.events[eventname]==="function")
        {
            this.events[eventname].apply(this);
        }else if(typeof this.events[eventname]==="string")
        {
            console.log(this.events[eventname]);
        }
        else
        {
            if(typeof this.events["_lastbindedfunction"]=="function")
            {
                this.events["_lastbindedfunction"].apply(this);
                this.events["_lastbindedfunction"]=null;
            }else
            {
                console.error("callback function for '"+eventname+"' isn't defined");
            }
            
        }
    }
}