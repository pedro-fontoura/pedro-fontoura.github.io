"use strict";

//Button constructor
function Button(parent, id, vertical)
{
	var register = false;
	if ( typeof id != "string" ) {
		console.error("Button without ID");
		console.error(parent);
		console.error("id:", id);
		console.error("vertical:", vertical);
	} else {
		register = Lema.Sound.RegisterButton( id );
	}
	
	this.id = id;
	Division.call(this, parent);
	this.vertical = vertical;
	this.element.userData.type = "Button";

	//Color atributes
	this.color = "#FFFFFF";
	this.color_over = "#7c7c7c";

	//Element atributes
	this.element.style.cursor = "default";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = this.color;
	this.element.style.boxShadow = "0px 2px 5px " + Lema.Colors.BTN_SHADOW;

	//Text
	this.text = new Text(this.element);
	this.text.setText("");

	//Icon
	this.icon = new LemaImage(this.element);
	this.icon.scale.set(0.6, 0.6);

	//Text scale relative to button vertical size
	this.text_scale = 0.3;

	//Self pointer
	var self = this;

	//Event type selector
	// if(Lema.touchscreen)
	// {
		// this.enter_event = "touchstart";
		// this.leave_event = "touchend";
	// }
	// else
	// {
		// this.enter_event = "mouseenter";
		// this.leave_event = "mouseleave";
	// }

	//Pointer enter button callback
	this.enter_callback = function(event)
	{
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = self.color_over;
		if ( register ) {
			Lema.Sound.PlayButton( self.id );
		}
	};

	//Pointer leave button callback
	this.leave_callback = function(event)
	{
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = self.color;
		// console.log("Button.Leave:", self.id);
	};

	//Pointer pressed event
	this.element.addEventListener(Lema.events.enter, this.enter_callback, false);

	//Pointer released event
	this.element.addEventListener(Lema.events.leave, this.leave_callback, false);
}

//Functions Prototype
Button.prototype = Object.create(Division.prototype);

//Add border to button
Button.prototype.addBorder = function(size, color)
{
	this.element.style.borderStyle = "solid";
	this.element.style.borderWidth = size + "px";
	this.element.style.borderColor = (color !== undefined) ? color : "#000000";
}

//Set text scale relative to vertical size
Button.prototype.setTextScale = function(scale)
{
	this.text_scale = scale;
}

//Set button color
Button.prototype.setColor = function(color, color_over)
{
	this.color = color;
	this.element.style.backgroundColor = color;
	if(color_over !== undefined)
	{
		this.color_over = color_over;
	}
}

//Set button icon
Button.prototype.setIcon = function(icon)
{
	this.icon.setImage(icon);
}

//Set icon scale
Button.prototype.setIconScale = function(scale)
{
	this.icon.scale.set(scale, scale);
}

//Set button text
Button.prototype.setText = function(text)
{
	this.text.setText(text);
	this.element.userData.text = text;
}

//Remove element from document
Button.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].destroy();
		}
	}
	catch(e){}
}

//Update Button Size
Button.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	this.setClickable(this.visible);
	
	this.element.style.borderRadius = (this.size.y * Lema.Const.BTN_BORDER_RADIUS) + "px";
	
	if (this.vertical) {
		this.icon.size.set(this.size.y / 2, this.size.y / 2);
		this.icon.position.set(this.size.x / 2 - this.icon.size.x / 2, this.icon.VSPACE || 0);
		this.icon.visible = this.visible;
		this.icon.updateInterface();

		this.text.position.set(0, this.size.y / 2);
		this.text.size.set(this.size.x, this.size.y / 2);
		this.text.setTextSize(this.size.y * this.text_scale);
		this.text.visible = this.visible;
		this.text.updateInterface();
	} else {
		this.icon.size.set(this.size.y, this.size.y);
		this.icon.visible = this.visible;
		this.icon.updateInterface();

		this.text.position.set(this.size.y, 0);
		this.text.size.set(this.size.x - this.size.y, this.size.y);
		this.text.setTextSize(this.size.y * this.text_scale);
		this.text.visible = this.visible;
		this.text.updateInterface();
	}
}