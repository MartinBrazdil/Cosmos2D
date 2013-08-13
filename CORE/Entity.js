(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Entity = function(id, assets)
	{
		// Checking assets validity
		if(assets === undefined || id === undefined)
		{
			throw(Error('Malformed assets!'))
		}

		// Set id
		this.id = id
		this.assets = assets

		this.time_callback = new cosmos2D.PROPERTY.Unordered_callback()

		// Adding new entity into Teserakt for easy access
		cosmos2D.memory.world.insert(id, this)

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