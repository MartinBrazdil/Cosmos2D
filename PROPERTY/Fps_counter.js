(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Fps_counter = function(entity, asset)
	{
		this.parse_asset(entity, asset, {fps: 0, last_frame_ms: cosmos2D.loop.ms})
	}

	PROPERTY.Fps_counter.prototype.apply = function()
	{
		this.fps(Math.round(1000 / (cosmos2D.loop.ms - this.last_frame_ms())))
		this.last_frame_ms(cosmos2D.loop.ms)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));