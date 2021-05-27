"use strict";

//Activity menu constructor
function CategorySelectionMenu(parent)
{
	Division.call(this, parent);

	//Text
	this.text = new Text(this);
	this.text.setTextColor(Lema.Colors.BTN_HOVER);
	this.text.setText("Seleciona os temas que queres treinar");

	//Geometry
	this.geometry = new ToggleButton(this);
	this.geometry.setTextScale(0.35);
	this.geometry.setColor(Lema.Colors.BTN_HOVER, "#d05a2c");
	this.geometry.setIcon("data/icons/shapes.png");
	this.geometry.setText("Geometria");

	//Organization
	this.organization = new ToggleButton(this);
	this.organization.setTextScale(0.35);
	this.organization.setColor(Lema.Colors.BTN_HOVER, Lema.Colors.BTN_SUBMIT);
	this.organization.setIcon("data/icons/data.png");
	this.organization.setText("Organização e tratamento de dados");

	//Numbers
	this.numbers = new ToggleButton(this);
	this.numbers.setTextScale(0.35);
	this.numbers.setColor(Lema.Colors.BTN_HOVER, "#e5ab47");
	this.numbers.setIcon("data/icons/calc.png");
	this.numbers.setText("Números e Operações");

	//Algebra
	this.algebra = new ToggleButton(this);
	this.algebra.setTextScale(0.35);
	this.algebra.setColor(Lema.Colors.BTN_HOVER, Lema.Colors.TOPBAR_BG);
	this.algebra.setIcon("data/icons/calc.png");
	this.algebra.setText("Álgebra");

	//Self pointer
	var self = this;

	//Start
	this.start_button = new TextButton(this);
	this.start_button.setPositioningMode(Division.BOTTOM_RIGHT);
	this.start_button.setTextScale(0.55);
	this.start_button.setText("Iniciar");
	this.start_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.start_button.setOnClick(function()
	{
		if(self.geometry.selected || self.algebra.selected || self.organization.selected || self.numbers.selected)
		{
			Lema.setScreen(ActivityScreen);
		}
		else
		{
			Lema.screen.dialog.show("Tens que escolher pelo menos um tema", null);
		}
	});

	//Back
	this.back_button = new ButtonIcon(this);
	this.back_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.back_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.back_button.setIcon("data/icons/back.png");
	this.back_button.setOnClick(function()
	{
		Lema.screen.changeMenu(ActivityMenu);
	});
}

//Functions Prototype
CategorySelectionMenu.prototype = Object.create(Division.prototype);

//Update Interface
CategorySelectionMenu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Text
	this.text.size.set(this.size.x, this.size.y * 0.2);
	this.text.setTextSize(this.size.y * 0.07);
	this.text.updateInterface();

	//Geometry
	this.geometry.size.set(this.size.y * 0.8, this.size.y * 0.15);
	this.geometry.position.set((this.size.x - this.geometry.size.x) * 0.5, this.size.y * 0.2);
	this.geometry.updateInterface();

	//organization
	this.organization.size.copy(this.geometry.size);
	this.organization.position.set(this.geometry.position.x, this.size.y * 0.37);
	this.organization.updateInterface();

	//numbers
	this.numbers.size.copy(this.geometry.size);
	this.numbers.position.set(this.geometry.position.x, this.size.y * 0.54);
	this.numbers.updateInterface();

	//algebra
	this.algebra.size.copy(this.geometry.size);
	this.algebra.position.set(this.geometry.position.x, this.size.y * 0.71); 
	this.algebra.updateInterface();

	//Start
	this.start_button.size.set(this.size.y * 0.35, this.size.y * 0.10);
	this.start_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
	this.start_button.updateInterface();

	//Back
	this.back_button.size.set(this.size.y * 0.18, this.size.y * 0.18);
	this.back_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
	this.back_button.updateInterface();
}
