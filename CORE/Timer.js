(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()
	
	CORE.Timer = function()
	{
	    this.current_time = 0
	    this.last_time = 0
	    this.elapsed = 0
	}

	CORE.Timer.prototype.elapsed_since_last_frame = function()
	{
	    return this.current_time - this.last_time
	}

	CORE.Timer.prototype.elapsed_since_last_reset = function()
	{
	    return this.elapsed
	}

	CORE.Timer.prototype.update = function(time)
	{
	    this.last_time = this.current_time
	    this.current_time = time
	    this.elapsed += this.elapsed_since_last_frame()
	}

	CORE.Timer.prototype.reset = function()
	{
	    this.elapsed = 0
	}

}(window.cosmos2D = window.cosmos2D || new Object()));