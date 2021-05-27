"use strict";

//Text button constructor
function TextButton(parent, id)
{
	Button.call(this, parent, id);

	this.icon.destroy();
	this.icon = null;
}

//Functions Prototype
TextButton.prototype = Object.create(Button.prototype);

//Update interface
TextButton.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	this.element.style.borderRadius = (this.size.y * 0.25) + "px";
	this.text.size.set(this.size.x, this.size.y);
	this.text.setTextSize(this.size.y * this.text_scale);
	this.text.visible = this.visible;
	this.text.updateInterface();
};
