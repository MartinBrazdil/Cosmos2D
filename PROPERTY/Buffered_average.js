(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Buffered_average = function(entity, property)
	{
		this.parse_asset(entity, property, {target: 0, max_buffer_length: 100, round: true})

		this.buffer = new Array()
		this.total = 0
		this.average = 0
	}

	PROPERTY.Buffered_average.prototype.apply = function()
	{
		var new_value = this.target()
		this.total += new_value
		if(this.buffer.push(new_value) == this.max_buffer_length)
		{
			this.total -= this.buffer.shift()
		}
		this.average = this.total / this.buffer.length
		if(this.round)
		{
			this.average = Math.round(this.average)
		}
	}

}(window.cosmos2D = window.cosmos2D || new Object()));