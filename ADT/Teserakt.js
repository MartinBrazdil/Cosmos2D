(function(cosmos2D, undefined)
{
	var ADT = cosmos2D.ADT = cosmos2D.ADT || new Object()

	ADT.Teserakt = function()
	{
		this.big_bang = new ADT.Teserakt.prototype.Dimension()
	}

	ADT.Teserakt.prototype.Dimension = function()
	{
		this.space = [null,null,null,null,null,null,null,
					  null,null,null,null,null,null,null,
					  null,null,null,null,null,null,null,
					  null,null,null,null,null]
		this.counter = 0
	}

	ADT.Teserakt.prototype.insert = function(key, value)
	{
		var space = this.big_bang.space
		this.big_bang.counter += 1
		for(var i = 0; i < key.length; i++)
		{
			var wormhole = key.charCodeAt(i)-97
			if(space[wormhole] == null)
			{
				space[wormhole] = new ADT.Teserakt.prototype.Dimension()
			}
			space[wormhole].counter++
			space = space[wormhole].space
		}
		space.value = value
		return space.value
	}

	ADT.Teserakt.prototype.find = function(key)
	{
		var space = this.big_bang.space
		for(var i = 0; i < key.length; i++)
		{
			var wormhole = key.charCodeAt(i)-97
			if(space[wormhole] == null)
			{
				return false
			}
			else
			{
				space = space[wormhole].space
			}
		}
		return space.value
	}

	ADT.Teserakt.prototype.delete = function(key)
	{
		var visited = new Array()
		visited.unshift([this.big_bang, 0])
		var space = this.big_bang.space
		for(var i = 0; i < key.length; i++)
		{
			var wormhole = key.charCodeAt(i)-97
			if(space[wormhole] == null)
			{
				return false
			}
			else
			{
				visited.unshift([space[wormhole], wormhole])
				space = space[wormhole].space
			}
		}
		space.value = ''
		for(var i = 0; i < visited.length-1; i++)
		{
			if(--(visited[i][0].counter) == 0)
			{
				visited[i+1][0].space[visited[i][1]] = null
			}
		}
		return true
	}

	ADT.Teserakt.prototype.find_all = function(space, key)
	{
		// nejlip asi prepsat z rekurze na iteraci
		var values
		if(space === undefined)
		{
			space = this.big_bang.space
		}
		if(key === undefined)
		{
			key = new String()
		}
		for(var i = 0; i < 26; i++)
		{
			if(space[i] !== null)
			{
				values = this.find_all(space[i].space, key + String.fromCharCode(i+97))
			}
		}
		if(values === undefined)
		{
			values = new Array()
		}
		if(space.value !== undefined)
		{
			values.push(space.value)
		}
		return values
	}

	// ADT.Teserakt.prototype.find_all = function(space, key)
	// {
	// 	var space = this.big_bang.space
	// 	var key = new String()
	// 	for(var i = 0; i < 26; i++)
	// 	{

	// 	}
	// }
	
}(window.cosmos2D = window.cosmos2D || new Object()));