(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Unordered_callback = function(is_unlocked)
	{
		this.array = new Array()
		is_unlocked ? this.is_unlocked = true : this.is_unlocked = false
		cosmos2D.loop.callback.subscribe(this, 'apply')
	}

	PROPERTY.Unordered_callback.prototype.insert = function(object, method)
	{
		var position = this.array.push(new cosmos2D.CORE.Event_handler()) - 1
		this.array[position].subscribe(object, method)
	}

	PROPERTY.Unordered_callback.prototype.apply = function()
	{
		if(this.is_unlocked)
		{
			for(var i = 0; i < this.array.length; i++)
			{
				this.array[i].fire()
			}
		}
	}

	PROPERTY.Unordered_callback.prototype.lock = function()
	{
		this.is_unlocked ? this.is_unlocked = false : this.is_unlocked = true
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));