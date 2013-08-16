(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Audio = function(entity, asset)
	{
		this.parse_asset(entity, asset, {audio: ''})
	}

	PROPERTY.Audio.prototype.play = function()
	{
		cosmos2D.memory.audio(this.audio).play()
	}

	PROPERTY.Audio.prototype.stop = function()
	{
		cosmos2D.memory.audio(this.audio).pause()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));