(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Model = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: 0,
			y: 0,
			model: '',
			pivot_x: 0,
			pivot_y: 0,
			rotation: 0,
			move_speed: 5,
			rotation_speed: 0.1
		})
	}

	PROPERTY.Model.prototype.apply = function()
	{
		cosmos2D.renderer.context.save()
	    cosmos2D.renderer.context.translate(this.x, this.y)
	    cosmos2D.renderer.context.rotate(this.rotation)
	    cosmos2D.renderer.context.drawImage(cosmos2D.memory.image(this.model), -this.pivot_x, -this.pivot_y)
		cosmos2D.renderer.context.restore()
	}

	PROPERTY.Model.prototype.go_forward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2(this.rotation)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed, 0))
	    this.x += delta_position.x
	    this.y += delta_position.y
	}

	PROPERTY.Model.prototype.go_backward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2(this.rotation)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed, 0))
	    this.x -= delta_position.x
	    this.y -= delta_position.y
	}

	PROPERTY.Model.prototype.turn_left = function()
	{
		this.rotation -= 0.1
	}
	
	PROPERTY.Model.prototype.turn_right = function()
	{
		this.rotation += 0.1
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));
