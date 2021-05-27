"use strict";

//ButtonIcon constructor
function ButtonIcon(parent)
{
	Division.call(this, parent);

	//Color atributes
	this.color = "#FFFFFF";
	this.color_over = "#7c7c7c";
	this.element.userData.type = "ButtonIcon";

	//Element atributes
	this.element.style.cursor = "default";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.borderRadius = "100px";
	this.element.style.backgroundColor = this.color;
	this.element.style.boxShadow = "0px 2px 5px " + Lema.Colors.BTN_SHADOW;

	//Icon
	this.icon = new LemaImage(this.element);
	this.icon.scale.set(0.6, 0.6);
	
	//Self pointer
	var self = this;

	//Event type selector
	if(Lema.touchscreen)
	{
		this.enter_event = "touchstart";
		this.leave_event = "touchend";
	}
	else
	{
		this.enter_event = "mouseenter";
		this.leave_event = "mouseleave";
	}

	//Pointer enter button callback
	this.enter_callback = function(event)
	{
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = self.color_over;
	};

	//Pointer leave button callback
	this.leave_callback = function(event)
	{
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = self.color;
	};
	

	//Pointer pressed event
	this.element.addEventListener(this.enter_event, this.enter_callback, false);

	//Pointer released event
	this.element.addEventListener(this.leave_event, this.leave_callback, false);
}

//Functions Prototype
ButtonIcon.prototype = Object.create(Division.prototype);

//Set button icon
ButtonIcon.prototype.setIcon = function(icon)
{
	this.icon.setImage(icon);
	this.element.userData.text = FileSystem.getFileName(icon);
}

//Set button color
ButtonIcon.prototype.setColor = function(color, color_over)
{
	this.color = color;
	this.element.style.backgroundColor = color;
	if(color_over !== undefined)
	{
		this.color_over = color_over;
	}
}

//Remove element from document
ButtonIcon.prototype.destroy = function()
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

//Update ButtonIcon Size
ButtonIcon.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	this.setClickable(this.visible);

	this.icon.size.set(this.size.x, this.size.y);
	this.icon.visible = this.visible;
	this.icon.updateInterface();
}