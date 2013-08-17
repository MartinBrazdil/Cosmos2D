(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Collisions = function(entity, asset)
	{
		this.parse_asset(entity, asset, {})
		this.canvas = cosmos2D.renderer.canvas
	    this.quad_tree = new cosmos2D.ADT.Quad_tree(cosmos2D.renderer.canvas.width, cosmos2D.renderer.canvas.height, 2, 10)
		cosmos2D.loop.callback.subscribe(this, 'update')
		this.collect_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Collisions.prototype.add = function(entity)
	{
	    this.quad_tree.add(entity)
	}

	PROPERTY.Collisions.prototype.remove = function(entity)
	{
	    this.quad_tree.remove(entity)
	}

	PROPERTY.Collisions.prototype.render = function()
	{
	    this.quad_tree.render()
	}

	PROPERTY.Collisions.prototype.update = function(time)
	{
	    this.quad_tree.update(time)
	}

	PROPERTY.Collisions.prototype.show = function()
	{
	    this.quad_tree.show()
	}

	PROPERTY.Collisions.prototype.toggle_fullscreen = function()
	{
		if(!document.mozFullScreen && !document.webkitFullScreen)
		{
			if(this.canvas.mozRequestFullScreen)
			{
				this.canvas.mozRequestFullScreen()
			}
			else
			{
				this.canvas.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
			}
		}
		else
		{
			if(document.mozCancelFullScreen) 
			{
				document.mozCancelFullScreen()
			} 
			else 
			{
				document.webkitCancelFullScreen()
			}
		}
	}

}(window.cosmos2D = window.cosmos2D || new Object()));