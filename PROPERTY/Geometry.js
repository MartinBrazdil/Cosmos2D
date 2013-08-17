(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Geometry = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			rotation_speed: 0,
			move_speed: 0,
			rotation: 0,
			x: 0,
			y: 0,
		})
	}

	PROPERTY.Geometry.prototype.apply = function()
	{
	    cosmos2D.renderer.context.translate(this.x(), this.y())
	}

	PROPERTY.Geometry.prototype.go_forward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2((this.rotation()*2*Math.PI)/360)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed(), 0))
	    this.x(this.x()+delta_position.x)
	    this.y(this.y()+delta_position.y)
	}

	PROPERTY.Geometry.prototype.go_backward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2((this.rotation()*2*Math.PI)/360)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed(), 0))
	    this.x(this.x()-delta_position.x)
	    this.y(this.y()-delta_position.y)
	}

	PROPERTY.Geometry.prototype.turn_left = function()
	{
		this.rotation(this.rotation()-this.rotation_speed())
	}
	
	PROPERTY.Geometry.prototype.turn_right = function()
	{
		this.rotation(this.rotation()+this.rotation_speed())
	}

}(window.cosmos2D = window.cosmos2D || new Object()));