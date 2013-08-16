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