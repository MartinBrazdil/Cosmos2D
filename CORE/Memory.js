(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Memory = function()
	{
		this.data  = new Object()
		this.universe = new cosmos2D.ADT.Teserakt()
	}

	CORE.Memory.prototype.image = function(path)
	{
		if(!this.data.hasOwnProperty(path))
		{
			this.data[path]     = new Image()
			this.data[path].src = path
		}
		return this.data[path]
	}

	CORE.Memory.prototype.audio = function(path)
	{
		if(!this.data.hasOwnProperty(path))
		{
			this.data[path] = new Audio()
			if(this.data[path].canPlayType('audio/'+path.match(/mp3|ogg|mp4|mpeg/)) != "")
			{
				var source = document.createElement('source')
				source.src = path
				if(this.data[path].canPlayType('audio/mpeg;'))
				{
				    source.type= 'audio/mpeg'
				    source.src= path
				}
				else
				{
				    source.type= 'audio/ogg'
				    source.src= path
				}
				this.data[path].appendChild(source)
			}
			else
			{
				console.log('Incompatible sound format: ' + source)
			}
		}
		return this.data[path]
	}
		

}(window.cosmos2D = window.cosmos2D || new Object()));