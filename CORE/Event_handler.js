(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Event_handler = function()
	{
		this.listeners = new Array()
	}

	CORE.Event_handler.prototype.subscribe = function(object, method)
	{
		this.listeners.push({object: object, method: method})
	}

	CORE.Event_handler.prototype.unsubscribe = function(object, method)
	{
		for(var i = 0; i < this.listeners.length; i++)
		{
			if(this.listeners[i].object === object && this.listeners[i].method === method)
			{
				this.listeners.splice(i, 1)
				return
			}
		}
	}

	CORE.Event_handler.prototype.unsubscribe_all = function(object)
	{
		for(var i = 0; i < this.listeners.length; i++)
		{
			if(this.listeners[i].object === object)
			{
				this.listeners.splice(i, 1)
			}
		}
	}

	CORE.Event_handler.prototype.fire = function(event)
	{
		for(var i = 0; i < this.listeners.length; i++)
		{
			this.listeners[i].object[this.listeners[i].method].call(this.listeners[i].object, event)
		}
	}

}(window.cosmos2D = window.cosmos2D || new Object()));