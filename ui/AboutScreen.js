"use strict";

// screen constructor
function AboutScreen(parent)
{
	Division.call(this, parent);
	
	Lema.ClientStorage.SetItem("goto", "AboutScreen");
	
	this.setColor( "#FFF" );
	this.setColor( "#d6f7f9" );

	// LEMA Image
	this.img_lema = new LemaImage(this);
	this.img_lema.setImage(Lema.imagePath + "lema.png");
	this.img_lema.setPositioningMode(Division.TOP_RIGHT);
	// GEOMETRIX Image
	this.img_geometrix = new LemaImage(this);
	this.img_geometrix.setImage(Lema.imagePath + "geometrix.png");
	this.img_geometrix.setPositioningMode(Division.TOP_RIGHT);
		
	Lema.SetTextProperties(
		"header",
		{ color: Lema.Colors.TOPBAR_BG, alignment: Text.LEFT, weight: "bold" }
	);
	
	this.txt_header = Lema.CreateText( "header", this.element, Lema.Const.Text.MAIN_TITLE );
	this.txt_header.setMultiLine( true );
	this.txt_header.setAlignment( Text.CENTER );
	
	// this.txt_line_1 = Lema.CreateText( "line", this.element,  );
	
	// back button
	// Pannel :: Enter
	this.back_button = new Button(this, "back");
	this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setText("Voltar");
	this.back_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.back_button.setOnClick( Lema.Goto.Back );
	this.back_button.setClickable(true);
	
	//
	window.document.title = Lema.NAME + " - " + "AboutScreen";
}

//Functions Prototype
AboutScreen.prototype = Object.create(Division.prototype);


AboutScreen.prototype.onClickXPTO = function() {
};


//Update interface elements
AboutScreen.prototype.updateInterface = function()
{
	this.size.set(window.innerWidth, window.innerHeight);

	Division.prototype.updateInterface.call(this);
	
	var padding = this.size.y * 0.02;
	var y = padding;
	var k;
	
	//
	k = 0.15;
	this.img_lema.size.set(this.size.y * k * (766/270), this.size.y * k);
	this.img_lema.position.set( (this.size.x - this.img_lema.size.x) / 2, y);
	this.img_lema.updateInterface();
	y += this.img_lema.size.y;
	
	// 
	this.txt_header.size.set( this.size.x - 2 * padding, 2 * this.size.y * 0.05 );
	this.txt_header.position.set( padding, y );
	this.txt_header.setTextSize( this.txt_header.size.y * 0.75 / 2 );
	this.txt_header.updateInterface();
	y += this.txt_header.size.y + padding;
	
	// back button
	this.back_button.size.set( this.size.y * 0.20, this.size.y * 0.05 );
	this.back_button.position.set( padding, padding );
	this.back_button.setTextScale( 0.55 );
	this.back_button.updateInterface();
	
	//
	var k = 0.50;
	this.img_geometrix.size.set( this.size.x * k, this.size.x * k /  (2389/625));
	this.img_geometrix.position.set((this.size.x - this.img_geometrix.size.x) / 2, this.size.y - this.img_geometrix.size.y - padding - 2 * this.back_button.size.y);
	this.img_geometrix.updateInterface();
	y += this.img_geometrix.size.y;
};

