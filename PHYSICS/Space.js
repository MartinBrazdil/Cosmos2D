(function(cosmos2D, undefined)
{
    var PHYSICS = cosmos2D.PHYSICS = cosmos2D.PHYSICS || new Object()

	PHYSICS.Space = function()
	{
		this.canvas = cosmos2D.renderer.canvas
		console.log(this.canvas.height, this.canvas.width)
	    this.scene = new cosmos2D.ADT.Quad_tree(this.canvas.width, this.canvas.height, 1, 1)
	}

	PHYSICS.Space.prototype.add = function(scene_object)
	{
	    this.scene.add_scene_object(scene_object)
	}

	PHYSICS.Space.prototype.remove = function(scene_object)
	{
	    this.scene.remove_scene_object(scene_object)
	}

	PHYSICS.Space.prototype.render_scene = function()
	{
	    this.scene.render_scene_objects()
	}

	PHYSICS.Space.prototype.update_scene = function(time)
	{
	    this.scene.update_scene_objects(time)
	}

	PHYSICS.Space.prototype.render_structure = function()
	{
	    this.scene.render_structure()
	}

	PHYSICS.Space.prototype.toggle_fullscreen = function()
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