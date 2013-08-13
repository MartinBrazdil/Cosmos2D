(function(cosmos2D, undefined)
{

	cosmos2D.parse_asset = function(entity, asset, initialization)
	{
		// RegExps used for custom value parsersing (provides custom cosmos2D asset value types)
		var parsers = {
			value_binding: /^\w+\[\w+\]$/,
			event_subscribing: /^\w+\(\w+\)$/
		}

		// Parse and save values defined in asset
		for(key in asset)
		{
			// Simple value binding makes value of another asset accesible via get/set function
			if(parsers.value_binding.test(asset[key]))
			{
				var target_asset = /^\w+/.exec(asset[key])[0]
				var target_attribute = /\w+/.exec(/\[.*\]/.exec(asset[key])[0])[0]
				// It has to be wrapped in ann. function to change scope, otherwise all
				// parameters would be same
				// ;(function(asset, target_asset, target_attribute) {
				// 	asset['get_'+key] = function() {
				// 		return entity[target_asset][target_attribute]
				// 	}
				// 	asset['set_'+key] = function(value) {
				// 		entity[target_asset][target_attribute] = value
				// 	}
				// })(this, target_asset, target_attribute)
				;(function(asset, target_asset, target_attribute) {
					asset[key] = function(value) {
						if(value == undefined)
						{
							return entity[target_asset][target_attribute]
						}
						entity[target_asset][target_attribute] = value
					}
				})(this, target_asset, target_attribute)
			}
			// Method value binding runs method when another asset's event is fired
			else if(parsers.event_subscribing.test(asset[key]))
			{
				var target_asset = /^\w+/.exec(asset[key])[0]
				var target_event = /\w+/.exec(/\(.*\)/.exec(asset[key])[0])[0]
				entity[target_asset][target_event].subscribe(this, key)
			}
			// Add javascript primitives
			else
			{
				this[key] = asset[key]
			}
		}

		// Parse values and they defaults defined in initialization or test type constrain
		for(key in initialization)
		{
			// Add new values and initialize them to default
			if(!this[key])
			{
				this[key] = initialization[key]
			}
			else
			// If key is alredy defined instead of adding default value test present value against it's type
			{
				// Simple test for javascript primitives
				if(typeof this[key] !== typeof asset[key])
				{
					// If not primitive then test it for custom values (which are parsed via RegExps in parsers object)
					var is_not_special_type = true
					for(special_type in parsers)
					{
						// If it is tested special variable then set flag and break
						if(parsers[special_type].test(asset[key]))
						{
							is_not_special_type = false
							break
						}
					}
					// If it is not a custom type then throw constrain violation error
					if(is_not_special_type)
					{
						throw(Error('IN cosmos2D.parse_asset WITH [entity '+entity.id+'] [asset '+asset.id+']: value type constrain violation.'))
					}
				}
			}
		}
		if(asset.callback)
		{
			if(!entity[asset.callback])
			{
				entity[asset.callback] = new cosmos2D.PROPERTY[asset.callback]()
			}
			entity[asset.callback].insert(this, 'apply', this.order)
		}
		else
		{
			console.log('Warning: IN "cosmos2D.parse_asset" WITH [entity '+entity.id+'] [asset '+asset.id+']: entity has no callback.')
		}

		console.log(this)
	}


}(window.cosmos2D = window.cosmos2D || new Object()));