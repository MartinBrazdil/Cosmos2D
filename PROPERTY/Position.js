(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Position = function(entity, asset)
	{
		this.parse_asset(entity, asset, {x: 0, y: 0})
	}

	PROPERTY.Position.prototype.apply = function()
	{
	    cosmos2D.renderer.context.translate(this.x, this.y)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));