(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Entity = function(assets, id)
	{
		// Checking assets validity
		if(assets === undefined)
		{
			throw(Error('Attempt to create entity with asset == undefined!'))
		}

		// Memorize assets
		// this.assets = assets

		// If it has ID, track it by id
		if(id != undefined)
		{
			// this.id = id

			// this.time_callback = new cosmos2D.PROPERTY.Unordered_callback()

			// Adding new entity into Teserakt for easy access
			cosmos2D.memory.universe.insert(id, this)
		}
		
		// Creating entity's properties
		for(asset in assets)
		{
			this.add_property(assets[asset], asset)
		}
	}

	// WRITE ALSO REMOVE PROPERTY
	// MAKE REMOVE/ADD PROPERTY FUNCTION RESOLVE BINDINGS
	CORE.Entity.prototype.add_property = function(asset, asset_name)
	{
		// Checking if property constructor exists
		var constructor = cosmos2D.PROPERTY[asset_name]
		if(constructor === undefined)
		{
			throw(Error('Property "'+asset_name+'" not found while creating entity using "'+this.id+'" assets!'))
		}

		// RENAME PARSE ASSET TO SET PROPERTIES (better readability for user while coding properties)
		constructor.prototype.parse_asset = cosmos2D.parse_asset

		// If id is not defined use pattern name instead
		if(!asset.id)
		{
			asset.id = asset_name
		}

		// Creating property while instantly binding it to entity
		this[asset.id] = new constructor(this, asset)
	}

	CORE.Entity.prototype.destroy = function()
	{
		for(var member in myObject) delete myObject[member]
	}

	CORE.Entity.prototype.split = function(asset_ids)
	{
		console.log(this)
		other = new cosmos2D.CORE.Entity({})
		for(var property in this)
		{
			if(asset_ids.indexOf(property) != -1)
			{
				other[property] = this[property]
				console.log(other)
				delete this[property]
			}
		}
	}

	// MUTATION hashmap: property->exemplar
	// THIS CAN MERGE MULTIPLE ENTITIES
	CORE.Entity.prototype.merge = function(entity)
	{
		try
		{
			// merge
		}
		catch(e)
		{
			return false
		}
		return true
	}

}(window.cosmos2D = window.cosmos2D || new Object()));