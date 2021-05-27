"use strict";

//About menu constructor
function AboutMenu(parent)
{
	Division.call(this, parent);

	//Lema
	this.lema = new LemaImage(this)
	this.lema.setImage("data/lema.png");
	this.lema.element.ondblclick = function()
	{
		Lema.screen.changeMenu(DevelopmentMenu);
	}

	//Version
	this.version = new Text(this);
	this.version.setText("V" + Lema.VERSION);
	this.version.setTextColor(Lema.Colors.BTN_HOVER);

	//Timestamp
	this.timestamp = new Text(this);
	this.timestamp.setText("B" + Lema.TIMESTAMP);
	//this.timestamp.setText(navigator.userAgent);
	this.timestamp.setTextColor(Lema.Colors.BTN_HOVER);

	//Geometrix
	this.geometrix = new LemaImage(this)
	this.geometrix.setImage("data/geometrix.png");

	//Back
	this.back_button = new ButtonIcon(this);
	this.back_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.back_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.back_button.setIcon("data/icons/back.png");
	this.back_button.setOnClick(function()
	{
		Lema.screen.changeMenu(MainMenu);
	});
}

//Functions Prototype
AboutMenu.prototype = Object.create(Division.prototype);

//Update Interface elements
AboutMenu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Name
	this.lema.size.set(this.size.y * 0.4, this.size.y * 0.15);
	this.lema.position.set((this.size.x - this.lema.size.x) * 0.5, this.size.y * 0.1);
	this.lema.updateInterface();

	//Version
	this.version.size.set(this.size.x, this.size.y * 0.2);
	this.version.position.set(0, this.size.y * 0.2);
	this.version.setTextSize(this.size.y * 0.075);
	this.version.updateInterface();

	//Timestamp
	this.timestamp.size.set(this.size.x, this.size.y * 0.2);
	this.timestamp.position.set(0, this.size.y * 0.35);
	this.timestamp.setTextSize(this.size.y * 0.05);
	this.timestamp.updateInterface();

	//Geometrix
	this.geometrix.size.set(this.size.y * 0.75, this.size.y * 0.25);
	this.geometrix.position.set((this.size.x - this.geometrix.size.x) * 0.5, this.size.y * 0.65);
	this.geometrix.updateInterface();

	//Back
	this.back_button.size.set(this.size.y * 0.18, this.size.y * 0.18);
	this.back_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
	this.back_button.updateInterface();
}
