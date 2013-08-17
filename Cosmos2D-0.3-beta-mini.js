(function(cosmos2D, undefined)
{
    var ADT = cosmos2D.ADT = cosmos2D.ADT || new Object()

    ADT.Quad_tree = function(width, height, capacity, max_depth)
    {
        this.entities = new Array()
        this.width = width
        this.height = height
        this.capacity = capacity
        this.max_depth = max_depth
        this.collision_event_listeners = new Array()
        this.root = new cosmos2D.ADT.Quad_tree.prototype.Inner_node(null, width / 2, height / 2, width / 2, height / 2)
        this.root.depth = 0
    }

    // Adds GO to the tree, optional parameter on_collision_method is GO's method name, which would be registered for on_collision_event
    ADT.Quad_tree.prototype.add = function(entity)
    {
        this.entities.push(entity)
        this.root.add(this, entity)
    }

    // Completely removes GO from tree, drops all registered event methods
    ADT.Quad_tree.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
        this.root.remove(entity, this.root)
    }

    // Renders quad tree structure visible
    ADT.Quad_tree.prototype.render = function()
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            this.entities[i].render()
        }
    }

    ADT.Quad_tree.prototype.quadrant_changed = function(entity)
    {
        return true
    }

    ADT.Quad_tree.prototype.update = function(time)
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            // tady by se to mohlo zlepsit teda...
            this.root.remove(this.entities[i], this.root)
            this.root.add(this, this.entities[i])
        }
    }

    // Renders quad tree structure visible
    ADT.Quad_tree.prototype.show = function()
    {
        this.root.show(1)
    }

    ADT.Quad_tree.prototype.Inner_node = function(parent_node, midpoint_x, midpoint_y, half_width, half_height)
    {
        this.parent_node = parent_node
        if(parent_node != null)
        {
            this.depth = parent_node.depth + 1
        }
        this.nodes = new Array(new cosmos2D.ADT.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.ADT.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.ADT.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.ADT.Quad_tree.prototype.Leaf_node(this))
        this.midpoint_x = midpoint_x
        this.midpoint_y = midpoint_y
        this.half_width = half_width
        this.half_height = half_height
        this.quadrant_signs = [[1,-1],[-1,-1],[-1,1],[1,1]]
    }

    // Quadrant order:
    // ^
    // |- - - >
    // |1 . 0
    // |. . .
    // |2 . 3
    ADT.Quad_tree.prototype.Inner_node.prototype.intersected_quadrants = function(entity)
    {
        var quadrants = new Array()
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y,
            this.midpoint_x + this.half_width,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(0)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y,
            this.midpoint_x,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(1)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y + this.half_height,
            this.midpoint_x,
            this.midpoint_y))
        {
            quadrants.push(2)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y + this.half_height,
            this.midpoint_x + this.half_width,
            this.midpoint_y))
        {
            quadrants.push(3)
        }
        return quadrants
    }

    ADT.Quad_tree.prototype.Inner_node.prototype.is_empty = function()
    {
        for(var i = 0; i < this.nodes.length; i++)
        {
            if(this.nodes[i] instanceof cosmos2D.ADT.Quad_tree.prototype.Inner_node)
            {
                return false // Does not contain only leaves
            }
            if(this.nodes[i].entities.length != 0)
            {
                return false // Leaf contains some GO
            }
        }
        return true
    }

    // add scene recursively to children
    ADT.Quad_tree.prototype.Inner_node.prototype.add = function(tree, entity)
    {
        var quadrants = this.intersected_quadrants(entity)
        for(var i = 0; i < quadrants.length; i++)
        {
            this.nodes[quadrants[i]].add(tree, entity)
        }
    }

    // If leaf reaches its capacity it must be replaced with inner node and splitted to his corresponding new quadrants (leafs)
    // this - parent of splitting leaf
    // splitting_leaf_node - leaf od this which is going to split
    // entity - given new object
    ADT.Quad_tree.prototype.Inner_node.prototype.split_leaf = function(tree, splitting_leaf_node, entity)
    {
        var quadrant = this.nodes.indexOf(splitting_leaf_node)
        var entities = this.nodes[quadrant].entities
        var new_midpoint_x = this.midpoint_x + (this.quadrant_signs[quadrant][0] * this.half_width / 2)
        var new_midpoint_y = this.midpoint_y + (this.quadrant_signs[quadrant][1] * this.half_height / 2)
        this.nodes[quadrant] = new cosmos2D.ADT.Quad_tree.prototype.Inner_node(this, new_midpoint_x, new_midpoint_y, this.half_width / 2, this.half_height / 2)
        for(var i = 0; i < entities.length; i++)
        {
            this.nodes[quadrant].add(tree, entities[i])
        }
        this.nodes[quadrant].add(tree, entity)
    }

    ADT.Quad_tree.prototype.Inner_node.prototype.show = function(depth)
    {
        cosmos2D.renderer.context.save()
        cosmos2D.renderer.context.beginPath()
        cosmos2D.renderer.context.moveTo(this.midpoint_x, this.midpoint_y - this.half_height)
        cosmos2D.renderer.context.lineTo(this.midpoint_x, this.midpoint_y + this.half_height)
        cosmos2D.renderer.context.moveTo(this.midpoint_x - this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.lineTo(this.midpoint_x + this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.font = ((1 / depth) * 40) + "pt Bitstream"
        cosmos2D.renderer.context.fillStyle = "white"
        cosmos2D.renderer.context.fillText("0", this.midpoint_x+(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("1", this.midpoint_x-(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("2", this.midpoint_x-(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.fillText("3", this.midpoint_x+(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.lineWidth = 1
        cosmos2D.renderer.context.strokeStyle = "red"
        cosmos2D.renderer.context.stroke()
        cosmos2D.renderer.context.restore()

        for(var i = 0; i < this.nodes.length; i++)
        {
            this.nodes[i].show(depth+1)
        }
    }

    ADT.Quad_tree.prototype.Inner_node.prototype.remove = function(entity)
    {
            var quadrants = this.intersected_quadrants(entity)
            for(var i = 0; i < quadrants.length; i++)
            {
                this.nodes[quadrants[i]].remove(entity)
            }
            if(this.is_empty() && this.parent_node != null)
            {
                var index = this.parent_node.nodes.indexOf(this)
                if(index != -1)
                {
                    this.parent_node.nodes[index] = new cosmos2D.ADT.Quad_tree.prototype.Leaf_node(this.parent_node)
                }
            }
    }

    ADT.Quad_tree.prototype.Leaf_node = function(parent_node)
    {
        this.parent_node = parent_node
        this.entities = new Array()
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.is_full = function(capacity)
    {
        return this.entities.length >= capacity
    }

    // Add scene to the leaf
    ADT.Quad_tree.prototype.Leaf_node.prototype.add = function(tree, entity)
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            if(this.entities[i].bounding_box.bounding_box_collision(entity.bounding_box))
            {
                entity.on_collision(this.entities[i])
            }
        }
        if(this.is_full(tree.capacity))
        {
            if(this.parent_node.depth > tree.max_depth)
            {
                console.log('scene full, undefined behaviour!', entity, tree.collision_event_listeners[entity])
            }
            else
            {
                this.parent_node.split_leaf(tree, this, entity)
            }
        }
        else
        {
            this.entities.push(entity)
        }
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.show = function()
    {
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
    }

}(window.cosmos2D = window.cosmos2D || new Object()));
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

		// this.time_callback = new cosmos2D.PROPERTY.Unordered_callback()

		// Adding new entity into Teserakt for easy access
		cosmos2D.memory.universe.insert(id, this)

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
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Event_handler = function()
	{
		this.listeners = new Array()
	}

	CORE.Event_handler.prototype.subscribe = function(object, method)
	{
		this.listeners.push({object: object, method: method})
	}

	CORE.Event_handler.prototype.unsubscribe = function(object, method)
	{
		for(var i = 0; i < this.listeners.length; i++)
		{
			if(this.listeners[i].object === object && this.listeners[i].method === method)
			{
				this.listeners.splice(i, 1)
				return
			}
		}
	}

	CORE.Event_handler.prototype.unsubscribe_all = function(object)
	{
		for(var i = 0; i < this.listeners.length; i++)
		{
			if(this.listeners[i].object === object)
			{
				this.listeners.splice(i, 1)
			}
		}
	}

	CORE.Event_handler.prototype.fire = function(event)
	{
		var responses = new Array()
		responses.length = this.listeners.length
		for(var i = 0; i < this.listeners.length; i++)
		{
			responses[i] = this.listeners[i].object[this.listeners[i].method].call(this.listeners[i].object, event)
		}
		return responses
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Input_listener = function()
	{
		this.keyToNum = {"backspace": 8, "tab": 9, "enter": 13, "shift": 16, "ctrl": 17, "alt": 18, "pause": 19, "caps_lock": 20, "escape": 27, "spacebar": 32, "page_up": 33, "page_down": 34, "end": 35, "home": 36, "left": 37, "up": 38, "right": 39, "down": 40, "insert": 45, "delete": 46, "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57, "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71, "h": 72, "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78, "o": 79, "p": 80, "q": 81, "r": 82, "s": 83, "t": 84, "u": 85, "v": 86, "w": 87, "x": 88, "y": 89, "z": 90, "windows": 91, "context": 93, "num_0": 96, "num_1": 97, "num_2": 98, "num_3": 99, "num_4": 100, "num_5": 101, "num_6": 102, "num_7": 103, "num_8": 104, "num_9": 105, "num_asterisk": 106, "num_plus": 107, "num_minus": 109, "num_delete": 110, "num_slash": 111, "f1": 112, "f2": 113, "f3": 114, "f4": 115, "f5": 116, "f6": 117, "f7": 118, "f8": 119, "f9": 120, "f10": 121, "f11": 122, "f12": 123, "num_lock": 144, "scroll_lock": 145, "equal": 187, "dash": 189, "semicolon": 186, "comma": 188, "dot": 190, "slash": 191, "grave_accent": 192, "left_square_bracket": 219, "backslash": 220, "right_square_bracket": 221, "apostrophe": 222 }
		this.numToKey = {8:"backspace", 9:"tab", 13:"enter", 16:"shift", 17:"ctrl", 18:"alt", 19:"pause", 20:"caps_lock", 27:"escape", 32:"spacebar", 33:"page_up", 34:"page_down", 35:"end", 36:"home", 37:"left", 38:"up", 39:"right", 40:"down", 45:"insert", 46:"delete", 48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8", 57:"9", 65:"a", 66:"b", 67:"c", 68:"d", 69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m", 78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v", 87:"w", 88:"x", 89:"y", 90:"z", 91:"windows", 93:"context", 96:"num_0", 97:"num_1", 98:"num_2", 99:"num_3", 100:"num_4", 101:"num_5", 102:"num_6", 103:"num_7", 104:"num_8", 105:"num_9", 106:"num_asterisk", 107:"num_plus", 109:"num_minus", 110:"num_delete", 111:"num_slash", 112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7", 119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12", 144:"num_lock", 145:"scroll_lock", 187:"equal", 189:"dash", 186:"semicolon", 188:"comma", 190:"dot", 191:"slash", 192:"grave_accent", 219:"left_square_bracket", 220:"backslash", 221:"right_square_bracket", 222:"apostrophe"}
		this.activeKeys = new Array()
		document.body.addEventListener("keydown", function(key){cosmos2D.input.pressed(key)})
		document.body.addEventListener("keyup", function(key){cosmos2D.input.released(key)})
		window.onblur = function(){cosmos2D.input.clear()}
		this.pressed_event = new cosmos2D.CORE.Event_handler()
		this.released_event = new cosmos2D.CORE.Event_handler()
		this.active_event = new cosmos2D.CORE.Event_handler()
		cosmos2D.loop.callback.subscribe(this, "active")
	}

	CORE.Input_listener.prototype.clear = function(key)
	{
		this.activeKeys = new Array()
	}

	CORE.Input_listener.prototype.pressed = function(key)
	{
		if(this.activeKeys.indexOf(key.keyCode) == -1)
		{
			this.activeKeys.push(key.keyCode)
			this.pressed_event.fire(this.numToKey[key.keyCode])
		}
	}

	CORE.Input_listener.prototype.released = function(key)
	{
		var index = this.activeKeys.indexOf(key.keyCode)
		if(index != -1)
		{
			this.activeKeys.splice(index, 1)
			this.released_event.fire(this.numToKey[key.keyCode])
		}
	}

	CORE.Input_listener.prototype.active = function()
	{
		for(var key in this.activeKeys)
		{
			this.active_event.fire(this.numToKey[this.activeKeys[key]])
		}
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	cosmos2D.run = function()
	{
		// CORE objects initialization
		cosmos2D.renderer = new cosmos2D.CORE.Renderer()
		cosmos2D.memory = new cosmos2D.CORE.Memory()
		cosmos2D.loop = new cosmos2D.CORE.Loop()
		cosmos2D.input = new cosmos2D.CORE.Input_listener()

		// CORE services
		cosmos2D.loop.run()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Loop = function() 
	{
		this.fps = 30
		this.ms = (new Date()).getTime()
		this.callback = new cosmos2D.CORE.Event_handler()
	}

	CORE.Loop.prototype.run = function()
	{
	    this.ms = (new Date()).getTime()
	    cosmos2D.renderer.clear()
	    this.callback.fire(this.ms)
	    var time_left = 1000/this.fps - ((new Date()).getTime() - this.ms)
	    setTimeout("cosmos2D.loop.run()", time_left)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Memory = function()
	{
		this.data  = new Object()
		this.universe = new cosmos2D.ADT.Teserakt()
	}

	CORE.Memory.prototype.image = function(path)
	{
		if(!this.data.hasOwnProperty(path))
		{
			this.data[path]     = new Image()
			this.data[path].src = path
		}
		return this.data[path]
	}

	CORE.Memory.prototype.audio = function(path)
	{
		if(!this.data.hasOwnProperty(path))
		{
			this.data[path] = new Audio()
			if(this.data[path].canPlayType('audio/'+path.match(/mp3|ogg|mp4|mpeg/)) != "")
			{
				var source = document.createElement('source')
				source.src = path
				if(this.data[path].canPlayType('audio/mpeg;'))
				{
				    source.type= 'audio/mpeg'
				    source.src= path
				}
				else
				{
				    source.type= 'audio/ogg'
				    source.src= path
				}
				this.data[path].appendChild(source)
			}
			else
			{
				console.log('Incompatible sound format: ' + source)
			}
		}
		return this.data[path]
	}
		

}(window.cosmos2D = window.cosmos2D || new Object()));
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
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()

	CORE.Renderer = function(canvas_id)
	{
		if(typeof canvas_id === 'undefined')
		{
			if(document.getElementsByTagName('canvas').length == 1)
			{
				this.canvas = document.getElementsByTagName('canvas')[0]
			}
			else
			{
				throw(Error('There are more then one canvas elements, specify target canvas by canvas_id parameter!'))
			}
		}
		else if(document.getElementById(canvas_id) == null)
		{
			throw(Error('Cant find canvas element!'))
		}
		else if(document.getElementById(canvas_id).localName == "canvas")
		{
			this.canvas = document.getElementById(canvas_id)
		}
		else
		{
			throw(Error('There is no canvas element with id', canvas_id))
		}

		// WebGL2D.enable(cvs)
		// this.context = this.canvas.getContext("webgl-2d")
		this.context = this.canvas.getContext("2d")
	}

	CORE.Renderer.prototype.clear = function()
	{
	    this.context.save()

	    this.context.setTransform(1, 0, 0, 1, 0, 0)
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

	    this.context.restore()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var CORE = cosmos2D.CORE = cosmos2D.CORE || new Object()
	
	CORE.Timer = function()
	{
	    this.current_time = 0
	    this.last_time = 0
	    this.elapsed = 0
	}

	CORE.Timer.prototype.elapsed_since_last_frame = function()
	{
	    return this.current_time - this.last_time
	}

	CORE.Timer.prototype.elapsed_since_last_reset = function()
	{
	    return this.elapsed
	}

	CORE.Timer.prototype.update = function(time)
	{
	    this.last_time = this.current_time
	    this.current_time = time
	    this.elapsed += this.elapsed_since_last_frame()
	}

	CORE.Timer.prototype.reset = function()
	{
	    this.elapsed = 0
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
    var MATH = cosmos2D.MATH = cosmos2D.MATH || new Object()

    // x1 y1
    // x2 y2
    MATH.Matrix2x2 = function(x1, y1, x2, y2)
    {
    	this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    MATH.Matrix2x2.prototype.rightMatrixMultiplication = function(matrix)
    {
        result = new cosmos2D.MATH.Matrix2x2(0,0,0,0)
        result.x1 = this.x1 * matrix.x1 + this.y1 * matrix.x2
        result.y1 = this.x1 * matrix.y1 + this.y1 * matrix.y2
        result.x2 = this.x2 * matrix.x1 + this.y2 * matrix.x2
        result.y2 = this.x2 * matrix.y1 + this.y2 * matrix.y2
        return result
    }
    MATH.Matrix2x2.prototype.rightVectorMultiplication = function(vector)
    {
        result = new cosmos2D.MATH.Vector2D(0,0)
        result.x1 = this.x1 * vector.x + this.y1 * vector.y
        result.y1 = this.x2 * vector.x + this.y2 * vector.y
        return result
    }

    // cos -sin
    // sin cos
    MATH.RotationMatrix2x2 = function(radians)
    {
    	this.radians = radians
    	this.x1 = Math.cos(radians)
        this.y1 = -Math.sin(radians)
        this.x2 = Math.sin(radians)
        this.y2 = Math.cos(radians)
    }

    MATH.RotationMatrix2x2.prototype.rightMatrixMultiplication = function(matrix)
    {
        result = new cosmos2D.MATH.Matrix2x2(0,0,0,0)
        result.x1 = this.x1 * matrix.x1 + this.y1 * matrix.x2
        result.y1 = this.x1 * matrix.y1 + this.y1 * matrix.y2
        result.x2 = this.x2 * matrix.x1 + this.y2 * matrix.x2
        result.y2 = this.x2 * matrix.y1 + this.y2 * matrix.y2
        return result
    }
    MATH.RotationMatrix2x2.prototype.rightVectorMultiplication = function(vector)
    {
        result = new cosmos2D.MATH.Vector2D(0,0)
        result.x = this.x1 * vector.x + this.y1 * vector.y
        result.y = this.x2 * vector.x + this.y2 * vector.y
        return result
    }

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
    var MATH = cosmos2D.MATH = cosmos2D.MATH || new Object()

    MATH.Vector2D = function(x, y)
    {
        this.x = x
        this.y = y
    }

    MATH.Vector2D.prototype.Duplicate = function()
    {
        return new Vector2D(this.x, this.y)
    }

    MATH.Vector2D.prototype.Compare = function(vector)
    {
        if(this.x == vector.x && this.y == vector.y)
        {
            return true
        }
        return false
    }

    MATH.Vector2D.prototype.AddVector2D = function(vector)
    {
        this.x += vector.x
        this.y += vector.y
    }

    MATH.Vector2D.prototype.Normal = function()
    {
        return new Vector2D(vector.x, -vector.y)
    }

    MATH.Vector2D.prototype.Rotate = function(angle)
    {
        var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2(angle)
        return rotation_matrix.rightVectorMultiplication(this)
    }

    MATH.Vector2D.prototype.Translate = function()
    {
        // x = r*Math.cos(a); y = r*Math.sin(a)
    }

    MATH.Vector2D.prototype.Normalize = function()
    {
        var length = this.Length()
        this.x /= length
        this.y /= length
    }

    MATH.Vector2D.prototype.Multiply = function(alpha)
    {
        this.x *= alpha
        this.y *= alpha
    }

    MATH.Vector2D.prototype.DotProduct = function(vector)
    {
        return this.x * vector.x + this.y * vector.y
    }

    MATH.Vector2D.prototype.CrossProduct = function(vector)
    {
        return this.x * vector.y - this.y * vector.x
    }

    MATH.Vector2D.prototype.Length = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    MATH.Vector2D.prototype.Angle = function(vector)
    {
        return Math.atan2(vector.y, vector.x) - Math.atan2(this.y, this.x)
    }

    MATH.Vector2D.prototype.Distance = function(vector)
    {
        return Math.sqrt(Math.pow((this.x - vector.x), 2) + Math.pow((this.y - vector.y), 2))
    }

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Animator = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			animation: '',
			frames: 0,
			fps: cosmos2D.loop.fps,
			target: 'Model[model]',
			iterator: 0,
			frame_counter: 0,
			frameskip: 1,
			original: undefined
		})
		if(this._original == undefined)
		{
			this._original = this.target()
		}
	}

	PROPERTY.Animator.prototype.play = function()
	{
		this.frameskip(cosmos2D.loop.fps / this.fps())
		if(this.frame_counter() >= this.frameskip())
		{
			this.frame_counter(0)
			this.iterator((this.iterator() + 1) % this.frames())
			this.target(this.animation().replace(/\./, '_'+this.iterator()+'.'))
		}
		this.frame_counter(this.frame_counter()+1)
	}

	PROPERTY.Animator.prototype.stop = function()
	{
		this.target(this.original())
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Audio = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			audio: undefined
		})
	}

	PROPERTY.Audio.prototype.play = function()
	{
		cosmos2D.memory.audio(this.audio()).play()
	}

	PROPERTY.Audio.prototype.stop = function()
	{
		cosmos2D.memory.audio(this.audio()).pause()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Bounding_box = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			pivot_x: 0,
			pivot_y: 0
		})
		this.collision_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Bounding_box.prototype.collision_system = function(collision_system)
	{
		return this
<<<<<<< HEAD
	}

	PROPERTY.Bounding_box.prototype.on_collision = function(entity)
	{
		this.collision_event.fire()
=======
>>>>>>> dea8391c1f5923ae57779e1a0f80fca37725e985
	}

	PROPERTY.Bounding_box.prototype.bl_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() - this.pivot_x() / 2, this.y() + this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.tl_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() - this.pivot_x() / 2, this.y() - this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.tr_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() + this.pivot_x() / 2, this.y() - this.pivot_y() / 2)
	}

	PROPERTY.Bounding_box.prototype.br_p = function()
	{
		return new cosmos2D.MATH.Vector2D(this.x() + this.pivot_x() / 2, this.y() + this.pivot_y() / 2)
	}

	// Collision detection between two boxes
	PROPERTY.Bounding_box.prototype.bounding_box_collision = function(bounding_box)
	{
	    return !(bounding_box.bl_p().x > this.tr_p().x
			|| bounding_box.tr_p().x < this.bl_p().x
			|| bounding_box.tr_p().y > this.bl_p().y
			|| bounding_box.bl_p().y < this.tr_p().y)
	}

	// Collision detection between bounding box and rectangle
	PROPERTY.Bounding_box.prototype.quad_tree_collision = function(bot_left_x, bot_left_y, top_right_x, top_right_y)
	{
	    return !(bot_left_x > this.tr_p().x
			|| top_right_x < this.bl_p().x
			|| top_right_y > this.bl_p().y
			|| bot_left_y < this.tr_p().y)
	}

	// Intersection with line defined by point and vector - ray
	PROPERTY.Bounding_box.prototype.line_intersection = function(point, vector)
	{
		return this.single_line_intersection(point, vector, this.bl_p(), new cosmos2D.MATH.Vector2D(this.tl_p().x - this.bl_p().x, this.tl_p().y - this.bl_p().y)) ||
		this.single_line_intersection(point, vector, this.tl_p(), new cosmos2D.MATH.Vector2D(this.tr_p().x - this.tl_p().x, this.tr_p().y - this.tl_p().y)) ||
		this.single_line_intersection(point, vector, this.tr_p(), new cosmos2D.MATH.Vector2D(this.br_p().x - this.tr_p().x, this.br_p().y - this.tr_p().y)) ||
		this.single_line_intersection(point, vector, this.br_p(), new cosmos2D.MATH.Vector2D(this.bl_p().x - this.br_p().x, this.br_p().y - this.bl_p().y))
	}

	// line 1: from point p to p+r
	// line 2: from point q to q+s
	PROPERTY.Bounding_box.prototype.single_line_intersection = function(p, r, q, s)
	{
		// p + tr = q + us
		// t = (q - p) x s / (r x s)
		// u = (q - p) x r / (r x s)
		var v = new cosmos2D.MATH.Vector2D(q.x - p.x, q.y - p.y); // v = (q - p)
		var t = (v.CrossProduct(s)) / (r.CrossProduct(s))
		var u = (v.CrossProduct(r)) / (r.CrossProduct(s))

		cosmos2D.renderer.context.save()
		point_yellow = new Image()
		point_yellow.src = "../js/resource/point_yellow.png"
		cosmos2D.renderer.context.drawImage(point_yellow, q.x + u * s.x - 4, q.y + u * s.y - 4)
		cosmos2D.renderer.context.restore()

		return t >= 0 && t <= 1 && u >= 0 && u <= 1
	}

	PROPERTY.Bounding_box.prototype.render = function()
	{
		cosmos2D.renderer.context.save()
		cosmos2D.renderer.context.beginPath()
		cosmos2D.renderer.context.moveTo(this.bl_p().x, this.bl_p().y)
		cosmos2D.renderer.context.lineTo(this.tl_p().x, this.tl_p().y)
		cosmos2D.renderer.context.lineTo(this.tr_p().x, this.tr_p().y)
		cosmos2D.renderer.context.lineTo(this.br_p().x, this.br_p().y)
		cosmos2D.renderer.context.lineTo(this.bl_p().x, this.bl_p().y)
		cosmos2D.renderer.context.lineWidth = 1
		cosmos2D.renderer.context.strokeStyle = "red"
		cosmos2D.renderer.context.stroke()
		cosmos2D.renderer.context.restore()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
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
(function(cosmos2D, undefined)
{
    var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

    PROPERTY.Quad_tree = function(entity, asset)//width, height, capacity, max_depth)
    {
        this.parse_asset(entity, asset, {})

        this.entities = new Array()
        this.width = width
        this.height = height
        this.capacity = capacity
        this.max_depth = max_depth
        this.collision_event_listeners = new Array()
        this.root = new cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node(null, width / 2, height / 2, width / 2, height / 2)
        this.root.depth = 0
    }

    // Adds GO to the tree, optional parameter on_collision_method is GO's method name, which would be registered for on_collision_event
    PROPERTY.Quad_tree.prototype.add = function(entity)
    {
        this.entities.push(entity)
        this.root.add(this, entity)
    }

    // Completely removes GO from tree, drops all registered event methods
    PROPERTY.Quad_tree.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
        this.root.remove(entity, this.root)
    }

    // Renders quad tree structure visible
    PROPERTY.Quad_tree.prototype.render = function()
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            this.entities[i].render()
        }
    }

    PROPERTY.Quad_tree.prototype.quadrant_changed = function(entity)
    {
        return true
    }

    PROPERTY.Quad_tree.prototype.update = function(time)
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            // tady by se to mohlo zlepsit teda...
            this.root.remove(this.entities[i], this.root)
            this.root.add(this, this.entities[i])
        }
    }

    // Renders quad tree structure visible
    PROPERTY.Quad_tree.prototype.show = function()
    {
        this.root.show(1)
    }

    PROPERTY.Quad_tree.prototype.Inner_node = function(parent_node, midpoint_x, midpoint_y, half_width, half_height)
    {
        this.parent_node = parent_node
        if(parent_node != null)
        {
            this.depth = parent_node.depth + 1
        }
        this.nodes = new Array(new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this))
        this.midpoint_x = midpoint_x
        this.midpoint_y = midpoint_y
        this.half_width = half_width
        this.half_height = half_height
        this.quadrant_signs = [[1,-1],[-1,-1],[-1,1],[1,1]]
    }

    // Quadrant order:
    // ^
    // |- - - >
    // |1 . 0
    // |. . .
    // |2 . 3
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.intersected_quadrants = function(entity)
    {
        var quadrants = new Array()
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y,
            this.midpoint_x + this.half_width,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(0)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y,
            this.midpoint_x,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(1)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y + this.half_height,
            this.midpoint_x,
            this.midpoint_y))
        {
            quadrants.push(2)
        }
        if(entity.bounding_box.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y + this.half_height,
            this.midpoint_x + this.half_width,
            this.midpoint_y))
        {
            quadrants.push(3)
        }
        return quadrants
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.is_empty = function()
    {
        for(var i = 0; i < this.nodes.length; i++)
        {
            if(this.nodes[i] instanceof cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node)
            {
                return false // Does not contain only leaves
            }
            if(this.nodes[i].entities.length != 0)
            {
                return false // Leaf contains some GO
            }
        }
        return true
    }

    // add scene recursively to children
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.add = function(tree, entity)
    {
        var quadrants = this.intersected_quadrants(entity)
        for(var i = 0; i < quadrants.length; i++)
        {
            this.nodes[quadrants[i]].add(tree, entity)
        }
    }

    // If leaf reaches its capacity it must be replaced with inner node and splitted to his corresponding new quadrants (leafs)
    // this - parent of splitting leaf
    // splitting_leaf_node - leaf od this which is going to split
    // entity - given new object
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.split_leaf = function(tree, splitting_leaf_node, entity)
    {
        var quadrant = this.nodes.indexOf(splitting_leaf_node)
        var entities = this.nodes[quadrant].entities
        var new_midpoint_x = this.midpoint_x + (this.quadrant_signs[quadrant][0] * this.half_width / 2)
        var new_midpoint_y = this.midpoint_y + (this.quadrant_signs[quadrant][1] * this.half_height / 2)
        this.nodes[quadrant] = new cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node(this, new_midpoint_x, new_midpoint_y, this.half_width / 2, this.half_height / 2)
        for(var i = 0; i < entities.length; i++)
        {
            this.nodes[quadrant].add(tree, entities[i])
        }
        this.nodes[quadrant].add(tree, entity)
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.show = function(depth)
    {
        cosmos2D.renderer.context.save()
        cosmos2D.renderer.context.beginPath()
        cosmos2D.renderer.context.moveTo(this.midpoint_x, this.midpoint_y - this.half_height)
        cosmos2D.renderer.context.lineTo(this.midpoint_x, this.midpoint_y + this.half_height)
        cosmos2D.renderer.context.moveTo(this.midpoint_x - this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.lineTo(this.midpoint_x + this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.font = ((1 / depth) * 40) + "pt Bitstream"
        cosmos2D.renderer.context.fillStyle = "white"
        cosmos2D.renderer.context.fillText("0", this.midpoint_x+(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("1", this.midpoint_x-(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("2", this.midpoint_x-(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.fillText("3", this.midpoint_x+(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.lineWidth = 1
        cosmos2D.renderer.context.strokeStyle = "red"
        cosmos2D.renderer.context.stroke()
        cosmos2D.renderer.context.restore()

        for(var i = 0; i < this.nodes.length; i++)
        {
            this.nodes[i].show(depth+1)
        }
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.remove = function(entity)
    {
            var quadrants = this.intersected_quadrants(entity)
            for(var i = 0; i < quadrants.length; i++)
            {
                this.nodes[quadrants[i]].remove(entity)
            }
            if(this.is_empty() && this.parent_node != null)
            {
                var index = this.parent_node.nodes.indexOf(this)
                if(index != -1)
                {
                    this.parent_node.nodes[index] = new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this.parent_node)
                }
            }
    }

    PROPERTY.Quad_tree.prototype.Leaf_node = function(parent_node)
    {
        this.parent_node = parent_node
        this.entities = new Array()
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.is_full = function(capacity)
    {
        return this.entities.length >= capacity
    }

    // Add scene to the leaf
    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.add = function(tree, entity)
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            if(this.entities[i].bounding_box.bounding_box_collision(entity.bounding_box))
            {
                entity.on_collision(this.entities[i])
            }
        }
        if(this.is_full(tree.capacity))
        {
            if(this.parent_node.depth > tree.max_depth)
            {
                console.log('scene full, undefined behaviour!', entity, tree.collision_event_listeners[entity])
            }
            else
            {
                this.parent_node.split_leaf(tree, this, entity)
            }
        }
        else
        {
            this.entities.push(entity)
        }
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.show = function()
    {
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
    }

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Controls = function(entity, asset)
	{
		this.parse_asset(entity, asset, {})

		cosmos2D.input.active_event.subscribe(this, 'active')
		cosmos2D.input.released_event.subscribe(this, 'released')
		// cosmos2D.input.pressed_event.subscribe(this, 'pressed')

		this.forward_event = new cosmos2D.CORE.Event_handler()
		this.backward_event = new cosmos2D.CORE.Event_handler()
		this.turn_left_event = new cosmos2D.CORE.Event_handler()
		this.turn_right_event = new cosmos2D.CORE.Event_handler()
		this.shoot_event = new cosmos2D.CORE.Event_handler()
		this.stop_shooting_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Controls.prototype.active = function(keyName)
	{
		switch(keyName)
		{
			case this.forward():
				this.forward_event.fire()
				break
			case this.backward():
				this.backward_event.fire()
				break
			case this.turn_left():
				this.turn_left_event.fire()
				break
			case this.turn_right():
				this.turn_right_event.fire()
				break
			case this.shoot():
				this.shoot_event.fire()
				break
		}
	}

	PROPERTY.Controls.prototype.released = function(keyName)
	{
		switch(keyName)
		{
			case this.shoot():
				this.stop_shooting_event.fire()
				break
		}
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Fps_counter = function(entity, asset)
	{
		this.parse_asset(entity, asset, {fps: 0, last_frame_ms: cosmos2D.loop.ms})
	}

	PROPERTY.Fps_counter.prototype.apply = function()
	{
		this.fps(Math.round(1000 / (cosmos2D.loop.ms - this.last_frame_ms())))
		this.last_frame_ms(cosmos2D.loop.ms)
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Geometry = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			rotation_speed: 0,
			move_speed: 0,
			rotation: 0,
			x: 0,
			y: 0,
		})
	}

	PROPERTY.Geometry.prototype.apply = function()
	{
	    cosmos2D.renderer.context.translate(this.x(), this.y())
	}

	PROPERTY.Geometry.prototype.go_forward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2((this.rotation()*2*Math.PI)/360)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed(), 0))
	    this.x(this.x()+delta_position.x)
	    this.y(this.y()+delta_position.y)
	}

	PROPERTY.Geometry.prototype.go_backward = function()
	{
		var rotation_matrix = new cosmos2D.MATH.RotationMatrix2x2((this.rotation()*2*Math.PI)/360)
	    delta_position = rotation_matrix.rightVectorMultiplication(new cosmos2D.MATH.Vector2D(this.move_speed(), 0))
	    this.x(this.x()-delta_position.x)
	    this.y(this.y()-delta_position.y)
	}

	PROPERTY.Geometry.prototype.turn_left = function()
	{
		this.rotation(this.rotation()-this.rotation_speed())
	}
	
	PROPERTY.Geometry.prototype.turn_right = function()
	{
		this.rotation(this.rotation()+this.rotation_speed())
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Model = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			model: undefined,
			pivot_x: 0,
			pivot_y: 0,
			rotation: undefined
		})
	}

	PROPERTY.Model.prototype.apply = function()
	{
		cosmos2D.renderer.context.save()
	    cosmos2D.renderer.context.translate(this.x(), this.y())
	    cosmos2D.renderer.context.rotate((this.rotation()*2*Math.PI)/360)
	    cosmos2D.renderer.context.drawImage(cosmos2D.memory.image(this.model()), -this.pivot_x(), -this.pivot_y())
		cosmos2D.renderer.context.restore()
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));

(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Pipeline_callback = function(is_unlocked)
	{
		this.array = new Array(10)
		is_unlocked ? this.is_unlocked = true : this.is_unlocked = false
		cosmos2D.loop.callback.subscribe(this, 'apply')
	}

	PROPERTY.Pipeline_callback.prototype.insert = function(object, method, order)
	{
		while(order > this.array.length)
		{
			this.array = this.array.concat(new Array(10))
		}
		this.array[order] = new cosmos2D.CORE.Event_handler()
		this.array[order].subscribe(object, method)
	}

	PROPERTY.Pipeline_callback.prototype.apply = function()
	{
		if(this.is_unlocked)
		{
			for(var i = 0; i < this.array.length; i++)
			{
				if(this.array[i])
				{
					this.array[i].fire()
				}
			}
		}
	}

	PROPERTY.Pipeline_callback.prototype.lock = function()
	{
		this.is_unlocked ? this.is_unlocked = false : this.is_unlocked = true
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
    var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

    PROPERTY.Quad_tree = function(entity, asset)//width, height, capacity, max_depth)
    {
        this.parse_asset(entity, asset, {
            width: cosmos2D.renderer.canvas.width,
            height: cosmos2D.renderer.canvas.height,
            capacity: 2,
            max_depth: 2,
        })

        this.entities = new Array()
        this.collision_event_listeners = new Array()
        this.root = new cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node(null, this._width / 2, this._height / 2, this._width / 2, this._height / 2)
        this.root.depth = 0
        this.collect_event = new cosmos2D.CORE.Event_handler
    }

    // Adds GO to the tree, optional parameter on_collision_method is GO's method name, which would be registered for on_collision_event
    PROPERTY.Quad_tree.prototype.add = function(entity)
    {
        this.entities.push(entity)
        this.root.add(this, entity)
    }

    // Completely removes GO from tree, drops all registered event methods
    PROPERTY.Quad_tree.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
        this.root.remove(entity, this.root)
    }

    PROPERTY.Quad_tree.prototype.quadrant_changed = function(entity)
    {
        return true
    }

    // tady by se to mohlo zlepsit nejak...
    PROPERTY.Quad_tree.prototype.update = function(time)
    {
        entities = this.collect_event.fire()
        for(var i = 0; i < entities.length; i++)
        {
            this.root.remove(entities[i], this.root)
            this.root.add(this, entities[i])
        }
    }

    // Renders quad tree structure visible
    PROPERTY.Quad_tree.prototype.render = function()
    {
        this.root.render(1)
    }

    PROPERTY.Quad_tree.prototype.Inner_node = function(parent_node, midpoint_x, midpoint_y, half_width, half_height)
    {
        this.parent_node = parent_node
        if(parent_node != null)
        {
            this.depth = parent_node.depth + 1
        }
        this.nodes = new Array(new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this),
            new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this))
        this.midpoint_x = midpoint_x
        this.midpoint_y = midpoint_y
        this.half_width = half_width
        this.half_height = half_height
        this.quadrant_signs = [[1,-1],[-1,-1],[-1,1],[1,1]]
    }

    // Quadrant order:
    // ^
    // |- - - >
    // |1 . 0
    // |. . .
    // |2 . 3
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.intersected_quadrants = function(entity)
    {
        var quadrants = new Array()
        if(entity.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y,
            this.midpoint_x + this.half_width,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(0)
        }
        if(entity.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y,
            this.midpoint_x,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(1)
        }
        if(entity.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y + this.half_height,
            this.midpoint_x,
            this.midpoint_y))
        {
            quadrants.push(2)
        }
        if(entity.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y + this.half_height,
            this.midpoint_x + this.half_width,
            this.midpoint_y))
        {
            quadrants.push(3)
        }
        return quadrants
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.is_empty = function()
    {
        for(var i = 0; i < this.nodes.length; i++)
        {
            if(this.nodes[i] instanceof cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node)
            {
                return false // Does not contain only leaves
            }
            if(this.nodes[i].entities.length != 0)
            {
                return false // Leaf contains some GO
            }
        }
        return true
    }

    // add scene recursively to children
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.add = function(tree, entity)
    {
        var quadrants = this.intersected_quadrants(entity)
        for(var i = 0; i < quadrants.length; i++)
        {
            this.nodes[quadrants[i]].add(tree, entity)
        }
    }

    // If leaf reaches its capacity it must be replaced with inner node and splitted to his corresponding new quadrants (leafs)
    // this - parent of splitting leaf
    // splitting_leaf_node - leaf od this which is going to split
    // entity - given new object
    PROPERTY.Quad_tree.prototype.Inner_node.prototype.split_leaf = function(tree, splitting_leaf_node, entity)
    {
        var quadrant = this.nodes.indexOf(splitting_leaf_node)
        var entities = this.nodes[quadrant].entities
        var new_midpoint_x = this.midpoint_x + (this.quadrant_signs[quadrant][0] * this.half_width / 2)
        var new_midpoint_y = this.midpoint_y + (this.quadrant_signs[quadrant][1] * this.half_height / 2)
        this.nodes[quadrant] = new cosmos2D.PROPERTY.Quad_tree.prototype.Inner_node(this, new_midpoint_x, new_midpoint_y, this.half_width / 2, this.half_height / 2)
        for(var i = 0; i < entities.length; i++)
        {
            this.nodes[quadrant].add(tree, entities[i])
        }
        this.nodes[quadrant].add(tree, entity)
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.render = function(depth)
    {
        cosmos2D.renderer.context.save()
        cosmos2D.renderer.context.beginPath()
        cosmos2D.renderer.context.moveTo(this.midpoint_x, this.midpoint_y - this.half_height)
        cosmos2D.renderer.context.lineTo(this.midpoint_x, this.midpoint_y + this.half_height)
        cosmos2D.renderer.context.moveTo(this.midpoint_x - this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.lineTo(this.midpoint_x + this.half_width, this.midpoint_y)
        cosmos2D.renderer.context.font = ((1 / depth) * 40) + "pt Bitstream"
        cosmos2D.renderer.context.fillStyle = "white"
        cosmos2D.renderer.context.fillText("0", this.midpoint_x+(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("1", this.midpoint_x-(this.half_width/2), this.midpoint_y-(this.half_height/2))
        cosmos2D.renderer.context.fillText("2", this.midpoint_x-(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.fillText("3", this.midpoint_x+(this.half_width/2), this.midpoint_y+(this.half_height/2))
        cosmos2D.renderer.context.lineWidth = 1
        cosmos2D.renderer.context.strokeStyle = "red"
        cosmos2D.renderer.context.stroke()
        cosmos2D.renderer.context.restore()

        for(var i = 0; i < this.nodes.length; i++)
        {
            this.nodes[i].render(depth+1)
        }
    }

    PROPERTY.Quad_tree.prototype.Inner_node.prototype.remove = function(entity)
    {
            var quadrants = this.intersected_quadrants(entity)
            for(var i = 0; i < quadrants.length; i++)
            {
                this.nodes[quadrants[i]].remove(entity)
            }
            if(this.is_empty() && this.parent_node != null)
            {
                var index = this.parent_node.nodes.indexOf(this)
                if(index != -1)
                {
                    this.parent_node.nodes[index] = new cosmos2D.PROPERTY.Quad_tree.prototype.Leaf_node(this.parent_node)
                }
            }
    }

    PROPERTY.Quad_tree.prototype.Leaf_node = function(parent_node)
    {
        this.parent_node = parent_node
        this.entities = new Array()
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.is_full = function(capacity)
    {
        return this.entities.length >= capacity
    }

    // Add scene to the leaf
    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.add = function(tree, entity)
    {
        for(var i = 0; i < this.entities.length; i++)
        {
            if(this.entities[i].bounding_box_collision(entity))
            {
                entity.on_collision(this.entities[i])
            }
        }
        if(this.is_full(tree.capacity()))
        {
            if(this.parent_node.depth > tree.max_depth())
            {
                console.log('scene full, undefined behaviour!', entity, tree.collision_event_listeners[entity])
            }
            else
            {
                this.parent_node.split_leaf(tree, this, entity)
            }
        }
        else
        {
            this.entities.push(entity)
        }
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.render = function()
    {
    }

    PROPERTY.Quad_tree.prototype.Leaf_node.prototype.remove = function(entity)
    {
        var index = this.entities.indexOf(entity)
        if(index != -1)
        {
            this.entities.splice(index, 1)
        }
    }

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	// TEXT A CONTROLS
	PROPERTY.Text = function(entity, asset)
	{
		this.parse_asset(entity, asset, {
			x: undefined,
			y: undefined,
			text: undefined,
			color: '#000000',
			style: 'fill',
			font_style: '',
			font_variant: '',
			font_weight: '',
			font_size: 12,
			font_family: 'Arial',
			text_align: 'start',
			text_baseline: 'top',
			max_width: false
		})

		// Create switch between stroke/fill both with/out max_width
		// fill and no width = 0, fill and width = 1, stroke and no width = 2, stroke and width = 3
		this.switch = 0
		this._style == 'fill' ? this.switch = 0 : this.switch = 2
		if(this._max_width)
		{
			this.switch += 1
		}
	}

	PROPERTY.Text.prototype.apply = function()
	{
	    cosmos2D.renderer.context.font = this.font_style()+this.font_variant()+this.font_weight()+this.font_size()+'px '+this.font_family()
	    cosmos2D.renderer.context.textAlign = this.text_align()
	    cosmos2D.renderer.context.textBaseline = this.text_baseline()
	    switch(this.switch)
	    {
	    	case 0:
	    		cosmos2D.renderer.context.fillStyle = this.color()
				cosmos2D.renderer.context.fillText(this.text(), this.x(), this.y())
				break
			case 1:
	    		cosmos2D.renderer.context.fillStyle = this.color()
				cosmos2D.renderer.context.fillText(this.text(), this.x(), this.y(), this.max_width())
				break
			case 2:
	    		cosmos2D.renderer.context.strokeStyle = this.color()
				cosmos2D.renderer.context.strokeText(this.text(), this.x(), this.y())
				break
			case 3:
	    		cosmos2D.renderer.context.strokeStyle = this.color()
				cosmos2D.renderer.context.strokeText(this.text(), this.x(), this.y(), this.max_width())
				break
	    }
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Time = function(entity, asset)
	{
		this.parse_asset(entity, asset, {})
		cosmos2D.loop.callback.subscribe(this, 'tick')
		this.tick_event = new cosmos2D.CORE.Event_handler()
	}

	PROPERTY.Time.prototype.tick = function()
	{
		this.tick_event.fire()
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	PROPERTY.Unordered_callback = function(is_unlocked)
	{
		this.array = new Array()
		is_unlocked ? this.is_unlocked = true : this.is_unlocked = false
		cosmos2D.loop.callback.subscribe(this, 'apply')
	}

	PROPERTY.Unordered_callback.prototype.insert = function(object, method)
	{
		var position = this.array.push(new cosmos2D.CORE.Event_handler()) - 1
		this.array[position].subscribe(object, method)
	}

	PROPERTY.Unordered_callback.prototype.apply = function()
	{
		if(this.is_unlocked)
		{
			for(var i = 0; i < this.array.length; i++)
			{
				this.array[i].fire()
			}
		}
	}

	PROPERTY.Unordered_callback.prototype.lock = function()
	{
		this.is_unlocked ? this.is_unlocked = false : this.is_unlocked = true
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));
(function(cosmos2D, undefined)
{
	var RESOURCE = cosmos2D.RESOURCE = cosmos2D.RESOURCE || new Object()

	// naming convention: name_x, where name is parameter string, x is iterator from 0 to range
	RESOURCE.Animation = function(entity, asset)
	{
		// name, range, speed
		this.image_sequence = cosmos2D.memory.animation()
		this.iterator = 0
		this.speed = speed
		this.timer = new Timer()

		this.load(name, range)
	}

	RESOURCE.Animation.prototype.load = function(name, range)
	{
		for (var i = 0; i < range; i++)
		{
			this.image_sequence[i] = new Image()
			
			this.image_sequence[i].src = name+"_"+i+".png"
		}
	}

	RESOURCE.Animation.prototype.update = function(time)
	{
		this.timer.update(time)
		if(this.timer.elapsed_since_last_reset() > this.speed / FPS)
		{
			this.iterator = (this.iterator + 1) % this.image_sequence.length
			this.timer.reset()
		}
	}

	RESOURCE.Animation.prototype.image = function()
	{
		return this.image_sequence[this.iterator]
	}

}(window.cosmos2D = window.cosmos2D || new Object()));
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
