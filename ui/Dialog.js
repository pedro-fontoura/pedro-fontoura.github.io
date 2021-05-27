"use strict";

//Dialog constructor
function Dialog(parent)
{
	Division.call(this, parent);

	//Self pointer
	var self = this;

	//Confirm callback function
	this.callback = null;
	this.no_callback = null;
	this.question = false;

	//Set invisible by default
	this.visible = false;
	this.text_scale = 0.125;

	//Element atributes
	this.element.style.backgroundColor = Lema.Colors.VEIL_BG;
	this.element.style.opacity = Lema.Colors.VEIL_OPACITY;
	this.element.style.zIndex = "100";

	//Box
	this.box = new Division(this.parent);
	this.box.element.style.zIndex = "200";
	this.box.setColor(Lema.Colors.DIALOG_BG);
	this.box.element.style.borderRadius = "10px";
	this.box.element.style.boxShadow = "0px 5px 5px " + Lema.Colors.DIALOG_SHADOW;
	
	// // Top Pannel
	// this.top_pannel = new Division(this.box.element);

	//Text
	this.text = new Text(this.box);
	this.text.setTextColor(Lema.Colors.DIALOG_FG);
	this.text.setText("text");

	//Confirm button
	this.yes_button = new ButtonIcon(this.box);
	this.yes_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.yes_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.yes_button.setIcon("data/icons/check.png");
	this.yes_button.setOnClick(
		function() {
			self.visible = false;
			self.updateInterface();
			if(self.callback !== null)
			{
				self.callback();
			}
		}
	);
	this.yes_button.element.userData.dialog = true;

	//Close button
	this.no_button = new ButtonIcon(this.box);
	this.no_button.setColor("#ff4343", "#7c7c7c");
	this.no_button.setPositioningMode(Division.BOTTOM_RIGHT);
	this.no_button.setIcon("data/icons/close.png");
	this.no_button.setOnClick(
		function() {
			self.visible = false;
			self.updateInterface();
			if(self.no_callback !== null)
			{
				self.no_callback();
			}
		}
	);
	this.no_button.element.userData.dialog = true;
	
	//
	this.mode = null;
}

Dialog.prototype = Object.create(Division.prototype);

//Set text scale relative to vertical size
Dialog.prototype.setTextScale = function(scale)
{
	this.text_scale = scale;
}

//== Hide dialog window
Dialog.prototype.hide = function() {
	this.visible = false;
	this.updateInterface();
};

Dialog.prototype.SetMode = function( n ) {
	this.mode = n;
};

//== Show dialog window without buttons
Dialog.prototype.showWithoutButtons = function(text, callback) {
	this.show(text, callback, 0); // this "0" as a NUMBER does the trick
};

//Show dialog window
Dialog.prototype.show = function(text, callback, question, no_callback)
{
	if(text !== undefined)
	{
		this.text.setText(text);
	}

	if(callback !== undefined)
	{
		this.callback = callback;
	}
	if(no_callback !== undefined)
	{
		this.no_callback = no_callback;
	} else {
		this.no_callback = null;
	}

	if(question !== undefined)
	{
		this.question = question;
	}
	
	if ( typeof this.mode == "number" ) {
		var color = "transparent";
		if ( this.mode == 1 ) {
			color = Lema.Colors.DIALOG_B_OK;
		} else if ( this.mode == 0 ) {
			color = Lema.Colors.DIALOG_B_NK;
		}
		this.mode = null;
		this.box.element.style.border = "solid 2px " + color;
	} else {
		this.box.element.style.border = "none";
	}

	this.visible = true;
	this.updateInterface();
}

//Update interface
Dialog.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	
	var no_buttons = (typeof this.question == "number");

	this.box.visible = this.visible;
	if (no_buttons) {
		this.box.size.set(this.size.y * 0.75, this.size.y * 0.25);
	} else {
		this.box.size.set(this.size.y * 0.75, this.size.y * 0.50);
	}
	this.box.position.set((this.size.x - this.box.size.x)/2, (this.size.y - this.box.size.y)/2);
	this.box.element.style.borderRadius = (this.size.y * 0.02) + "px";
	this.box.updateInterface();

	this.text.visible = this.visible;
	if (no_buttons) {
		this.text.size.set(this.box.size.x * 0.92, this.box.size.y * 0.92);
		this.text.setTextSize(this.box.size.y * this.text_scale * 2);
	} else {
		this.text.size.set(this.box.size.x * 0.92, this.box.size.y * 0.55);
		this.text.setTextSize(this.box.size.y * this.text_scale);
	}
	this.text.position.set(this.box.size.x * (1 - 0.92) / 2, this.box.size.y * (1 - 0.94));
	this.text.updateInterface();

	if(this.callback === null || !this.question)
	{
		if (typeof this.question == "number") { // See: showWithoutButtons
			this.yes_button.visible = Boolean(this.question);
		} else {
			this.yes_button.visible = this.visible;
		}
		this.yes_button.size.set(this.box.size.y * 0.25, this.box.size.y * 0.25);
		this.yes_button.position.set((this.box.size.x - this.yes_button.size.x) * 0.5, this.box.size.y * 0.1);
		this.yes_button.updateInterface();
		this.no_button.visible = false;
		this.no_button.updateInterface();
	}
	else
	{
		this.yes_button.visible = this.visible;
		this.yes_button.size.set(this.box.size.y * 0.25, this.box.size.y * 0.25);
		this.yes_button.position.set(this.box.size.x * 0.2, this.box.size.y * 0.1);
		this.yes_button.updateInterface();

		this.no_button.visible = this.visible && (this.no_callback != null);
		this.no_button.size.copy(this.yes_button.size);
		this.no_button.position.copy(this.yes_button.position);
		this.no_button.updateInterface();
	}
	
	if ( this.question && Lema.User.is_student ) {
		var event_yes_callback = function( event ) {
			Lema.Sound.PlayButton( "yes" ); //** Registered by TopBar
		};
		var event_no_callback = function( event ) {
			Lema.Sound.PlayButton( "no" ); //** Registered by TopBar
		};
		this.yes_button.element.addEventListener(
			Lema.events.enter, event_yes_callback, false
		);
		this.no_button.element.addEventListener(
			Lema.events.enter, event_no_callback, false
		);
	}
}