"use strict";

//MainMenu constructor
function MainMenu(parent)
{
	window.document.title = Lema.NAME + " - " + "MainMenu";
	Division.call(this, parent);

	//Start
	this.start_button = new Button(this, "_activities");
	this.start_button.setPositioningMode(Division.TOP_RIGHT);
	this.start_button.setColor("#d05a2c", Lema.Colors.BTN_HOVER);
	this.start_button.setIcon("data/icons/puzzle.png");
	this.start_button.setText("Atividades");
	this.start_button.setOnClick( Lema.Goto.ManualSelectionMenu );

	//User
	this.user_button = new Button(this, "_user");
	this.user_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.user_button.setIcon("data/icons/user.png");
	this.user_button.setText("Utilizador");
	this.user_button.setOnClick( Lema.Goto.UserMenu );

	//Settings
	this.settings_button = new Button(this, "_settings");
	this.settings_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.settings_button.setColor("#e5ab47", Lema.Colors.BTN_HOVER);
	this.settings_button.setIcon("data/icons/settings.png");
	this.settings_button.setText("Definições");
	this.settings_button.setOnClick( Lema.Goto.SettingsMenu );

	//About
	this.about_button = new Button(this, "_about");
	this.about_button.setPositioningMode(Division.BOTTOM_RIGHT);
	this.about_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.about_button.setIcon("data/icons/about.png");
	this.about_button.setText("Acerca de");
	this.about_button.setOnClick( Lema.Goto.AboutScreen );

	//Exit
	if(Lema.cordova)
	{
		this.exit_button = new ButtonIcon(this);
		this.exit_button.setPositioningMode(Division.BOTTOM_LEFT);
		this.exit_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
		this.exit_button.setIcon("data/icons/close.png");
		this.exit_button.setOnClick(
			function() {
				Lema.screen.dialog.show(
					"Queres sair do LEMA?",
					function() { navigator.app.exitApp(); }
				);
			}
		);
	}
}

//Functions Prototype
MainMenu.prototype = Object.create(Division.prototype);

//Update Interface
MainMenu.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	// console.log("MainMenu.updateInterface");

	//Start
	this.start_button.size.set(this.size.y * 0.7, this.size.y * 0.25);
	this.start_button.position.set(this.size.x * 0.52, this.size.y * 0.15)
	this.start_button.updateInterface();

	//Statistics
	this.user_button.size.copy(this.start_button.size);
	this.user_button.position.copy(this.start_button.position);
	this.user_button.updateInterface();

	//Settings
	this.settings_button.size.copy(this.start_button.size);
	this.settings_button.position.set(this.size.x * 0.52, this.size.y * 0.30)
	this.settings_button.updateInterface();

	//About
	this.about_button.size.copy(this.start_button.size);
	this.about_button.position.copy(this.settings_button.position);
	this.about_button.updateInterface();

	//Exit
	if(Lema.cordova)
	{
		this.exit_button.size.set(this.size.y * 0.18, this.size.y * 0.18);
		this.exit_button.position.set(this.size.y * 0.03, this.size.y * 0.03);
		this.exit_button.updateInterface();
	}
	
	// Top Bar
	var top_bar = Lema.screen.top_bar;
	top_bar.activateLeftGrid(0);
	top_bar.info_left.visible = true;
	top_bar.info_left.setText( Lema.Const.Text.MAIN_TITLE );
	top_bar.info_right.visible = false;
	if ( top_bar.left_grid ) {
		top_bar.activateLeftGrid(0);
	}
	top_bar.activateInfoZone2( 0 );
	top_bar.updateInterface();
}
