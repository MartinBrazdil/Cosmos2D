(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Renderer = function(canvas_id)
	{
		if(typeof canvas_id === 'undefined')
		{
			if(document.getElementsByTagName('canvas').length == 1)
			{
				this.canvas = document.getElementsByTagName('canvas')[0]
			}
			else
			{
				throw(Error('There are more then one canvas elements, specify target canvas by canvas_id parameter!'))
			}
		}
		else if(document.getElementById(canvas_id) == null)
		{
			throw(Error('Cant find canvas element!'))
		}
		else if(document.getElementById(canvas_id).localName == "canvas")
		{
			this.canvas = document.getElementById(canvas_id)
		}
		else
		{
			throw(Error('There is no canvas element with id', canvas_id))
		}

		// WebGL2D.enable(cvs)
		// this.context = this.canvas.getContext("webgl-2d")
		this.context = this.canvas.getContext("2d")
	}

	CORE.Renderer.prototype.clear = function()
	{
	    this.context.save()

	    this.context.setTransform(1, 0, 0, 1, 0, 0)
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

	    this.context.restore()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));