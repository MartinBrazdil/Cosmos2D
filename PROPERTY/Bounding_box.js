(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Bounding_box = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			pivot_x: 0,
			pivot_y: 0
		})
		this.collision_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Bounding_box.prototype.collision_system = function(collision_system)
	{
		return this
	}

	PROPERTY.Bounding_box.prototype.on_collision = function(entity)
	{
		this.collision_event.fire()
	}

	PROPERTY.Bounding_box.prototype.bl_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() - this.pivot_x() / 2, this.y() + this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.tl_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() - this.pivot_x() / 2, this.y() - this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.tr_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() + this.pivot_x() / 2, this.y() - this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.br_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() + this.pivot_x() / 2, this.y() + this.pivot_y() / 2)
	}

	// Collision detection between two boxes
	PROPERTY.Bounding_box.prototype.bounding_box_collision = function(bounding_box)
	{
	    return !(bounding_box.bl_p().x > this.tr_p().x
			|| bounding_box.tr_p().x < this.bl_p().x
			|| bounding_box.tr_p().y > this.bl_p().y
			|| bounding_box.bl_p().y < this.tr_p().y)
	}

	// Collision detection between bounding box and rectangle
	PROPERTY.Bounding_box.prototype.quad_tree_collision = function(bot_left_x, bot_left_y, top_right_x, top_right_y)
	{
	    return !(bot_left_x > this.tr_p().x
			|| top_right_x < this.bl_p().x
			|| top_right_y > this.bl_p().y
			|| bot_left_y < this.tr_p().y)
	}

	// Intersection with line defined by point and vector - ray
	PROPERTY.Bounding_box.prototype.line_intersection = function(point, vector)
	{
		return this.single_line_intersection(point, vector, this.bl_p(), new cosmos2D.MATH.Vector2D(this.tl_p().x - this.bl_p().x, this.tl_p().y - this.bl_p().y)) ||
		this.single_line_intersection(point, vector, this.tl_p(), new cosmos2D.MATH.Vector2D(this.tr_p().x - this.tl_p().x, this.tr_p().y - this.tl_p().y)) ||
		this.single_line_intersection(point, vector, this.tr_p(), new cosmos2D.MATH.Vector2D(this.br_p().x - this.tr_p().x, this.br_p().y - this.tr_p().y)) ||
		this.single_line_intersection(point, vector, this.br_p(), new cosmos2D.MATH.Vector2D(this.bl_p().x - this.br_p().x, this.br_p().y - this.bl_p().y))
	}

	// line 1: from point p to p+r
	// line 2: from point q to q+s
	PROPERTY.Bounding_box.prototype.single_line_intersection = function(p, r, q, s)
	{
		// p + tr = q + us
		// t = (q - p) x s / (r x s)
		// u = (q - p) x r / (r x s)
		var v = new cosmos2D.MATH.Vector2D(q.x - p.x, q.y - p.y); // v = (q - p)
		var t = (v.CrossProduct(s)) / (r.CrossProduct(s))
		var u = (v.CrossProduct(r)) / (r.CrossProduct(s))

		cosmos2D.renderer.context.save()
		point_yellow = new Image()
		point_yellow.src = "../js/resource/point_yellow.png"
		cosmos2D.renderer.context.drawImage(point_yellow, q.x + u * s.x - 4, q.y + u * s.y - 4)
		cosmos2D.renderer.context.restore()

		return t >= 0 && t <= 1 && u >= 0 && u <= 1
	}

	PROPERTY.Bounding_box.prototype.render = function()
	{
		cosmos2D.renderer.context.save()
		cosmos2D.renderer.context.beginPath()
		cosmos2D.renderer.context.moveTo(this.bl_p().x, this.bl_p().y)
		cosmos2D.renderer.context.lineTo(this.tl_p().x, this.tl_p().y)
		cosmos2D.renderer.context.lineTo(this.tr_p().x, this.tr_p().y)
		cosmos2D.renderer.context.lineTo(this.br_p().x, this.br_p().y)
		cosmos2D.renderer.context.lineTo(this.bl_p().x, this.bl_p().y)
		cosmos2D.renderer.context.lineWidth = 1
		cosmos2D.renderer.context.strokeStyle = "red"
		cosmos2D.renderer.context.stroke()
		cosmos2D.renderer.context.restore()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));