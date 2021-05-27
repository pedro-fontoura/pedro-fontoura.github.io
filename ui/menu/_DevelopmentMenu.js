"use strict";

//Activity menu constructor
function DevelopmentMenu(parent)
{
	Division.call(this, parent);

	//Buttons
	this.buttons = [];

	//Buttons container
	this.container = new Division(this);
	this.container.element.style.overflow = "auto";

	//Create buttons
	for(var i = 0; i < Activity.list.length; i++)
	{
		var activity = Activity.list[i];

		var button = new Button(this.container);
		button.setTextScale(0.35);
		button.setColor(Lema.Colors.BTN_HOVER, activity.color);
		button.setText(activity.name);
		button.element.activity = activity;
		button.setOnClick(function()
		{
			Lema.setScreen(ActivityScreen);
			Lema.screen.setBackButton(true, DevelopmentMenu);
			Lema.screen.loadActivity(this.activity);
		});

		if(activity.category === "geometry")
		{
			button.setIcon("data/icons/shapes.png");
		}
		else if(activity.category === "numbers")
		{
			button.setIcon("data/icons/calc.png");
		}

		this.buttons.push(button);
	}

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
DevelopmentMenu.prototype = Object.create(Division.prototype);

//Update Interface
DevelopmentMenu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Button container
	this.container.size.set(this.size.x, this.size.y * 0.85);
	this.container.position.set(0, 0);
	this.container.updateInterface();

	//Parameters
	var size = new Vector2(this.size.y * 0.4, this.size.y * 0.08);
	var spacing = new Vector2(size.x + 10, size.y + 8);
	var cols = Math.floor(this.size.x / spacing.x);
	var border = new Vector2((this.size.x - (spacing.x*cols))/2, 15);
	var position = new Vector2(border.x, border.y);

	//Update buttons
	for(var i = 0, j = 1; i < this.buttons.length; i++, j++)
	{
		this.buttons[i].size.copy(size);
		this.buttons[i].position.copy(position);
		this.buttons[i].updateInterface();

		if(j == cols)
		{
			j = 0;
			position.y += spacing.y;
			position.x = border.x;
		}
		else
		{
			position.x += spacing.x;
		}
	}

	//Back
	this.back_button.size.set(this.size.y * 0.18, this.size.y * 0.18);
	this.back_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
	this.back_button.updateInterface();
}
