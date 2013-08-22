(function(cosmos2D, undefined)
{

	cosmos2D.parse_asset = function(entity, asset, initialization)
	{
		// RegExps used for custom value parsersing (provides custom cosmos2D asset value types)
		var parsers = {
			entity_binding: /^<\w+>\w+(\(|\[).*$/,
			value_binding: /^\w+\[\w+\]$/,
			event_subscribing: /^\w+\(\w+\)$/
		}
		
		// Parse values defined in asset
		for(key in asset)
		{
			var value = asset[key]
			var target_entity = entity
			// If asset is bound to another entity set target entity
			if(parsers.entity_binding.test(value))
			{
				target_entity_id = /\w+/.exec(/^<\w+>/.exec(value)[0])[0]
				value = value.replace('<'+target_entity_id+'>', '')
				target_entity = cosmos2D.memory.universe.find(target_entity_id)
			}
			// Simple value binding makes value of another asset accesible via get/set function
			if(parsers.value_binding.test(value))
			{
				var target_property = /^\w+/.exec(value)[0]
				var target_attribute = /\w+/.exec(/\[.*\]/.exec(value)[0])[0]
				// It has to be wrapped in ann. function to change scope, otherwise all
				// parameters would be same
				;(function(asset, target_entity, target_property, target_attribute) {
					asset[key] = function(value) {
						if(value == undefined)
						{
							return target_entity[target_property][target_attribute]()
						}
						target_entity[target_property][target_attribute](value)
					}
				})(this, target_entity, target_property, target_attribute)
			}
			// Method value binding runs method when another asset's event is fired
			else if(parsers.event_subscribing.test(value))
			{
				var target_property = /^\w+/.exec(value)[0]
				var target_event = /\w+/.exec(/\(.*\)/.exec(value)[0])[0]
				target_entity[target_property][target_event].subscribe(this, key)
			}
			// Add javascript primitives
			else
			{
				this['_'+key] = asset[key]
				;(function(property, entity, property_id, key) {
					property[key.substring(1)] = function(value) {
						if(value == undefined)
						{
							return entity[property_id][key]
						}
						entity[property_id][key] = value
					}
				})(this, entity, asset.id, '_'+key)
			}
		}

		// Parse values and their defaults defined in initialization or test type constrain
		for(key in initialization)
		{
			// Add new values and initialize them to default
			if(!this[key])
			{
				this['_'+key] = initialization[key]
				;(function(property, entity, property_id, key) {
					property[key.substring(1)] = function(value) {
						if(value == undefined)
						{
							return entity[property_id][key]
						}
						entity[property_id][key] = value
					}
				})(this, entity, asset.id, '_'+key)
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
					// if(is_not_special_type)
					// {
					// 	throw(Error('IN cosmos2D.parse_asset WITH [entity '+entity.id+'] [asset '+asset.id+']: value type constrain violation.'))
					// }
				}
			}
		}

		console.log(this)
	}


}(window.cosmos2D = window.cosmos2D || new Object()));