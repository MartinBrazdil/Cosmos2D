(function(cosmos2D, undefined)
{
	cosmos2D.run = function()
	{
		// CORE objects initialization
		cosmos2D.renderer = new cosmos2D.CORE.Renderer()
		cosmos2D.memory = new cosmos2D.CORE.Memory()
		cosmos2D.loop = new cosmos2D.CORE.Loop()
		cosmos2D.input = new cosmos2D.CORE.Input_listener()

		// CORE services
		cosmos2D.loop.run()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));