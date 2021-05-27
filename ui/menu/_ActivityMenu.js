"use strict";

//Activity menu constructor
function ActivityMenu(parent)
{
	Division.call(this, parent);

	//Text
	this.text = new Text(this);
	this.text.setTextColor(Lema.Colors.BTN_HOVER);
	this.text.setText("Seleciona o modo");

	//Manual selection
	this.manual = new Button(this);
	this.manual.setTextScale(0.40);
	this.manual.setColor(Lema.Colors.BTN_HOVER, "#d05a2c");
	this.manual.setIcon("data/icons/logic.png");
	this.manual.setText("Escolher Atividades");
	this.manual.setOnClick(function()
	{
		Lema.screen.changeMenu(ManualSelectionMenu);
	});

	//Development mode
	this.test = new Button(this);
	this.test.visible = false;
	this.test.setTextScale(0.40);
	this.test.setColor(Lema.Colors.BTN_HOVER, Lema.Colors.BTN_SUBMIT);
	this.test.setIcon("data/icons/data.png");
	this.test.setText("Desenvolvimento");
	this.test.setOnClick(function()
	{
		Lema.screen.changeMenu(DevelopmentMenu);
	});

	//Self pointer
	var self = this;

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
ActivityMenu.prototype = Object.create(Division.prototype);

//Update Interface
ActivityMenu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Text
	this.text.size.set(this.size.x, this.size.y * 0.2);
	this.text.setTextSize(this.size.y * 0.07);
	this.text.updateInterface();

	//Manual selection mode
	this.manual.size.set(this.size.y * 0.8, this.size.y * 0.15);
	this.manual.position.set(this.size.x * 0.5 - (this.size.y * 0.4), this.size.y * 0.2);
	this.manual.updateInterface();

	//Test mode
	this.test.size.set(this.size.y * 0.8, this.size.y * 0.15);
	this.test.position.set(this.size.x * 0.5 - (this.size.y * 0.4), this.size.y * 0.4);
	this.test.updateInterface();
	
	//Back
	this.back_button.size.set(this.size.y * 0.18, this.size.y * 0.18);
	this.back_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
	this.back_button.updateInterface();
}
