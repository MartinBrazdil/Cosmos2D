(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Animator = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			animation: '',
			frames: 0,
			fps: cosmos2D.loop.fps,
			target: 'Model[model]',
			iterator: 0,
			frame_counter: 0,
			frameskip: 1,
			original: undefined
		})
		if(this._original == undefined)
		{
			this._original = this.target()
		}
	}

	PROPERTY.Animator.prototype.play = function()
	{
		this.frameskip(cosmos2D.loop.fps / this.fps())
		if(this.frame_counter() >= this.frameskip())
		{
			this.frame_counter(0)
			this.iterator((this.iterator() + 1) % this.frames())
			this.target(this.animation().replace(/\./, '_'+this.iterator()+'.'))
		}
		this.frame_counter(this.frame_counter()+1)
	}

	PROPERTY.Animator.prototype.stop = function()
	{
		this.target(this.original())
	}

}(window.cosmos2D = window.cosmos2D || new Object()));