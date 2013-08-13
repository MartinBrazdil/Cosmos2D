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