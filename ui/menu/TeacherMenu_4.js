"use strict";

//** Constructor
function TeacherMenu_4( parent ) {
	console.log("TeacherMenu_4");
	TeacherMenu.call( this, parent );
	
	Lema.ClientStorage.SetItem( "goto", "TeacherMenu_4" );
	
	//** Create container items
	
	var item = Lema.CreateText( "header", this.container, "Ficha do tutor" );
	this.items.push( item );
	
	//** Change password
	var btn = new Button( this.container, "_password" );
	btn.setIcon( Lema.iconPath + "btn_start.png" );
	btn.setIconScale( Lema.Const.BTN_ICON_SCALE );
	btn.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	btn.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	btn.setOnClick( this.onClickChangePassword.bind( this ) );
	btn.icon.keep_aspect_ratio = false;
	
	btn.setText( "Mudar a senha" );
	btn.text.setTextColor( Lema.Const.Menu.Student.BTN_TOGGLE_FG );
	btn.setTextScale( Lema.Const.Menu.Student.BTN_TEXT_SCALE );
	btn.userData.type = "btn";
	btn.userData.seq_length = 1;
	btn.userData.seq_idx = 1;
	this.items.push( btn );
		
	//** Show password
	var btn = new Button( this.container, "_password_show" );
	btn.setIcon( Lema.iconPath + "btn_start.png" );
	btn.setIconScale( Lema.Const.BTN_ICON_SCALE );
	btn.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	btn.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
	btn.setOnClick( this.onClickShowPassword.bind( this ) );
	btn.icon.keep_aspect_ratio = false;
	
	btn.setText( "Ver a senha" );
	btn.text.setTextColor( Lema.Const.Menu.Student.BTN_TOGGLE_FG );
	btn.setTextScale( Lema.Const.Menu.Student.BTN_TEXT_SCALE );
	btn.userData.type = "btn";
	btn.userData.seq_length = 1;
	btn.userData.seq_idx = 1;
	this.items.push( btn );
}

//** Functions Prototype
TeacherMenu_4.prototype = Object.create( TeacherMenu.prototype );

//==============================================================================

//** Update Interface
TeacherMenu_4.prototype.updateInterface = function () {
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
		else if ( item.userData.type == "btn" ) {
			var w = ( (page_width - padding)/ item.userData.seq_length ) - padding;
			w = Math.min( w, page_width / 4 );
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
		} else if ( item.userData.type == "tbl" ) {
			item.style.top = position.y + "px";
			item.style.left = padding + "px";
			item.style.right = padding + "px";
			item.style.width = page_width + "px";
			// item.style.marginTop = padding + "px";
		}
		
		if ( item.userData.type != "tbl" ) {
			item.updateInterface();
			console.log( item );
			if ( item.userData.type == "btn" ) {
				//** btn.updateInterface sets borderRadius
				item.element.style.borderRadius = "4px";
			}
		}
	}

	//** Update buttons
	var h = this.size.y * ( 1 - 0.90 );
	var pp = 0.15;
	var p = h * pp;
	h = h * ( 1 - 2 * pp );
	
	//** Back button
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface();
};

TeacherMenu_4.prototype.onClickChangePassword = function ( evt ) {
	var new_password = prompt( "Nova senha:" );
	if ( new_password == null ) {
		return;
	}
	if ( new_password.length < 4 ) {
		alert("Mínimo: 4 carateres");
		return;
	}
	
	var form_data = new FormData();
	var id_pessoa = Lema.Login.GetItem("id", true);
	form_data.append( "id", id_pessoa );
	form_data.append( "value", new_password );
	Lema.XHR.Send(
		"set-person-password.php",
		form_data,
		this.ChangeStudentPassword_OK.bind( this )
	);
};

TeacherMenu_4.prototype.ChangeStudentPassword_OK = function ( response ) {
	console.log(response);
	if ( response.status == "ok" ) {
		alert("Senha mudada para: " + response.value );
	}
};

TeacherMenu_4.prototype.onClickShowPassword = function ( evt ) {
	var form_data = new FormData();
	var id_pessoa = Lema.Login.GetItem("id", true);
	form_data.append( "id", id_pessoa );
	Lema.XHR.Send(
		"get-person-password.php",
		form_data,
		this.ShowStudentPassword_OK.bind( this )
	);
};

TeacherMenu_4.prototype.ShowStudentPassword_OK = function ( response ) {
	console.log(response);
	if ( response.status == "ok" ) {
		alert("Senha: " + response.password );
	}
};

// EOF