"use strict";

//** Constructor
function TeacherMenu( parent ) {
	console.log("TeacherMenu");
	Division.call( this, parent );
	var self = this;

	//** Listing container
	this.container = new Division( this );
	this.container.setColor( "white" );
	this.container.element.style.overflow = "auto";
	this.container.element.style.borderBottom = "solid 1px " + Lema.Colors.TOPBAR_INFO_BG;
		
	//** TOP BAR
	var top_bar = Lema.screen.top_bar;
	top_bar.info_left.visible = false;
	top_bar.info_right.visible = false;
	
	//** Create 'tabs' for teacher menu
	this.lst_tabs = [
		{ id: 0, label: "Lista de alunos" },
		{ id: 1, label: "Desempenho do aluno" },
		{ id: 2, label: "Atividades enviadas" },
		{ id: 3, label: "Ficha do aluno", locked: false },
		{ id: 4, label: "Ficha do tutor", locked: false },
		{ id: 5, label: "Configurações", locked: true },
	];
	top_bar.activateLeftGrid( this.lst_tabs.length );
	var idx, cell, tab;
	for ( idx = 0; idx < this.lst_tabs.length; ++ idx ) {
		tab = this.lst_tabs[ idx ];
		cell = top_bar.left_grid[ idx ];
		cell.element.id = "tab_" + tab.id;
		cell.text.setText( tab.label );
		cell.setButton( 
			{ background: "transparent", borderBottom: "transparent" },
			{ background: Lema.Colors.TOPBAR_INFO_BG_ON, borderBottom: "solid 2px " + Lema.Colors.CARD_ON },
			{ background: (tab.locked ? "transparent" : "white"), borderBottom: "solid 2px " + Lema.Colors.TOPBAR_BG }
		 );
		if ( ! tab.locked ) {
			cell.setOnClick( 
				this.onClickTab.bind( this )
			);
		}
	}
	top_bar.activateInfoZone2( 0 );
	
	//** Update visual information
	this.SelectTab();
	top_bar.updateInterface();
	this.SetTitle();
	
	//** Back button
	this.back_button = new Button( this, "_back" );
	this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setText( "Voltar" );
	this.back_button.setColor( Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER );
	this.back_button.setOnClick( Lema.Goto.MainMenu );
	this.back_button.setClickable( true );
	
	this.SetTitle(); //** uses: NONE of the above
	
	//** Create container items
	Lema.SetTextProperties( "header", { color: Lema.Colors.LIST_CATEGORY_FG } );
	this.items = [];
}

//** Functions Prototype
TeacherMenu.prototype = Object.create( Division.prototype );

//==============================================================================

//** 
TeacherMenu.prototype.SelectTab = function () {
	this.selected_tab_idx = Lema.User.GetSelectedTabIdx();
	var selected_tab = this.lst_tabs[ this.selected_tab_idx ];
	var idx, cell, border_color;
	for ( idx = 0; idx < this.lst_tabs.length; ++ idx ) {
		cell = Lema.screen.top_bar.left_grid[ idx ];
		border_color = ( idx == this.selected_tab_idx ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF );
		cell.element.style.borderBottom = "solid 2px " + border_color;
		cell.setButtonStatus( idx == selected_tab.id );
	}
};

//** 
TeacherMenu.prototype.onClickTab = function ( evt ) {
	var idx = parseInt( evt.target.id.split( "_" )[ 1 ], 10 );
	console.log("onClickTab:", idx, this.lst_tabs[ idx ], "/", this.selected_tab_idx );
	if ( this.selected_tab_idx == idx ) {
		return;
	}
	
	var tab = null;
	if ( idx >= 0 && idx <= 4 ) {
		tab = "TeacherMenu_" + idx;
	}
	
	if ( tab != null ) {
		Lema.User.SetSelectedTabIdx( idx );
		Lema.Goto.Menu( tab );
	} else {
		alert("To be implemented: " + this.lst_tabs[ idx ] );
	}
};

//**
TeacherMenu.prototype.SetTitle = function () {
	window.document.title =
		Lema.NAME
		+ " - "
		+ "TeacherMenu: "
		+ this.selected_tab_idx
};

//**
TeacherMenu.prototype.SetSelectedStudentId = function () {
	this.id_aluno = Lema.SelectedStudent.GetItem( "id_aluno", 10 );
	if ( isNaN( this.id_aluno ) ) {
		this.id_aluno = -1;
		console.warn("TeacherMenu >> No selected student");
		var item = Lema.CreateText(
			"line",
			this.container,
			Lema.Const.Dialog.TXT_NO_STUDENT
		);
		this.items.push( item );
	}
};

//**
TeacherMenu.prototype.Spacing = function () {
	var item = Lema.CreateText( "line", this.container, "" );
	this.items.push( item );
};

// EOF