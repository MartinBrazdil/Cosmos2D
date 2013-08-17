(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Buffered_average = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			target: 0,
			max_buffer_length: 100,
			round: true,
			total: 0,
			average: 0
		})
		this.buffer = new Array()
	}

	PROPERTY.Buffered_average.prototype.apply = function()
	{
		var new_value = this.target()
		this.total(this.total()+new_value)
		if(this.buffer.push(new_value) == this.max_buffer_length())
		{
			this.total(this.total()-this.buffer.shift())
		}
		this.average(this.total()/this.buffer.length)
		if(this.round())
		{
			this.average(Math.round(this.average()))
		}
	}

}(window.cosmos2D = window.cosmos2D || new Object()));