(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Model = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			model: undefined,
			pivot_x: 0,
			pivot_y: 0,
			rotation: undefined
		})
	}

	PROPERTY.Model.prototype.apply = function()
	{
		cosmos2D.renderer.context.save()
	    cosmos2D.renderer.context.translate(this.x(), this.y())
	    cosmos2D.renderer.context.rotate((this.rotation()*2*Math.PI)/360)
	    cosmos2D.renderer.context.drawImage(cosmos2D.memory.image(this.model()), -this.pivot_x(), -this.pivot_y())
		cosmos2D.renderer.context.restore()
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));
