(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Fps_counter = function(entity, property)
	{
		this.parse_asset(entity, property, {fps: 0, last_frame_ms: cosmos2D.time.ms})
	}

	PROPERTY.Fps_counter.prototype.apply = function()
	{
		this.fps = Math.round(1000 / (cosmos2D.time.ms - this.last_frame_ms))
		this.last_frame_ms = cosmos2D.time.ms
	}

}(window.cosmos2D = window.cosmos2D || new Object()));