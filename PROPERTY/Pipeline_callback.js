(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Pipeline_callback = function(is_unlocked)
	{
		this.array = new Array(10)
		is_unlocked ? this.is_unlocked = true : this.is_unlocked = false
		cosmos2D.time.callback.subscribe(this, 'apply')
	}

	PROPERTY.Pipeline_callback.prototype.insert = function(object, method, order)
	{
		while(order > this.array.length)
		{
			this.array = this.array.concat(new Array(10))
		}
		this.array[order] = new cosmos2D.CORE.Event_handler()
		this.array[order].subscribe(object, method)
	}

	PROPERTY.Pipeline_callback.prototype.apply = function()
	{
		if(this.is_unlocked)
		{
			for(var i = 0; i < this.array.length; i++)
			{
				if(this.array[i])
				{
					this.array[i].fire()
				}
			}
		}
	}

	PROPERTY.Pipeline_callback.prototype.lock = function()
	{
		this.is_unlocked ? this.is_unlocked = false : this.is_unlocked = true
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));