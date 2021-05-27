"use strict";

//** Constructor
function StudentMenu( parent ) {
	Division.call( this, parent );
	var self = this;
	
	Lema.ClientStorage.SetItem( "goto", "StudentMenu" );

	//** Listing container
	this.container = new Division( this );
	this.container.setColor( "white" );
	this.container.element.style.overflow = "auto";
	this.container.element.style.borderBottom = "solid 1px " + Lema.Colors.TOPBAR_INFO_BG;
		
	//** TOP BAR
	var top_bar = Lema.screen.top_bar;
	top_bar.info_left.visible = true;
	top_bar.info_left.setText( "Olá, " + Lema.Login.GetItem( "nome" ) + "." );
	top_bar.info_right.visible = false;
	top_bar.activateLeftGrid( 0 );
	top_bar.activateInfoZone2( 0 );
	top_bar.updateInterface();
	
	//** 
	Lema.SetTextProperties( "header", { color: Lema.Colors.LIST_CATEGORY_FG } );
	var item;
	this.items = [];
	
	//** Header: sent activities
	this.sequence_header = Lema.CreateText( "header", this.container, Lema.Const.Menu.Student.HEADER_2 );
	this.sequence_header.visible = false;
	this.items.push( this.sequence_header);
	
	this.sequence_text = Lema.CreateText( "line", this.container, Lema.Const.Menu.Student.STEP_2a );
	this.sequence_text.visible = false;
	this.items.push( this.sequence_text );
	
	this.sequence_button = new Button( this.container, "_message" );
	this.sequence_button.setIcon( Lema.iconPath + "icon_message.png" );
	this.sequence_button.setIconScale( Lema.Const.BTN_ICON_SCALE * 0.80 );
	// this.sequence_button.setPositioningMode( Division.BOTTOM_LEFT );
	this.sequence_button.setTextScale( Lema.Const.BTN_TEXT_SCALE * 0.75 );
	this.sequence_button.setText( "Atividades enviadas" );
	this.sequence_button.setColor(Lema.Const.Menu.Student.BTN_SEQUENCE_BG, Lema.Colors.BTN_HOVER );
	this.sequence_button.setOnClick( this.GetSequenceItems.bind(this) );
	this.sequence_button.setClickable( true );
	this.sequence_button.userData.type = "btn";
	this.sequence_button.visible = false;
	this.items.push( this.sequence_button );
	
	//** Header: Choose random activities
	item = Lema.CreateText( "header", this.container, Lema.Const.Menu.Student.HEADER_1 );
	this.items.push( item );
	item = Lema.CreateText( "line", this.container, Lema.Const.Menu.Student.STEP_1 );
	this.items.push( item );
	
	//* Create toogle buttons for CATEGORIES
	this.lst_category_buttons = [];
	var idx, category, btn, id;
	for ( idx = 0; idx < Activity.categories.length; ++ idx ) {
		category = Activity.categories[ idx ];
		id = "category_" + category.id.toLowerCase();
		if ( Lema.User.is_tutor ) {
			id = "_" + id;
		}
		btn = new ToggleButton( this.container, id );
		btn.setIcon( Lema.iconPath + "cat_" + category.id.toLowerCase() + ".png" );
		btn.setIconScale( Lema.Const.Menu.Student.BTN_ICON_SCALE );
		btn.setText( category.name );
		btn.setColor( Lema.Const.Menu.Student.BTN_TOGGLE_OFF, Lema.Const.Menu.Student.BTN_TOGGLE_ON );
		btn.text.setTextColor( Lema.Const.Menu.Student.BTN_TOGGLE_FG );
		btn.setTextScale( Lema.Const.Menu.Student.BTN_TEXT_SCALE );
		btn.icon.keep_aspect_ratio = false;
		btn.userData.type = "btn_category";
		btn.userData.seq_length = Activity.categories.length;
		btn.userData.seq_idx = idx;
		btn.userData.category_id = category.id
		this.items.push( btn );
		this.lst_category_buttons.push( btn );
	}
	
	this.Spacing();
	
	//** Create container items: NR ACTIVITIES
	item = Lema.CreateText( "line", this.container, Lema.Const.Menu.Student.STEP_2 );
	this.items.push( item );
	this.lst_nr_buttons = [];
	this.count_nr = 0;
	for ( idx = Lema.Const.MIN_ACTIVITIES; idx <= Lema.Const.MAX_ACTIVITIES; ++ idx ) {
		id = String(idx);
		if ( Lema.User.is_tutor ) {
			id = "_" + id;
		}
		btn = new ToggleButton( this.container, id, true, this.onClickNrButton );
		btn.setText( idx );
		btn.setColor( Lema.Const.Menu.Student.BTN_TOGGLE_OFF, Lema.Const.Menu.Student.BTN_TOGGLE_ON );
		btn.text.setTextColor(  Lema.Const.Menu.Student.BTN_TOGGLE_FG );
		btn.setTextScale( Lema.Const.Menu.Student.BTN_TEXT_SCALE * 1.5 );
		btn.userData.type = "btn_nr";
		btn.userData.seq_length = ( 10 - 5 ) + 1;
		btn.userData.seq_idx = idx - 5;
		btn.userData.nr = idx;
		btn.userData.menu = this;
		this.items.push( btn );
		this.lst_nr_buttons.push( btn );
	}
	
	this.Spacing();

	//** Back button
	if ( Lema.User.is_tutor) {
		this.back_button = new Button( this, "_back" );
		this.back_button.setIcon( Lema.iconPath + "btn_back.png" );
		this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
		this.back_button.setPositioningMode( Division.BOTTOM_LEFT );
		this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
		this.back_button.setText( "Voltar" );
		this.back_button.setColor( Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER );
		this.back_button.setOnClick( Lema.Goto.MainMenu );
		this.back_button.setClickable( true );
	}
	
	//** Start button
	if ( Lema.User.is_tutor) {
		this.start_button = new Button( this, "_start" );
	} else {
		this.start_button = new Button( this, "start" );
	}
	this.start_button.setPositioningMode( Division.BOTTOM_RIGHT );
	this.start_button.setIcon( Lema.iconPath + "btn_start.png" );
	this.start_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.start_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.start_button.setText( "Iniciar" );
	this.start_button.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	this.start_button.setOnClick( this.onClickStart.bind( this ) );
	this.start_button.setClickable( true );
	
	this.SetTitle(); //** uses: NONE of the above
	
	if ( Lema.User.is_student ) {
		Lema.Sound.RegisterDialogue( "sequence_start" );
		Lema.Sound.RegisterDialogue( "sequence_end" );
		Lema.Sound.RegisterDialogue( "good_luck" );
		Lema.Sound.RegisterDialogue( "must_choose_categories" );
		Lema.Sound.RegisterDialogue( "must_choose_challenges" );
	}
	
	Lema.User.SetSequenceId( 0 );
	this.GetTeacherSequenceInfo();
}

//** Functions Prototype
StudentMenu.prototype = Object.create( Division.prototype );

//**
StudentMenu.prototype.GetTeacherSequenceInfo = function () {
	console.log("GetTeacherSequenceInfo");
	var form_data = new FormData();
	form_data.append( "id", Lema.Login.GetItem( "id" ) );
	Lema.XHR.Send(
		"get-sequence-info.php",
		form_data,
		this.GetTeacherSequenceInfo_OK.bind( this )
	);
};

StudentMenu.prototype.GetTeacherSequenceInfo_OK = function ( response ) {
	console.log("-- GetTeacherSequenceInfo_OK:", response);
	if ( response.status != "ok" ) {
		return;
	}
	this.sequence_length = parseInt( response.length, 10 );
	if ( isNaN( this.sequence_length ) ) {
		return;
	}
	//** teacher sequence available
	this.sequence_id = parseInt( response.id, 10 );
	this.sequence_header.visible = true;
	this.sequence_text.visible = true;
	this.sequence_button.visible = true;
	this.sequence_button.setText( "Atividades enviadas: " + this.sequence_length );
	this.updateInterface();
	
	setTimeout( this.LoadSoundNr.bind(this), 1E3 / 6 );
};

StudentMenu.prototype.LoadSoundNr = function () {
	var status = Lema.Sound.RegisterNumber( this.sequence_length, true );
	if ( ! status ) {
		setTimeout( this.LoadSoundNr.bind(this), 1E3 / 6 );
	}
};

//**
StudentMenu.prototype.GetSequenceItems = function ( id ) {
	if ( typeof id == "number" ) {
		this.sequence_id = id;
	}
	console.log("-- GetSequenceItems:", this.sequence_id);
	var form_data = new FormData();
	form_data.append( "id", this.sequence_id );
	Lema.XHR.Send(
		"get-sequence-items.php",
		form_data,
		this.GetSequenceItems_OK.bind( this )
	);
};

StudentMenu.prototype.GetSequenceItems_OK = function ( response ) {
	console.log("-- GetSequenceItems_OK:", response);
	console.assert( response.length == this.sequence_length );
	var idx, item;
	for ( idx = 0; idx < response.length; ++ idx ) {
		item = response[ idx ];
		console.log(idx, item.ficheiro, item.lst_levels);
	}
	//** Set activity selection
	Activity.Selection.SetFromSequenceList( response );
	//** Start sequence
	Lema.User.SetSequenceId( this.sequence_id );
	Lema.Goto.MultipleActivityScreenDialog();
};

//**
StudentMenu.prototype.onClickNrButton = function () {
	//** this : button
	var idx, btn, lst = this.userData.menu.lst_nr_buttons;
	for ( idx = 0; idx < lst.length; ++ idx ) {
		btn = lst[ idx ];
		if ( btn != this ) {
			btn.selected = false;
			btn.updateInterface();
		}
	}
	this.userData.menu.count_nr = ( this.selected ? this.userData.nr : 0 );
};


//**
StudentMenu.prototype.onClickStart = function () {
	var idx, btn, lst_categories = [], message = null, dlg = null;
	
	//** Get selected categories
	for ( idx = 0; idx < this.lst_category_buttons.length; ++ idx ) {
		btn = this.lst_category_buttons[ idx ];
		if ( btn.selected ) {
			lst_categories.push( btn.userData.category_id );
		}
	}
	if ( lst_categories.length == 0 ) { //** No categories selected
		message = Lema.Const.Dialog.TXT_NO_CATEGORIES;
		dlg = "dlg_must_choose_categories";
	} else {
		if ( this.count_nr == 0 ) { //** No nr activities selected
			message = Lema.Const.Dialog.TXT_NO_COUNTNR;
			dlg = "dlg_must_choose_challenges";
		} else {
			//** get random activities
			var nr_activities = Activity.Selection.MakeRandom( 
				lst_categories, this.count_nr, 6858
			 );
			if ( nr_activities == 0 ) { //** No activities available
				message = Lema.Const.Dialog.TXT_UNAVAILABLE_ACTIVITIES;
			} else { //** OK, go!
				Lema.Goto.MultipleActivityScreenDialog();
			}
		}
	}
	
	if ( message != null ) { //** shit happened...
		Lema.screen.dialog.show( message, null );
		if ( dlg != null ) {
			Lema.SoundManager.Play( dlg );
		}
	}
};

//**
StudentMenu.prototype.SetTitle = function () {
	window.document.title =
		Lema.NAME
		+ " - "
		+ "StudentMenu";
};

//**
StudentMenu.prototype.Spacing = function () {
	var item = Lema.CreateText( "line", this.container, "" );
	this.items.push( item );
};

//** Update Interface
StudentMenu.prototype.updateInterface = function () {
	Division.prototype.updateInterface.call( this );
	
	//** Container
	this.container.size.set( this.size.x, this.size.y * 0.90 );
	this.container.position.set( 0, 0 );
	this.container.updateInterface();

	//** Parameters
	var padding = 20; //** px
	var scroll_width = 40;
	var page_width = this.size.x - 2 * padding;
	var line_height = this.size.y * 0.05;
	
	var position = new Vector2( 2 * padding, padding );
	
	//** Update items
	for( var i = 0, item; i < this.items.length; i++ ) {
		item = this.items[i];
		
		if ( ! item.visible ) {
			item.updateInterface();
			continue;
		}
		
		if ( item.userData.type == "text_heading" || item.userData.type == "text_line" )
		{
			if ( item.userData.type == "text_line" ) {
				item.size.set( page_width - padding, line_height );
				item.position.set( 2 * padding, position.y );
			} else {
				item.size.set( page_width, line_height );
				item.position.set( padding, position.y );
			}
			position.y += ( line_height + padding );
			position.x = 2 * padding;
		}
		else if ( item.userData.type == "btn_category" ) {
			var w = ( page_width / item.userData.seq_length ) - padding;
			item.size.set( w, line_height * 2 );
			item.position.set( position.x, position.y );
			position.x += w + padding;
			if ( item.userData.seq_idx == item.userData.seq_length - 1 ) {
				position.y += 2 * line_height;
			}
		}
		else if ( item.userData.type == "btn_nr" ) {
			var w = ( page_width / item.userData.seq_length );
			item.size.set( w / 2, line_height * 2 );
			if ( item.userData.seq_idx == 0 ) {
				position.x = padding + w / 4;
			}
			item.position.set( position.x, position.y );
			position.x += w;
			if ( item.userData.seq_idx == item.userData.seq_length - 1 ) {
				position.y += 2 * line_height;
			}
		}
		else if ( item.userData.type == "btn" ) {
			var w = ( page_width / 3 );
			item.size.set( w , line_height * 2 );
			item.position.set( position.x, position.y );
			position.x += w;
			position.y += 3 * line_height;
		}
		
		item.updateInterface();
		if ( item.userData.type == "btn" ) { //** btn.updateInterface sets borderRadius
			item.element.style.borderRadius = "4px";
		}
	}

	//** Update buttons
	var h = this.size.y * ( 1 - 0.90 );
	var pp = 0.15;
	var p = h * pp;
	h = h * ( 1 - 2 * pp );
	
	//** Start button
	this.start_button.size.set( h * 4, h );
	this.start_button.position.set( p, p );
	this.start_button.updateInterface();

	//** Back button
	if ( Lema.User.is_tutor) {
		this.back_button.size.set( h * 4, h );
		this.back_button.position.set( p, p );
		this.back_button.updateInterface();
	}
};

// EOF