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
			case this.forward:
				this.forward_event.fire()
				break
			case this.backward:
				this.backward_event.fire()
				break
			case this.turn_left:
				this.turn_left_event.fire()
				break
			case this.turn_right:
				this.turn_right_event.fire()
				break
			case this.shoot:
				this.shoot_event.fire()
				break
		}
	}

	PROPERTY.Controls.prototype.released = function(keyName)
	{
		switch(keyName)
		{
			case this.shoot:
				this.stop_shooting_event.fire()
				break
		}
	}
	
}(window.cosmos2D = window.cosmos2D || new Object()));