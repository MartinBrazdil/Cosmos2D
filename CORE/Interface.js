(function(cosmos2D, undefined)
{
	cosmos2D.run = function()
	{
		// CORE objects initialization
		this.renderer = new cosmos2D.CORE.Renderer()
		this.memory = new cosmos2D.CORE.Memory()
		this.time = new cosmos2D.CORE.Time()
		this.space = new cosmos2D.PHYSICS.Space()
		this.input = new cosmos2D.CORE.Input_listener()

		// CORE services
		this.time.loop()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));