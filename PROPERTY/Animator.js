(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Animator = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			animation: '',
			frames: 0,
			fps: cosmos2D.time.fps,
			target: 'Model[model]',
			iterator: 0,
			frame_counter: 0,
			original: undefined
		})
		if(this.original == undefined)
		{
			this.original = this.target()
		}
	}

	PROPERTY.Animator.prototype.apply = function()
	{
		
	}

	PROPERTY.Animator.prototype.play = function()
	{
		if(this.original == undefined)
		{
			this.original = this.target()
		}
		this.frameskip = cosmos2D.time.fps / this.fps
		if(this.frame_counter >= this.frameskip)
		{
			this.frame_counter = 0
			this.iterator = (this.iterator + 1) % this.frames
			this.target(this.animation.replace(/\./, '_'+this.iterator+'.'))
		}
		this.frame_counter++
	}

	PROPERTY.Animator.prototype.stop = function()
	{
		this.target(this.original)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));