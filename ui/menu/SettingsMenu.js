"use strict";

//** Constructor
function SettingsMenu( parent ) {
	Division.call( this, parent );

	//User agent
	this.ua = new Text( this );
	this.ua.setText( navigator.userAgent );
	this.ua.setTextColor( "#000033" );

	//** Back button
	this.back_button = new Button( this );
	this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setText( "Voltar" );
	this.back_button.setColor( Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER );
	this.back_button.setOnClick( Lema.Goto.MainMenu );
	this.back_button.setClickable( true );
}

//** Functions Prototype
SettingsMenu.prototype = Object.create( Division.prototype );

//** Update Interface elements
SettingsMenu.prototype.updateInterface = function( ) {
	Division.prototype.updateInterface.call( this );

	//Timestamp
	this.ua.size.set( this.size.x, this.size.y * 0.2 );
	this.ua.position.set( 0, this.size.y * 0.35 );
	this.ua.setTextSize( this.size.y * 0.05 );
	this.ua.updateInterface( );
	
	//** Update buttons
	var h = this.size.y * ( 1 - 0.90 );
	var pp = 0.15;
	var p = h * pp;
	h = h * ( 1 - 2 * pp );
	
	//** Back button
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface( );
};

// EOF
