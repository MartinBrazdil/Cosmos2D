(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Physics = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			draw: true
		})
		this.bounding_box = new cosmos2D.PHYSICS.Bounding_box(this, new cosmos2D.MATH.Vector2D(58, 64))
		// cosmos2D.space.add(this)
	}

	PROPERTY.Physics.prototype.apply = function()
	{
		// cosmos2D.space.render_structure()
		this.bounding_box.draw()
	}

	PROPERTY.Physics.prototype.on_collision = function(scene_object)
	{
	}

}(window.cosmos2D = window.cosmos2D || new Object()));