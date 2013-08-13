(function(cosmos2D, undefined)
{
	var RESOURCE = cosmos2D.RESOURCE = cosmos2D.RESOURCE || new Object()

	// naming convention: name_x, where name is parameter string, x is iterator from 0 to range
	RESOURCE.Animation = function(entity, asset)
	{
		// name, range, speed
		this.image_sequence = cosmos2D.memory.animation()
		this.iterator = 0
		this.speed = speed
		this.timer = new Timer()

		this.load(name, range)
	}

	RESOURCE.Animation.prototype.load = function(name, range)
	{
		for (var i = 0; i < range; i++)
		{
			this.image_sequence[i] = new Image()
			
			this.image_sequence[i].src = name+"_"+i+".png"
		}
	}

	RESOURCE.Animation.prototype.update = function(time)
	{
		this.timer.update(time)
		if(this.timer.elapsed_since_last_reset() > this.speed / FPS)
		{
			this.iterator = (this.iterator + 1) % this.image_sequence.length
			this.timer.reset()
		}
	}

	RESOURCE.Animation.prototype.image = function()
	{
		return this.image_sequence[this.iterator]
	}

}(window.cosmos2D = window.cosmos2D || new Object()));