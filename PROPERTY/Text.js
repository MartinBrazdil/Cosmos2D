(function(cosmos2D, undefined)
{
	var PROPERTY = cosmos2D.PROPERTY = cosmos2D.PROPERTY || new Object()

	// TEXT A CONTROLS
	PROPERTY.Text = function(entity, property)
	{
		this.parse_asset(entity, property, {text: '', color: '#000000', style: 'fill', font_style: '', font_variant: '',
			font_weight: '', font_size: 12, font_family: 'Arial', text_align: 'start', text_baseline: 'top', max_width: false})

		// Create switch between stroke/fill both with/out max_width
		// fill and no width = 0, fill and width = 1, stroke and no width = 2, stroke and width = 3
		this.switch = 0
		this.style == 'fill' ? this.switch = 0 : this.switch = 2
		if(this.max_width)
		{
			this.switch += 1
		}
	}

	PROPERTY.Text.prototype.apply = function()
	{
	    cosmos2D.renderer.context.font = this.font_style+this.font_variant+this.font_weight+this.font_size+'px '+this.font_family
	    cosmos2D.renderer.context.textAlign = this.text_align
	    cosmos2D.renderer.context.textBaseline = this.text_baseline
	    switch(this.switch)
	    {
	    	case 0:
	    		cosmos2D.renderer.context.fillStyle = this.color
				cosmos2D.renderer.context.fillText(this.text(), this.x, this.y)
				break
			case 1:
	    		cosmos2D.renderer.context.fillStyle = this.color
				cosmos2D.renderer.context.fillText(this.text(), this.x, this.y, this.max_width)
				break
			case 2:
	    		cosmos2D.renderer.context.strokeStyle = this.color
				cosmos2D.renderer.context.strokeText(this.text(), this.x, this.y)
				break
			case 3:
	    		cosmos2D.renderer.context.strokeStyle = this.color
				cosmos2D.renderer.context.strokeText(this.text(), this.x, this.y, this.max_width)
				break
	    }
	}

}(window.cosmos2D = window.cosmos2D || new Object()));