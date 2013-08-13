(function(cosmos2D, undefined)
{
    var RESOURCE = cosmos2D.RESOURCE = cosmos2D.RESOURCE || new Object()

    // naming convention: name_x, where name is parameter string, x is iterator from 0 to range
    RESOURCE.Audio_sequence = function(name, range)
    {
        this.audio_sequence = new Array()
        this.load(name, range)
    }

    RESOURCE.Audio_sequence.prototype.load = function(name, range)
    {
        for (var i = 0; i < range; i++)
        {
            this.audio_sequence[i] = new Audio()
            var source = document.createElement('source')
            if (this.audio_sequence[i].canPlayType('audio/mpeg;'))
            {
                source.type= 'audio/mpeg'
                source.src= name + "_" + i + ".mp3"
            } else
            {
                source.type= 'audio/ogg'
                source.src= name + "_" + i + ".ogg"
            }
            this.audio_sequence[i].appendChild(source)
    	}
    }

    RESOURCE.Audio_sequence.prototype.play = function()
    {
    	this.audio_sequence[Math.floor((Math.random()*this.audio_sequence.length))].play()
    }

}(window.cosmos2D = window.cosmos2D || new Object()));