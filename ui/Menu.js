"use strict";

//Menu constructor
function Menu(parent)
{
	// console.log("Menu");
	Division.call(this, parent);

	//Top bar
	this.top_bar = new TopBar(this);
	
	//Menu
	this.menu = new MainMenu(this);
	
	//Dialog box
	this.dialog = new Dialog(this);
}

//Functions Prototype
Menu.prototype = Object.create(Division.prototype);

//Moves to another menu instance (receives reference to object contructor)
Menu.prototype.changeMenu = function(MenuConstructor)
{
	this.menu.destroy();
	this.menu = new MenuConstructor(this);
	this.updateInterface();
}

//Update interface elements
Menu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Top Bar
	// console.log("Menu.updateInterface", this.top_bar.left_grid_2 != null);
	if ( this.top_bar.left_grid_2 == null ) {
		this.top_bar.size.set(this.size.x, this.size.y * Lema.Const.Layout.TOP_BAR_HEIGHT);
	} else {
		this.top_bar.size.set(this.size.x, this.size.y * Lema.Const.Layout.TOP_BAR_HEIGHT2);
	}
	this.top_bar.updateInterface();

	//Menu
	this.menu.position.set(0, this.top_bar.size.y);
	this.menu.size.set(this.size.x, this.size.y - this.top_bar.size.y);
	this.menu.updateInterface();

	//Dialog
	this.dialog.size.copy(this.size);
	this.dialog.updateInterface();
}
