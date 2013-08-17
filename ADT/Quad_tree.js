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