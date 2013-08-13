(function(cosmos2D, undefined)
{
	var RESOURCE = cosmos2D.RESOURCE = cosmos2D.RESOURCE || new Object()

	RESOURCE.Sound = function(source_path)
	{
		this.audio = new Audio()
		this.change_source(source_path)
	}

	RESOURCE.Sound.prototype.change_source = function(source_path)
	{
		if(typeof source_path !== 'undefined')
		{
			if(this.audio.canPlayType('audio/'+source_path.match(/mp3|ogg|mp4|mpeg/)) != "")
			{
				var source = document.createElement('source')
				source.src = source_path
				if (death_sound.canPlayType('audio/mpeg;'))
				{
				    source.type= 'audio/mpeg'
				    source.src= source_path
				}
				else
				{
				    source.type= 'audio/ogg'
				    source.src= source_path
				}
				this.audio.appendChild(source)
			}
			else
			{
				console.log('Incompatible sound format: ' + source)
			}
		}
	}

	RESOURCE.Sound.prototype.play = function(loop_flag)
	{
		this.audio.loop = loop_flag
		this.audio.play()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));