"use strict";

//** Constructor
function ListSelectionMenu( parent ) {
	Division.call( this, parent );
	Lema.ClientStorage.SetItem( "goto", "ListSelectionMenu" );

	//** Listing container
	this.container = new Division( this );
	this.container.setColor( "white" );
	this.container.element.style.overflow = "auto";
	this.container.element.style.borderBottom = "solid 1px " + Lema.Colors.TOPBAR_INFO_BG;
	
	this.activity_count = Activity.Selection.GetCountNr();
	this.SetTitle(); // uses: activity_count
	
	//** TOP BAR
	var top_bar = Lema.screen.top_bar;
	top_bar.info_left.visible = true;
	top_bar.info_right.visible = false;
	top_bar.activateLeftGrid( 0 );
	top_bar.activateInfoZone2( 0 );
	top_bar.updateInterface();
	
	//** Gather all selected activities, sorted
	var lst_activity_idx = Activity.Selection.GetListActivityIdx();
	var lst_selected_activities = [];
	var idx, activity_idx, activity;
	for ( idx = 0; idx < lst_activity_idx.length; ++ idx ) {
		activity_idx = lst_activity_idx[ idx ];
		activity = Activity.list[ activity_idx ];
		lst_selected_activities.push( activity );
	}
	sortArray( //** Sort by: category, subcategory, school
		lst_selected_activities,
		function ( a, b ) {
			if ( a.category !== b.category ) {
				return a.category < b.category;
			}
			if ( a.subcategory !== b.subcategory ) {
				return a.subcategory < b.subcategory;
			}
			return a.school < b.school;
		}
	 );
	
	//** Create container items: titles and activity cards
	Lema.SetTextProperties( "header", { color: Lema.Colors.LIST_CATEGORY_FG } );
	var group_by_subcategory = Lema.ClientStorage.GetItem( "group_by_subcategory", 0 );
	this.items = [];
	var item, card, subcategory_id = null, category, txt;
	for ( idx = 0; idx < lst_selected_activities.length; ++ idx ) {
		activity = lst_selected_activities[ idx ];
		
		if ( group_by_subcategory && subcategory_id !== activity.subcategory ) {
			subcategory_id = activity.subcategory;
			//** Add header title: Category | Subcategory
			txt = Activity.GetCategoryById( activity.category ).name + " | ";
			txt += Activity.GetSubcategoryById( activity.category, activity.subcategory ).name;
			item = Lema.CreateText( "header", this.container, txt );
			this.items.push( item );
		}
		
		card = new ActivityCard( this.container, activity, idx );
		card.userData.type = "card";
		card.setOnClick( 
			this.onCLickActivityCard.bind( card )
		 );
		
		this.items.push( card );
	}
	if ( this.items.length == 0 ) {
		item = Lema.CreateText( "header", this.container, Lema.Const.Text.NO_SELECTED_ACTIVITIES );
		this.items.push( item );
	}
	
	//** Empty space at bottom
	item = Lema.CreateText( "header", this.container, "" );
	this.items.push( item );

	var self = this;
	
	//** Back button
	this.back_button = new Button( this, "_" );
	this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setText( "Voltar" );
	this.back_button.setColor( Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER );
	this.back_button.setOnClick( Lema.Goto.ManualSelectionMenu );
	this.back_button.setClickable( true );
	
	//** Selection button
	this.info_button = new Button( this, "_" );
	this.info_button.setIcon( Lema.iconPath + "btn_list_" + ( group_by_subcategory ? "2" : "1" ) + ".png" );
	this.info_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.info_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.info_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.info_button.setText( group_by_subcategory ? "Juntar" : "Separar" );
	this.info_button.setColor( Lema.Colors.CARD_ON, Lema.Colors.BTN_HOVER );
	this.info_button.setOnClick( 
		function () {
			if ( self.activity_count == 0 ) {
				Lema.screen.dialog.show( Lema.Const.Dialog.TXT_NO_ACTIVITIES );
			} else {
				Lema.ClientStorage.SetItem( "group_by_subcategory", ( group_by_subcategory ? 0 : 1 ) );
				Lema.Goto.URL( "index.html" );
			}
		}
	 );
	this.info_button.setClickable( true );

	//** Send button
	this.send_button = new Button( this, "_" );
	this.send_button.setPositioningMode( Division.BOTTOM_RIGHT );
	this.send_button.setIcon( Lema.iconPath + "btn_send.png" );
	this.send_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.send_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.send_button.setText( "Enviar" );
	this.send_button.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	this.send_button.setOnClick( this.onClickSend.bind( this ) );
	
	//** Clear button
	this.clear_button = new Button( this, "_" );
	this.clear_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.clear_button.setIcon( Lema.iconPath + "btn_clear.png" );
	this.clear_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.clear_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.clear_button.setText( "Limpar" );
	this.clear_button.setColor( Lema.Colors.CARD_ON, Lema.Colors.BTN_HOVER );
	this.clear_button.setOnClick( this.onClickClear.bind( this ) );
	
	//** Start button
	this.start_button = new Button( this, "_" );
	this.start_button.setPositioningMode( Division.BOTTOM_RIGHT );
	this.start_button.setIcon( Lema.iconPath + "btn_start.png" );
	this.start_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.start_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.start_button.setText( "Iniciar" );
	this.start_button.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	this.start_button.setOnClick( Lema.Goto.MultipleActivityScreenDialog );
	
	this.sequence = {
		id: -1,
		length: -1,
		idx: -1
	};
}

//** Functions Prototype
ListSelectionMenu.prototype = Object.create( Division.prototype );

//**
ListSelectionMenu.prototype.SetTitle = function () {
	window.document.title =
		Lema.NAME
		+ " - "
		+ this.activity_count
		+ " - "
		+ "ListSelectionMenu";
	Lema.screen.top_bar.info_left.setText( 
		Lema.Const.Text.LIST_SELECTED_ACTIVITIES + " &raquo; " + this.activity_count
	 );
};


//** Update Interface
ListSelectionMenu.prototype.updateInterface = function () {
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
		item = this.items[i];
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
	this.send_button.visible = ( this.activity_count > 0 );
	this.send_button.size.set( h * 4, h );
	this.send_button.position.set( p, p );
	this.send_button.updateInterface();

	//** Start button ( Start activity sequence )
	this.start_button.visible = ( this.activity_count > 0 );
	this.start_button.size.set( h * 4, h );
	this.start_button.position.set( this.size.x / 3.6 - this.start_button.size.x / 2, p );
	this.start_button.updateInterface();

	//** Clear button ( Clear activity sequence )
	this.clear_button.visible = ( this.activity_count > 0 );
	this.clear_button.size.set( h * 4, h );
	this.clear_button.position.set( this.size.x / 3.6 - this.clear_button.size.x / 2, p );
	this.clear_button.updateInterface();

	//** Back button
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface();
	
	//** Info button
	this.info_button.visible = ( this.activity_count > 0 );
	this.info_button.size.set( h * 4.4, h );
	this.info_button.position.set( this.size.x / 2 - this.info_button.size.x / 2, p );
	this.info_button.updateInterface();
};

//** 
ListSelectionMenu.prototype.onClickSend = function ( evt ) {
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

ListSelectionMenu.prototype.CreateSequence = function () {
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

ListSelectionMenu.prototype.CreateSequence_OK = function ( response ) {
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

ListSelectionMenu.prototype.CreateSequenceItem = function () {
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

ListSelectionMenu.prototype.CreateSequenceItem_OK = function ( response ) {
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
ListSelectionMenu.prototype.onClickClear = function ( evt ) {
	Lema.screen.dialog.show( 
		Lema.Const.Dialog.TXT_CLEAR_SELECTION,
		function () {
			Activity.Selection.Clear();
			Lema.Goto.ListSelectionMenu();
		},
		true, //** question
		Lema.NullFunction
	);
};

//**
ListSelectionMenu.prototype.onCLickActivityCard = function ( evt ) {
	//** this : card
 	var was_selected = this.selected;
	var count_nr = Lema.screen.menu.activity_count;
	
	if ( evt.target.id == "lvl" ) { //** Clicked on a level button: toggle it
		this.levelsToggleOne( evt.target.id_n );
		this.selected = ( this.level.length == 0 );
		evt.target.obj.setButtonStatus( ! evt.target.obj.is_on );
	}
	
	if ( ! this.selected ) { //** Can this card be selected?
		if ( Lema.screen.menu.activity_count == Lema.Const.MAX_ACTIVITIES ) {
			Lema.screen.dialog.show( Lema.Const.Dialog.TXT_MAX_ACTIVITIES )
		} else { //** Yes: select this card
			this.selected = true;
			if ( this.level.length == 0 ) {
				this.levelsSelectAll();
			}
			if ( ! was_selected ) {
				Lema.screen.menu.activity_count += 1;
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

// EOF