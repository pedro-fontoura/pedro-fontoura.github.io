"use strict";

// constructor
function MustRead(parent)
{
	Division.call(this, parent);
	
	Lema.ClientStorage.SetItem("goto", "MustRead");
	// Lema.ClientStorage.SetItem("backto", "LoginScreen");
	
	this.setColor( "#FFF" );
	this.setColor( "#d6f7f9" );

	// LEMA Image
	this.img_lema = new LemaImage(this);
	this.img_lema.setImage(Lema.imagePath + "lema.png");
	this.img_lema.setPositioningMode(Division.TOP_RIGHT);
	
	Lema.SetTextProperties(
		"header",
		{ color: Lema.Colors.TOPBAR_BG, alignment: Text.LEFT, weight: "bold" }
	);
	
	this.txt_header = Lema.CreateText( "header", this.element, Lema.Const.Text.MAIN_TITLE );
	this.txt_header.setMultiLine( true );
	this.txt_header.setAlignment( Text.CENTER );
	
	// Content
	this.content = new Division();
	this.content.setColor( "white" );
	this.content.element.style.overflowY = "auto";
	
	//** BEGIN: Content items
	this.CreateContentItems();
	//** END: Content items
	
	//** Back button
	var status = Lema.ClientStorage.GetItem( "login_mustread", 0 );
	
	this.back_button = new Button( this, "back" );
	this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setColor( Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER );
	this.back_button.setOnClick( this.onClickBack.bind( this ) );
	this.back_button.setClickable( true );
	this.back_button.element.style.opacity = 0.33;
	this.back_button.userData.delay = ( ! status ) ? 15 : 0;
	this.back_button.setText( "Voltar" );
	this.UpdateBackButton( true );
	
	//
	window.document.title = Lema.NAME + " - " + "MustRead";
}

//Functions Prototype
MustRead.prototype = Object.create(Division.prototype);

//
MustRead.prototype.onClickBack = function() {
	if ( this.back_button.userData.delay > 0 ) {
		console.warn( "wait:", this.back_button.userData.delay );
		return;
	}

	Lema.ClientStorage.SetItem( "login_mustread", 1 );
	Lema.Goto.Back();
}

//
MustRead.prototype.UpdateBackButton = function( k ) {
	
	if ( k === undefined ) {
		this.back_button.userData.delay -= 1;
	}
	
	if ( this.back_button.userData.delay > 0 ) {
		setTimeout( this.UpdateBackButton.bind( this), 1E3 );
		this.back_button.setText( "Voltar... " + this.back_button.userData.delay);
	} else {
		this.back_button.setText( "Voltar" );
		this.back_button.element.style.opacity = 1;
	}
};

//
MustRead.prototype.CreateContentItems = function() {
	this.items = [];
	
	var item;
	
	//** Geometrix logo
	this.img_geometrix = new LemaImage(this.content);
	this.img_geometrix.setImage(Lema.imagePath + "geometrix.png");
	this.img_geometrix.setPositioningMode(Division.TOP_LEFT);
	this.img_geometrix.setExternalAnchor( "http://www.cidma-ua.org/g-pt/" );
	
	//** Geometrix Web Site
	item = Lema.CreateText( "line", this.content, "http://www.cidma-ua.org/g-pt/" );
	item.setExternalAnchor( "http://www.cidma-ua.org/g-pt/" );
	item.setAlignment( Text.CENTER );
	item.element.style.paddingTop = "10px";
	item.element.style.paddingBottom = "20px";
	item.element.style.borderBottom = "solid 1px " + Lema.Colors.BTN_HOVER;
	item.userData.vSpace = 3;
	this.items.push( item );
	
	//** Coordenação
	item = Lema.CreateText( "header", this.content, "Coordenação:" );
	this.items.push( item );
	item = Lema.CreateText( "line", this.content, "Ana Breda (DMat/CIDMA) e Eugénio Rocha (DMat/CIDMA)." );
	this.items.push( item );
	
	//** Conceito
	item = Lema.CreateText( "header", this.content, "Modelo conceptual de um protótipo:" );
	this.items.push( item );
	item = Lema.CreateText( "line", this.content, "Versões 1 a 3: Isabel Santos sob a orientação de Ana Breda (DMat/CIDMA) e Ana Margarida Almeida (DeCA/DigiMedia)." );
	this.items.push( item );
	
	//** -----------------------------------------------------------------------
	//** Implementação
	//** -----------------------------------------------------------------------
	item = Lema.CreateText( "header", this.content, "Implementação do protótipo:" );
	this.items.push( item );
	// V3 :: 2017
	item = Lema.CreateText( "line", this.content, "Versão 3: Pedro Fontoura, Fábio Henriques, Cláudio Henriques, Fábio Maia, Miguel Araújo." );
	this.items.push( item );
	// V2 :: 2016
	item = Lema.CreateText( "line", this.content, "Versão 2: Pedro Fontoura, José Ferrão, Fábio Henriques, Cláudio Henriques, Adriano Oliveira, Fábio Maia, Jorge Ruivo." );
	// V1 :: 2014/2015
	this.items.push( item );
	item = Lema.CreateText( "line", this.content, "Versão 1: Jorge Ruivo." );
	this.items.push( item );
	
	//** -----------------------------------------------------------------------
	//** Design
	//** -----------------------------------------------------------------------
	item = Lema.CreateText( "header", this.content, "Design do protótipo:" );
	this.items.push( item );
	// V3
	item = Lema.CreateText( "line", this.content, "Versão 3: Inga Saboia." );
	this.items.push( item );
	// V2
	item = Lema.CreateText( "line", this.content, "Versão 2: Inga Saboia, Tânia Ribeiro." );
	this.items.push( item );
	// V1
	item = Lema.CreateText( "line", this.content, "Versão 1: Silvino Almeida, Catarina Mouta." );
	this.items.push( item );
	
	//** -----------------------------------------------------------------------
	//** Versões
	//** -----------------------------------------------------------------------
	item = Lema.CreateText( "header", this.content, "Versões:" );
	this.items.push( item );
	// V3
	item = Lema.CreateText( "line", this.content, "Versão 3: 2017." );
	this.items.push( item );
	// V2
	item = Lema.CreateText( "line", this.content, "Versão 2: 2016." );
	this.items.push( item );
	// V1
	item = Lema.CreateText( "line", this.content, "Versão 1: 2014/2015." );
	this.items.push( item );
	
	// space
	item = Lema.CreateText( "line", this.content, "" );
	this.items.push( item );
	
};

MustRead.prototype.updateInterface = function()
{
	this.size.set(window.innerWidth, window.innerHeight);

	Division.prototype.updateInterface.call(this);
	
	var padding = this.size.y * 0.02;
	var y = padding;
	var k;
	
	// img lema
	k = 0.15;
	this.img_lema.size.set(this.size.y * k * (766/270), this.size.y * k);
	this.img_lema.position.set( (this.size.x - this.img_lema.size.x) / 2, y);
	this.img_lema.updateInterface();
	y += this.img_lema.size.y;
	
	// txt header
	this.txt_header.size.set( this.size.x - 2 * padding, 2 * this.size.y * 0.05 );
	this.txt_header.position.set( padding, y );
	this.txt_header.setTextSize( this.txt_header.size.y * 0.75 / 2 );
	this.txt_header.updateInterface();
	y += this.txt_header.size.y + padding;
	
	// back button
	var h = this.size.y * 0.10;
	var pp = 0.15;
	var p = h * pp;
	h = h * ( 1 - 2 * pp );
	
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface();
	
	// content
	this.content.size.set(
		this.size.x - 2 * padding,
		this.size.y - padding - y * 1 - this.back_button.size.y - padding
	);
	this.content.position.set( padding, y );
	this.content.updateInterface();
	
	//** items
	var idx, item, y = padding;
	var header_height = this.content.size.y * 0.0475;
	var line_height = this.content.size.y * 0.04;
	var max_w = this.content.size.x - 2 * padding;
	var th;
	
	// geometrix logo
	var k = 0.50;
	this.img_geometrix.size.set(
		this.content.size.x * k,
		this.content.size.x * k /  (2389/625)
	);
	this.img_geometrix.position.set(
		(this.content.size.x - this.img_geometrix.size.x) / 2,
		y
	);
	this.img_geometrix.updateInterface();
	y += this.img_geometrix.size.y;
	
	for ( idx = 0; idx < this.items.length; ++ idx ) {
		item = this.items[ idx ];
		
		if ( item.userData.type == "text_heading" ) {
			y += padding;
			item.size.set( max_w, header_height );
			item.position.set( padding, y );
			item.setTextSize( item.size.y * 0.90 );
		}
		else if ( item.userData.type == "text_line" ) {
			item.setMultiLine( false );
			item.size.set( max_w - 2 * padding, line_height );
			item.position.set( 2 * padding, y );
			th = Math.min( item.size.y * 0.90, item.size.x * 1.80E-2 );
			item.setTextSize( th );
		}
		
		y += item.size.y + padding;
		
		if ( item.userData.vSpace ) {
			y += line_height * parseInt( item.userData.vSpace, 10 );
		}
		
		item.updateInterface();
	}
	
};

