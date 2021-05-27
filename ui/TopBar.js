"use strict";

//** constructor
function TopBar( parent ) {
	Division.call( this, parent );

	this.setColor( Lema.Colors.TOPBAR_BG );
	
	//Event type selector
	// if(Lema.touchscreen)
	// {
		// this.enter_event = "touchstart";
		// this.leave_event = "touchend";
	// }
	// else
	// {
		// this.enter_event = "mouseenter";
		// this.leave_event = "mouseleave";
	// }

	//** Lema logo
	this.lema = new LemaImage( this );
	this.lema.setPositioningMode( Division.TOP_LEFT );
	this.lema.setImage( Lema.imagePath + "lema.png" );
	this.lema.setAnchor( "index.html" );
	this.lema.element.userData.type = "LEMA";
	if ( Lema.User.is_student ) {
		Lema.Sound.RegisterButton( "lema" );
		//Pointer enter button callback
		var element = this.lema.element;
		var enter_callback = function(event) {
			Lema.Sound.PlayButton( "lema" )
		};
		//Pointer pressed event
		element.addEventListener(Lema.events.enter, enter_callback, false);
	}

	//** User Name
	this.user_name = new Text( this );
	this.user_name.setAlignment( Text.LEFT );
	this.user_name.setPositioningMode( Division.TOP_LEFT );
	this.user_name.setTextColor( Lema.Colors.TOPBAR_FG );
	
	//** Logout Icon
	this.logout = new LemaImage( this );
	this.logout.setPositioningMode( Division.TOP_RIGHT );
	this.logout.setImage( Lema.imagePath + "logout.png" );
	this.logout.visible = true;
	this.logout.setAnchor( this.onClickLogout.bind( this ) );
	if ( Lema.User.is_student ) {
		this.logout.element.title = " Sair ";
		Lema.Sound.RegisterButton( "exit" );
		Lema.Sound.RegisterButton( "yes" );
		Lema.Sound.RegisterButton( "no" );
		Lema.Sound.RegisterDialogue( "exit_lema" );
		//Pointer enter button callback
		var element = this.logout.element;
		var enter_callback = function(event) {
			Lema.Sound.PlayButton( "exit" )
		};
		//Pointer pressed event
		element.addEventListener(Lema.events.enter, enter_callback, false);
	}
	
	//** PRIMARY INFO ZONE (below topbar icons)
	//**   - info_zone_1
	//** Contains
	//**   - info_left :: TEXT, left aligned
	//**   - info_right :: TEXT, right aligned
	//**   - left_grid :: null || cell grid (ex: categories)
	//**   - right_grid :: null || cell grid (ex: activities sequence)
	this.info_zone_1 = new Division( this.element );
	this.info_zone_1.setColor( Lema.Colors.TOPBAR_INFO_BG );
	this.info_zone_1.setPositioningMode( Division.BOTTOM_LEFT );
	
	this.info_left = new Text( this.info_zone_1 );
	this.info_left.setAlignment( Text.LEFT );
	this.info_left.setPositioningMode( Division.BOTTOM_LEFT );
	this.info_left.setTextColor( Lema.Colors.TOPBAR_INFO_FG );
	
	this.info_right = new Text( this.info_zone_1 );
	this.info_right.setAlignment( Text.RIGHT );
	this.info_right.setPositioningMode( Division.BOTTOM_RIGHT );
	this.info_right.setTextColor( Lema.Colors.TOPBAR_INFO_FG );
	
	this.left_grid = null;	
	this.right_grid = null;
	
	//** SECONDARY INFO ZONE (below primary info zone)
	//**   - info_zone_2 :: TEXT, deactivated by default
	//** Contains
	//**   - left_grid_2 :: null || cell grid (ex: subcategories)
	this.info_zone_2 = null;
	this.left_grid_2 = null;	
}

//** Prototype
TopBar.prototype = Object.create( Division.prototype );

//** onClickLogout
TopBar.prototype.onClickLogout = function( ) {
	Lema.screen.dialog.show( 
		Lema.Const.Dialog.TXT_LOGOUT,
		Lema.Login.Exit,
		true, //** question
		Lema.NullFunction
	);
	if ( Lema.User.is_student ) {
		Lema.SoundManager.Play( "dlg_exit_lema" );
	}
};

//** activateInfoZone2
TopBar.prototype.activateInfoZone2 = function( n ) {
	if ( n == undefined ) {
		n = 0;
	}
	
	if ( n == 0 ) { //** destroy and set to null
		if ( this.info_zone_2 != null ) {
			this.info_zone_2.destroy( );
			this.info_zone_2 = null;
		}
	} else {
		//** Make zone division
		this.info_zone_2 = new Division( this.element );
		this.info_zone_2.setPositioningMode( Division.BOTTOM_LEFT );
		this.info_zone_2.setColor( Lema.Colors.TOPBAR_INFO_BG2 );
		
		// var idx, cell;
		// if ( this.left_grid_2 ) {
			// for ( idx = 0; idx < this.left_grid_2.length; idx++ ) {
				// cell = this.left_grid_2[ idx ];
				// cell.element.style.visibility = ( n === 0 ? "hidden" : "visible" );
			// }
			// return;
		// }

		//** Make cells
		this.left_grid_2 = [];
		var idx, cell;
		for ( idx = 0; idx < n; idx++ ) {
			cell = new Division( this.info_zone_2 );
			cell.setPositioningMode( Division.TOP_LEFT );
			cell.text = new Text( cell );
			cell.text.setPositioningMode( Division.TOP_LEFT );
			cell.text.setTextColor( Lema.Colors.TOPBAR_BG );
			cell.text.setAlignment( Text.CENTER );
			cell.text.element.style.whiteSpace = "nowrap";
			cell.text.element.style.display = "block";
			this.left_grid_2.push( cell );
		}
	}
};

//** activateRightGrid, ex: Subcategories
TopBar.prototype.activateRightGrid = function( n ) {
	if ( n === 0 || this.right_grid ) {
		return;
	}
	
	this.right_grid = [];
	var idx, cell;
	for ( idx = 0; idx < n; idx++ ) {
		cell = new Division( this.info_zone_1 );
		cell.setPositioningMode( Division.TOP_RIGHT );
		cell.text = new Text( cell );
		cell.text.setTextColor( Lema.Colors.TOPBAR_BG );
		cell.text.setAlignment( Text.CENTER );
		cell.text.setText( idx );
		cell.text.element.style.width = "100%";
		this.right_grid.push( cell );
	}
};

//** activateLeftGrid, ex: Categories
TopBar.prototype.activateLeftGrid = function( n ) {
	var idx, cell;
	
	if ( n == 0 ) {
		if ( this.left_grid != null ) {
			for ( idx = 0; idx < this.left_grid.length; idx++ ) {
				cell = this.left_grid[idx];
				cell.text.destroy( );
				cell.destroy( );
			}
			this.left_grid = null;
		}
		return;
	}
	
	if ( this.left_grid ) {
		return;
	}
	
	this.left_grid = [];
	for ( idx = 0; idx < n; idx++ ) {
		cell = new Division( this.info_zone_1 );
		cell.setPositioningMode( Division.TOP_LEFT );
		cell.text = new Text( cell );
		cell.text.setPositioningMode( Division.TOP_LEFT );
		cell.text.setTextColor( Lema.Colors.TOPBAR_BG );
		cell.text.setAlignment( Text.CENTER );
		cell.text.element.style.whiteSpace = "nowrap";
		cell.text.element.style.display = "block";
		this.left_grid.push( cell );
	}
};

//** Update Interface
TopBar.prototype.updateInterface = function( )
{
	Division.prototype.updateInterface.call( this );
	
	var padding = this.size.y * 1/100;
	var height_1, height_2, h1, h2;
	
	if ( this.info_zone_2 == null ) {
		height_1 = this.size.y * 2/3;
		height_2 = this.size.y - height_1;
		h1 = height_1 - 2 * padding;
		h2 = height_2 - 2 * padding;
	} else {
		height_1 = this.size.y * 0.48;
		height_2 = ( this.size.y - height_1 ) / 2;
		h1 = height_1 - 2 * padding;
		h2 = height_2 - 2 * padding;
	}
	
	//** Lema logo
	this.lema.position.set( height_1 * 0.15, height_1 * 0.15 );
	this.lema.size.set( height_1 * 0.70 * ( 766/270 ), height_1 * 0.70 );
	this.lema.updateInterface( );
	
	//** User name
	if ( Lema.User.is_tutor ) {
		var text = Lema.Login.GetItem("nome");
		if ( Lema.SelectedStudent.set ) {
			text += " &raquo; " + Lema.SelectedStudent.GetItem("nome");
		}
		this.user_name.setText( text );
		this.user_name.position.set( this.lema.size.x + 2 * height_1 * 0.15, height_1 * 0.15 );
		this.user_name.size.set( this.size.x * 0.5, height_1 * 0.70 );
		this.user_name.setTextSize( this.user_name.size.y * 0.33 );
		this.user_name.updateInterface();
	}

	//** Logout
	this.logout.keep_aspect_ratio = false;
	this.logout.size.set( height_1 * 0.60, height_1 * 0.60 );
	this.logout.position.set( height_1 * 0.20, height_1 * 0.20 );
	this.logout.updateInterface( );

	//** Main info zone 
	this.info_zone_1.size.set( this.size.x, height_2 );
	if ( this.info_zone_2 != null ) {
		this.info_zone_1.position.set( 0, height_2 );
		
		this.info_zone_2.size.set( this.size.x, height_2 );
		this.info_zone_2.updateInterface( );
	} else {
		this.info_zone_1.position.set( 0, 0 );
	}
	this.info_zone_1.updateInterface( );
	
	//** Info Left
	this.info_left.size.set( this.size.x, h2 );
	this.info_left.position.set( height_1 * 0.15, padding );
	this.info_left.setTextSize( h2 * 0.55 );
	this.info_left.updateInterface( );
	
	//** Info Right
	this.info_right.size.set( this.size.x, h2 );
	this.info_right.position.set( height_1 * 0.15, padding );
	this.info_right.setTextSize( h2 * 0.55 );
	this.info_right.updateInterface( );
	
	var idx, cell;
	
	//** Left Grid (ex: categories)
	if ( this.left_grid ) {
		var x = height_1 * 0.15, w, t;
		for ( idx = 0; idx < this.left_grid.length; idx++ ) {
			cell = this.left_grid[ idx ];
			t = this.size.x / 47;
			cell.text.setTextSize( Math.min( t, 18 ) );
			w = cell.text.element.offsetWidth + 16;
			cell.text.element.style.left = ( ( w - cell.text.element.offsetWidth ) / 2 ) + "px";
			cell.text.element.style.top = ( ( height_2 - cell.text.element.offsetHeight ) / 2 ) + "px";
			cell.size.set( w, height_2 - 2 );
			cell.position.set( x, 0 );
			cell.updateInterface( );
			x += ( w + 4 * padding );
		}
	}

	//** Right Grid (ex: activities sequence)
	if ( this.right_grid ) {
		var x = height_1 * 0.15, w = height_2;
		for ( idx = 0; idx < this.right_grid.length; idx++ ) {
			cell = this.right_grid[idx];
			cell.size.set( w, height_2 - 2 );
			cell.position.set( x, 0 );
			cell.text.setTextSize( height_2 * 0.5 );
			cell.text.element.style.paddingTop = ( height_2 * 0.12 ) + "px";
			cell.updateInterface( );
			x += ( w + 2 * padding );
		}
	}
	
	//** Left Grid 2 (ex: subcategories)
	if ( this.left_grid_2 ) {
		var idx, cell, x = height_1 * 0.15, w, t;
		for ( idx = 0; idx < this.left_grid_2.length; idx++ ) {
			cell = this.left_grid_2[ idx ];
			t = this.size.x / 55;
			cell.text.setTextSize( Math.min( t, 18 ) );
			w = cell.text.element.offsetWidth + 16;
			cell.text.element.style.left = ( ( w - cell.text.element.offsetWidth ) / 2 ) + "px";
			cell.text.element.style.top = ( ( height_2 - cell.text.element.offsetHeight ) / 2 ) + "px";
			cell.size.set( w, height_2 - 2 );
			cell.position.set( x, 0 );
			cell.updateInterface( );
			x += ( w + 4 * padding );
		}
	}
}
