(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Time = function(entity, asset)
	{
		this.parse_asset(entity, asset, {})
		cosmos2D.loop.callback.subscribe(this, 'tick')
		this.tick_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Time.prototype.tick = function()
	{
		this.tick_event.fire()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));