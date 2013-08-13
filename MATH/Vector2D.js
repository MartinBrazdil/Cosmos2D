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