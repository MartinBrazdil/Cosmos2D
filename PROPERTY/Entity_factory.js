(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Entity_factory = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			assets: undefined,
			bound: false,
			mode: 'free',	
			values: []
		})
		this._entity = entity
	}

	PROPERTY.Entity_factory.prototype.create = function()
	{
		eval_string = /^this\..*\)$/

		// Make changes to Asset
		for(var i = 0; i < this.values().length; i++)
		{
			if(eval_string.test(this.values()[i][2]))
			{
				console.log(eval(this.values()[i][2]))
				this.assets()[this.values()[i][0]][this.values()[i][1]] = eval(this.values()[i][2])
			}
			else
			{
				this.assets()[this.values()[i][0]][this.values()[i][1]] = this.values()[i][2]
			}
		}
		new cosmos2D.CORE.Entity(this.assets())

		// Make Property_factory Entity for 'binding' not modes its a mess
		// Entity_factory should create new Entities as name suggests1
		// switch(this.mode())
		// {
		// 	// Add created properties to same entity as this Entity factory is in
		// 	case 'merge':
		// 		for(var asset in this.assets())
		// 		{
		// 			// If property exists events subscriptions are than repeated
		// 			// (doubled, tripled... so on)
		// 			this._entity.add_property(this.assets()[asset], asset)
		// 		}
		// 		break
		// 	// Bind created properties to same entity as this Entity factory is in
		// 	case 'bind':
		// 		// var asset_ids = new Array()
		// 		// for(var asset in this.assets())
		// 		// {
		// 		// 	asset_ids.push(this.assets()[asset].id)
		// 		// 	this._entity.add_property(this.assets()[asset], asset)
		// 		// }
		// 		// this._entity.split(asset_ids).
		// 		break
		// 	// Create new Entity
		// 	case 'free':
		// 		new cosmos2D.CORE.Entity(this.assets())
		// }
	}

}(window.cosmos2D = window.cosmos2D || new Object()));