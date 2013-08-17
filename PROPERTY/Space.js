(function(cosmos2D, undefined)
{
    var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Space = function(entity, asset)
	{
		this.parse_asset(entity, asset, {})
		this.canvas = cosmos2D.renderer.canvas
	    this.quad_tree = new cosmos2D.ADT.Quad_tree(this.canvas.width, this.canvas.height, 2, 10)
		cosmos2D.loop.callback.subscribe(this, 'update')
	}

	PROPERTY.Space.prototype.add = function(entity)
	{
	    this.quad_tree.add(entity)
	}

	PROPERTY.Space.prototype.remove = function(entity)
	{
	    this.quad_tree.remove(entity)
	}

	PROPERTY.Space.prototype.render = function()
	{
	    this.quad_tree.render()
	}

	PROPERTY.Space.prototype.update = function(time)
	{
	    this.quad_tree.update(time)
	}

	PROPERTY.Space.prototype.show = function()
	{
	    this.quad_tree.show()
	}

	PROPERTY.Space.prototype.toggle_fullscreen = function()
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