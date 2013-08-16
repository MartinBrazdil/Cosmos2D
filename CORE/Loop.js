(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Loop = function() 
	{
		this.fps = 30
		this.ms = (new Date()).getTime()
		this.callback = new cosmos2D.CORE.Event_handler()
	}

	CORE.Loop.prototype.run = function()
	{
	    this.ms = (new Date()).getTime()
	    cosmos2D.renderer.clear()
	    this.callback.fire(this.ms)
	    var time_left = 1000/this.fps - ((new Date()).getTime() - this.ms)
	    setTimeout("cosmos2D.loop.run()", time_left)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));