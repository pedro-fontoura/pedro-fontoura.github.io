"use strict";

//ToggleButton constructor
function ToggleButton(parent, id, no_icon, on_click)
{
	Button.call(this, parent, id);
	if ( no_icon ) {
		this.icon.destroy();
		this.icon = null;
		this.updateInterface = function() {
			Division.prototype.updateInterface.call(this);

			this.element.style.backgroundColor = ( this.selected ? this.color_over : this.color );
			this.element.style.borderRadius = (this.size.y * 0.25) + "px";
			this.text.size.set(this.size.x * 0.90, this.size.y);
			this.text.position.set( this.size.x * 0.05, 0);
			this.text.setTextSize(this.size.y * this.text_scale);
			this.text.visible = this.visible;
			this.text.updateInterface();
			
		};
	}

	//Value
	this.selected = false;

	//Self pointer
	var self = this;

	//Substitute Button leave event listener
	this.element.removeEventListener(Lema.events.leave, this.leave_callback, false);

	this.leave_callback = function(event)
	{
		if(!self.selected)
		{
			self.element.style.cursor = "default";
			self.element.style.backgroundColor = self.color;
		}
	};

	this.element.addEventListener(Lema.events.leave, this.leave_callback, false);

	//Mouse click
	this.element.onclick = function()
	{
		self.selected = !self.selected;
		if(self.selected)
		{
			self.element.style.backgroundColor = self.color_over;
		}
		else
		{
			self.element.style.backgroundColor = self.color;
		}
		if ( typeof on_click == "function" ) {
			on_click.call( self );
		}
	}
}

//Functions Prototype
ToggleButton.prototype = Object.create(Button.prototype);

//Set button callback function
ToggleButton.prototype.setOnClick = function(callback)
{
	var self = this;
	
	this.element.onclick = function()
	{
		callback();
		self.selected = !self.selected;
		if(self.selected)
		{
			self.element.style.backgroundColor = self.color_over;
		}
		else
		{
			self.element.style.backgroundColor = self.color;
		}	
	};
}