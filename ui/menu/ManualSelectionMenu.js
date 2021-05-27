"use strict";

/*
function onScrollContainer ( evt ) {
	//console.log( evt.target.scrollTop );
	var container = evt.target, idx, e;
	for ( idx = 0; idx < container.children.length; idx++ ) {
		e = container.children[idx];
		if ( e.userData && e.userData.type == "card" ) {
			//e.adjustPosition( container.scrollTop );
			e.userData.y = e.userData.original_y - container.scrollTop;
		}
	}
}
*/

//** Constructor
function ManualSelectionMenu( parent ) {
	Division.call( this, parent );
	Lema.ClientStorage.SetItem( "goto", "ManualSelectionMenu" );
	var self = this;

	//** Listing container
	this.container = new Division( this );
	this.container.setColor( "white" );
	this.container.element.style.overflow = "auto";
	this.container.element.style.borderBottom = "solid 1px " + Lema.Colors.TOPBAR_INFO_BG;
	
	// this.container.element.userData.scrollTop = 0;
	// this.container.element.addEventListener( "scroll", onScrollContainer );
	
	this.activity_count = Activity.Selection.GetCountNr();
	this.selected_category_idx = Lema.ClientStorage.GetItem( "selected_category_idx", 0 );
	this.selected_subcategory_idx = Lema.ClientStorage.GetItem( "selected_subcategory_idx", 0 );
	
	this.selected_category = Activity.categories[ this.selected_category_idx ];
	this.selected_subcategory = this.selected_category.subcategories[ this.selected_subcategory_idx ];
	
	//** TOP BAR
	var top_bar = Lema.screen.top_bar;
	top_bar.info_left.visible = false;
	top_bar.info_right.visible = false;
	//** create cells for each CATEGORY
	top_bar.activateLeftGrid( Activity.categories.length );
	var i, cell, txt;
	for ( i = 0; i < Activity.categories.length; ++ i ) {
		cell = top_bar.left_grid[ i ];
		cell.text.setText( Activity.categories[i].name );
		cell.setButton( 
			{ background: "transparent", borderBottom: "transparent" },
			{ background: Lema.Colors.TOPBAR_INFO_BG_ON, borderBottom: "solid 2px " + Lema.Colors.CARD_ON },
			{ background: "white", borderBottom: "solid 2px " + Lema.Colors.TOPBAR_BG }
		 );
		cell.element.id = "category_" + i;
		cell.setOnClick( 
			this.onClickCategory.bind( this )
		);
	}
	//** create cells for each SUBCATEGORY
	top_bar.activateInfoZone2( this.selected_category.subcategories.length );
	var i2 = 0;
	for ( i = 0; i < this.selected_category.subcategories.length; ++ i ) {
		txt = this.selected_category.subcategories[i].id;
		if ( ! txt.includes( ":" ) ) { //** !! IMPORTANT
			cell = top_bar.left_grid_2[ i2 ++ ];
			cell.text.setText( this.selected_category.subcategories[ i ].name );
			cell.setButton( 
				{ background: "transparent", borderBottom: "transparent" },
				{ background: Lema.Colors.TOPBAR_INFO_BG2_ON, borderBottom: "solid 2px " + Lema.Colors.CARD_ON },
				{ background: "white", borderBottom: "solid 2px " + Lema.Colors.TOPBAR_BG }
			 );
			cell.element.id = "subcategory_" + i;
			cell.setOnClick( 
				this.onClickSubategory.bind( this )
			 );
		}
	}
	//** Update visual information
	this.SelectCategory( this.selected_category_idx );
	this.SelectSubategory( this.selected_subcategory_idx );
	top_bar.updateInterface();
	
	//** Create container items: titles and activity cards
	Lema.SetTextProperties( "header", { color: Lema.Colors.LIST_CATEGORY_FG } );
	this.items = [];
	var item, card, subcategory, activity, txt;
	for ( i = 0; i < Activity.list.length; ++ i ) {
		activity = Activity.list[ i ];
		if ( activity.category != this.selected_category.id ) {
			continue;
		}
		if ( activity.subcategory != this.selected_subcategory.id ) {
			if ( ! activity.subcategory.includes( ":" ) ) { //** !! IMPORTANT
				continue;
			}
			if ( activity.subcategory.split( ":" )[ 0 ] != this.selected_subcategory.id ) {
				continue;
			}
		}

		if ( subcategory !== activity.subcategory ) {
			subcategory = activity.subcategory;
			//** Add header title: Category | Subcategory
			txt = this.selected_category.name + " | ";
			txt += Activity.GetSubcategoryById( this.selected_category.id, subcategory ).name;
			item = Lema.CreateText( "header", this.container, txt );
			this.items.push( item );
		}
		
		card = new ActivityCard( this.container, activity, i );
		card.userData.type = "card";
		card.setOnClick( 
			this.onCLickActivityCard.bind( card )
		 );
		
		this.items.push( card );
	}
	if ( this.items.length == 0 ) {
		item = Lema.CreateText( "header", this.container, Lema.Const.Text.NO_ACTIVITIES );
		this.items.push( item );
	}
	
	//** Empty space at bottom
	item = Lema.CreateText( "header", this.container, "" );
	this.items.push( item );

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
	
	//** Selection button
	this.info_button = new Button( this, "_selection" );
	this.info_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.info_button.setIcon( Lema.iconPath + "icon_grid.png" );
	this.info_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.info_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.info_button.setText( "Ong Namo Guru Dev Namo" );
	this.info_button.setColor( Lema.Colors.CARD_ON, Lema.Colors.BTN_HOVER );
	this.info_button.setOnClick( this.onClickSelection.bind( this ) );
	this.info_button.setClickable( true );

	//** Send button
	this.send_button = new Button( this, "_send" );
	this.send_button.setPositioningMode( Division.BOTTOM_RIGHT );
	this.send_button.setIcon( Lema.iconPath + "btn_send.png" );
	this.send_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.send_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.send_button.setText( "Enviar" );
	this.send_button.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	this.send_button.setOnClick( this.onClickSend.bind( this ) );
	
	//** Clear button
	this.clear_button = new Button( this, "_clear" );
	this.clear_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.clear_button.setIcon( Lema.iconPath + "btn_clear.png" );
	this.clear_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.clear_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.clear_button.setText( "Limpar" );
	this.clear_button.setColor( Lema.Colors.CARD_ON, Lema.Colors.BTN_HOVER );
	this.clear_button.setOnClick( this.onClickClear.bind( this ) );
	
	//** Start button
	this.start_button = new Button( this, "_start" );
	this.start_button.setPositioningMode( Division.BOTTOM_RIGHT );
	this.start_button.setIcon( Lema.iconPath + "btn_start.png" );
	this.start_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.start_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.start_button.setText( "Iniciar" );
	this.start_button.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	this.start_button.setOnClick( Lema.Goto.MultipleActivityScreenDialog );
	
	//** sets info_button text with this.activity_count
	this.SetTitle();
	
	this.sequence = {
		id: -1,
		length: -1,
		idx: -1
	};
}

//** Functions Prototype
ManualSelectionMenu.prototype = Object.create( Division.prototype );

//** 
ManualSelectionMenu.prototype.SetTitle = function () {
	window.document.title =
		Lema.NAME
		+ " - "
		+ this.activity_count
		+ " - "
		+ "ManualSelectionMenu";
	this.info_button.setText( "Sele&ccedil;&atilde;o: " + this.activity_count );
};

//** 
ManualSelectionMenu.prototype.onClickSend = function ( evt ) {
	if ( this.activity_count == 0 ) {
		Lema.screen.dialog.show( Lema.Const.Dialog.TXT_NO_ACTIVITIES );
		return;
	}
	if ( ! Lema.SelectedStudent.set ) {
		Lema.screen.dialog.show( Lema.Const.Dialog.TXT_NO_STUDENT );
		return;
	}
	this.CreateSequence();
};

ManualSelectionMenu.prototype.CreateSequence = function () {
	var form_data = new FormData();
	form_data.append( "tutor", Lema.Login.GetItem( "id" ) );
	form_data.append( "aluno", Lema.SelectedStudent.GetItem( "id_aluno" ) );
	form_data.append( "length", Activity.Selection.GetCountNr() );
	
	Lema.screen.dialog.showWithoutButtons( Lema.Const.Dialog.TXT_SEQUENCE_CREATE );
	
	Lema.XHR.Send(
		"create-sequence.php",
		form_data,
		this.CreateSequence_OK.bind( this )
	);
};

ManualSelectionMenu.prototype.CreateSequence_OK = function ( response ) {
	console.log("CreateSequence_OK:", response);
	if ( response.status == "ok" ) {
		this.sequence.id = response.id;
		this.sequence.length = Activity.Selection.GetCountNr();
		this.sequence.idx = 0;
		this.CreateSequenceItem();
	} else {
		this.sequence.id = -1;
		this.sequence.length = -1;
		this.sequence.idx = -1;
	}
};

ManualSelectionMenu.prototype.CreateSequenceItem = function () {
	console.log("CreateSequenceItem:", this.sequence.idx, "/", this.sequence.length);
	var sequence_data = Activity.Selection.GetSequenceData();
	var data = sequence_data[ this.sequence.idx ];
	
	var form_data = new FormData();
	form_data.append( "sequence", this.sequence.id );
	form_data.append( "activity", data.nr );
	form_data.append( "levels", data.levels.join(",") );
	Lema.XHR.Send(
		"create-sequence-item.php",
		form_data,
		this.CreateSequenceItem_OK.bind( this )
	);
};

ManualSelectionMenu.prototype.CreateSequenceItem_OK = function ( response ) {
	console.log("CreateSequenceItem_OK:", response);
	if ( response.status == "ok" ) {
		this.sequence.idx += 1;
		if ( this.sequence.idx < this.sequence.length ) {
			this.CreateSequenceItem();
		} else {
			Lema.screen.dialog.SetMode( 1 );
			Lema.screen.dialog.show(
				"Sequ&ecirc;ncia enviada para:<br>"
				+ Lema.SelectedStudent.GetItem( "nome" ),
				Lema.NullFunction,
				false
			);
		}
	}
};

//** 
ManualSelectionMenu.prototype.onClickSelection = function ( evt ) {
	if ( this.activity_count > 0 ) {
		Lema.Goto.ListSelectionMenu();
	} else {
		Lema.screen.dialog.show( Lema.Const.Dialog.TXT_NO_ACTIVITIES );
	}
};

//** 
ManualSelectionMenu.prototype.onClickClear = function ( evt ) {
	Lema.screen.dialog.show( 
		Lema.Const.Dialog.TXT_CLEAR_SELECTION,
		function () {
			Activity.Selection.Clear();
			Lema.Goto.ManualSelectionMenu();
		},
		true, //** question
		Lema.NullFunction
	);
};

//** 
ManualSelectionMenu.prototype.onClickCategory = function ( evt ) {
	var idx = parseInt( evt.target.id.split( "_" )[ 1 ], 10 );
	Lema.ClientStorage.SetItem( "selected_category_idx", idx );
	Lema.ClientStorage.SetItem( "selected_subcategory_idx", 0 );
	Lema.Goto.URL( "index.html" );
};

//** 
ManualSelectionMenu.prototype.onClickSubategory = function ( evt ) {
	var idx = parseInt( evt.target.id.split( "_" )[ 1 ], 10 );
	Lema.ClientStorage.SetItem( "selected_subcategory_idx", idx );
	Lema.Goto.URL( "index.html" );
};

//** 
ManualSelectionMenu.prototype.SelectCategory = function ( category_idx ) {
	this.selected_category_idx = category_idx;
	var idx, cell, border_color;
	for ( idx = 0; idx < Activity.categories.length; ++ idx ) {
		cell = Lema.screen.top_bar.left_grid[ idx ];
		border_color = ( idx == this.selected_category_idx ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF );
		cell.element.style.borderBottom = "solid 2px " + border_color;
		cell.setButtonStatus( idx == this.selected_category_idx );
	}
};

//** 
ManualSelectionMenu.prototype.SelectSubategory = function ( subcategory_idx ) {
	this.selected_subcategory_idx = subcategory_idx;
	var idx, cell, border_color, i2 = 0, txt;
	for ( idx = 0; idx < this.selected_category.subcategories.length; idx++ ) {
		txt = this.selected_category.subcategories[idx].id;
		if ( ! txt.includes( ":" ) ) { //** !! IMPORTANT
			cell = Lema.screen.top_bar.left_grid_2[ i2 ++ ];
			border_color = ( idx == this.selected_subcategory_idx ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF );
			cell.element.style.borderBottom = "solid 2px " + border_color;
			cell.setButtonStatus( idx == this.selected_subcategory_idx );
		}
	}
};

//** 
ManualSelectionMenu.prototype.onCLickActivityCard = function ( evt ) {
	//** this :: card
 	var was_selected = this.selected;
	var count_nr = Lema.screen.menu.activity_count;
	
	if ( evt.target.id == "lvl" ) { //** Clicked on a level button: toggle it
		this.levelsToggleOne( evt.target.id_n );
		this.selected = ( this.level.length == 0 );
		evt.target.obj.setButtonStatus( ! evt.target.obj.is_on );
	}
	
	if ( ! this.selected ) { //** Can this card be selected?
		if ( Lema.screen.menu.activity_count == Lema.Const.MAX_ACTIVITIES ) {
			Lema.screen.dialog.show( Lema.Const.Dialog.TXT_MAX_ACTIVITIES );
		} else { //** Yes: select this card
			this.selected = true;
			if ( this.level.length == 0 ) {
				this.levelsSelectAll();
			}
			if ( ! was_selected ) {
				Lema.screen.menu.activity_count += 1;
				// if ( Lema.User.is_student ) {
					// Lema.Sound.RegisterNumber( Lema.screen.menu.activity_count, true );
				// }
			}
		}
	} else { //** Unselect this card
		this.selected = false;
		this.levelsSelectNone();
		Lema.screen.menu.activity_count -= 1;
	}
	
	Activity.Selection.UpdateFromCard( this, Lema.screen.menu.activity_count - count_nr );
	this.updateInterface(); //** update card interface
	Lema.screen.menu.SetTitle();
	Lema.screen.menu.updateInterface();
};

//** Update Interface
ManualSelectionMenu.prototype.updateInterface = function () {
	Division.prototype.updateInterface.call( this );
	
	//** Container
	this.container.size.set( this.size.x, this.size.y * 0.90 );
	this.container.position.set( 0, 0 );
	this.container.updateInterface();

	//** Parameters
	var padding = 16;
	var scroll_width = 40;
	var NR_COLUMNS = Math.round( ( this.size.x - scroll_width ) / 240 );
	var card_w = ( this.size.x - NR_COLUMNS * padding - scroll_width ) / NR_COLUMNS;
	var card_h = card_w;
	var cols = Math.floor( ( this.size.x - scroll_width ) / ( card_w + padding ) );
	var text_w = cols * ( card_w + padding );
	var text_h = this.size.y * 0.08;
	var border_x = ( this.size.x - text_w ) / 2;
	var position = new Vector2( border_x, padding );
	
	//** Update items
	for ( var i = 0, item; i < this.items.length; ++ i ) {
		item = this.items[ i ];
		if ( item.userData.type == "text_heading" ) { //** Item is a text heading
			item.size.set( text_w, text_h );
			if ( position.x > border_x ) {
				position.x = border_x;
				if ( i == this.items.length - 1 ) {
					position.y += ( card_h * 0.95 );
				} else {
					position.y += ( card_h + padding );
				}
			}
		} else { //** Item is a card
			var selection_idx = Activity.Selection.QueryActivityIdx( item.activity.idx );
			if ( selection_idx != -1 ) {
				Activity.Selection.UpdateToCard( item, selection_idx );
			}
			item.size.set( card_w, card_h );
		}
		
		item.position.copy( position );
		item.updateInterface();

		position.x += item.size.x + padding;

		if ( position.x + ( card_w + padding ) > this.size.x ) { //** new line
			position.x = border_x;
			position.y += item.size.y + padding;
		}
	}

	//** Update buttons
	var h = this.size.y * 0.10;
	var pp = 0.15;
	var p = h * pp;
	h = h * ( 1 - 2 * pp );
	
	//** Send button ( Send activity sequence to student )
	// this.send_button.visible = ( this.activity_count > 0 && Lema.SelectedStudent.set );
	this.send_button.size.set( h * 4, h );
	this.send_button.position.set( p, p );
	this.send_button.updateInterface();

	//** Start button ( Start activity sequence )
	// this.start_button.visible = ( this.activity_count > 0 );
	this.start_button.size.set( h * 4, h );
	this.start_button.position.set( this.size.x / 3.6 - this.start_button.size.x / 2, p );
	this.start_button.updateInterface();

	//** Clear button ( Clear activity sequence )
	// this.clear_button.visible = ( this.activity_count > 0 );
	this.clear_button.size.set( h * 4, h );
	this.clear_button.position.set( this.size.x / 3.6 - this.clear_button.size.x / 2, p );
	this.clear_button.updateInterface();

	//** Back button
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface();
	
	//** Info button
	this.info_button.size.set( h * 4.4, h );
	this.info_button.position.set( this.size.x / 2 - this.info_button.size.x / 2, p );
	this.info_button.updateInterface();
};

// EOF