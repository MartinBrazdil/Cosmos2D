(function(cosmos2D, undefined)
{
    var ADT = cosmos2D.ADT = cosmos2D.ADT || new Object()

    ADT.Quad_tree = function(scene_width, scene_height, capacity, max_depth)
    {
        this.scene_objects = new Array()
        this.scene_width = scene_width
        this.scene_height = scene_height
        this.capacity = capacity
        this.max_depth = max_depth
        this.collision_event_listeners = new Array()
        this.root = new cosmos2D.ADT.Quad_tree.prototype.Inner_node(null, scene_width / 2, scene_height / 2, scene_width / 2, scene_height / 2)
        this.root.depth = 0
    }

    // Adds GO to the tree, optional parameter on_collision_method is GO's method name, which would be registered for on_collision_event
    ADT.Quad_tree.prototype.add_scene_object = function(scene_object)
    {
        this.scene_objects.push(scene_object)
        this.root.add_scene_object(this, scene_object)
    }

    // Completely removes GO from tree, drops all registered event methods
    ADT.Quad_tree.prototype.remove_scene_object = function(scene_object)
    {
        var index = this.scene_objects.indexOf(scene_object)
        if(index != -1)
        {
            this.scene_objects.splice(index, 1)
        }
        this.root.remove_scene_object(scene_object, this.root)
    }

    // Renders quad tree structure visible
    ADT.Quad_tree.prototype.render_scene_objects = function()
    {
        for(var i = 0; i < this.scene_objects.length; i++)
        {
            this.scene_objects[i].render()
        }
    }

    ADT.Quad_tree.prototype.quadrant_changed = function(scene_object)
    {
        return true
    }

    ADT.Quad_tree.prototype.update_scene_objects = function(time)
    {
        for(var i = 0; i < this.scene_objects.length; i++)
        {
            // tady by se to mohlo zlepsit teda...
            this.root.remove_scene_object(this.scene_objects[i], this.root)
            this.scene_objects[i].update(time)
            this.root.add_scene_object(this, this.scene_objects[i])
        }
    }

    // Renders quad tree structure visible
    ADT.Quad_tree.prototype.render_structure = function()
    {
        this.root.render_structure(1)
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
    ADT.Quad_tree.prototype.Inner_node.prototype.intersected_quadrants = function(scene_object)
    {
        var quadrants = new Array()
        if(scene_object.bounding_box.quad_tree_collision(
            this.midpoint_x,
            this.midpoint_y,
            this.midpoint_x + this.half_width,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(0)
        }
        if(scene_object.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y,
            this.midpoint_x,
            this.midpoint_y - this.half_height))
        {
            quadrants.push(1)
        }
        if(scene_object.bounding_box.quad_tree_collision(
            this.midpoint_x - this.half_width,
            this.midpoint_y + this.half_height,
            this.midpoint_x,
            this.midpoint_y))
        {
            quadrants.push(2)
        }
        if(scene_object.bounding_box.quad_tree_collision(
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
            if(this.nodes[i] instanceof Inner_node)
            {
                return false // Does not contain only leaves
            }
            if(this.nodes[i].scene_objects.length != 0)
            {
                return false // Leaf contains some GO
            }
        }
        return true
    }

    // add scene recursively to children
    ADT.Quad_tree.prototype.Inner_node.prototype.add_scene_object = function(tree, scene_object)
    {
        var quadrants = this.intersected_quadrants(scene_object)
        for(var i = 0; i < quadrants.length; i++)
        {
            this.nodes[quadrants[i]].add_scene_object(tree, scene_object)
        }
    }

    // If leaf reaches its capacity it must be replaced with inner node and splitted to his corresponding new quadrants (leafs)
    // this - parent of splitting leaf
    // splitting_leaf_node - leaf od this which is going to split
    // scene_object - given new object
    ADT.Quad_tree.prototype.Inner_node.prototype.split_leaf = function(tree, splitting_leaf_node, scene_object)
    {
        var quadrant = this.nodes.indexOf(splitting_leaf_node)
        var scene_objects = this.nodes[quadrant].scene_objects
        var new_midpoint_x = this.midpoint_x + (this.quadrant_signs[quadrant][0] * this.half_width / 2)
        var new_midpoint_y = this.midpoint_y + (this.quadrant_signs[quadrant][1] * this.half_height / 2)
        this.nodes[quadrant] = new cosmos2D.ADT.Quad_tree.prototype.Inner_node(this, new_midpoint_x, new_midpoint_y, this.half_width / 2, this.half_height / 2)
        for(var i = 0; i < scene_objects.length; i++)
        {
            this.nodes[quadrant].add_scene_object(tree, scene_objects[i])
        }
        this.nodes[quadrant].add_scene_object(tree, scene_object)
    }

    ADT.Quad_tree.prototype.Inner_node.prototype.render_structure = function(depth)
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
            this.nodes[i].render_structure(depth+1)
        }
    }

    ADT.Quad_tree.prototype.Inner_node.prototype.remove_scene_object = function(scene_object)
    {
            var quadrants = this.intersected_quadrants(scene_object)
            for(var i = 0; i < quadrants.length; i++)
            {
                this.nodes[quadrants[i]].remove_scene_object(scene_object)
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
        this.scene_objects = new Array()
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.is_full = function(capacity)
    {
        return this.scene_objects.length >= capacity
    }

    // Add scene to the leaf
    ADT.Quad_tree.prototype.Leaf_node.prototype.add_scene_object = function(tree, scene_object)
    {
        for(var i = 0; i < this.scene_objects.length; i++)
        {
            if(this.scene_objects[i].bounding_box.bounding_box_collision(scene_object.bounding_box))
            {
                scene_object.on_collision(this.scene_objects[i])
            }
        }
        if(this.is_full(tree.capacity))
        {
            if(this.parent_node.depth > tree.max_depth)
            {
                // console.log('scene full, undefined behaviour!', scene_object, tree.collision_event_listeners[scene_object])
            }
            else
            {
                this.parent_node.split_leaf(tree, this, scene_object)
            }
        }
        else
        {
            this.scene_objects.push(scene_object)
        }
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.render_structure = function()
    {
    }

    ADT.Quad_tree.prototype.Leaf_node.prototype.remove_scene_object = function(scene_object)
    {
        var index = this.scene_objects.indexOf(scene_object)
        if(index != -1)
        {
            this.scene_objects.splice(index, 1)
        }
    }

}(window.cosmos2D = window.cosmos2D || new Object()));