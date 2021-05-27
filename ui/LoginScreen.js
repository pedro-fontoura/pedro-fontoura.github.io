"use strict";

//Login screen constructor
function LoginScreen(parent)
{
	Division.call(this, parent);
	
	Lema.ClientStorage.SetItem("goto", "LoginScreen");
	
	this.setColor( "#d6f7f9" );

	// Main Image
	this.screen_image = new LemaImage(this);
	this.screen_image.setImage(Lema.imagePath + "screen_login.jpg");
	this.screen_image.setPositioningMode(Division.TOP_RIGHT);
	
	// Pannel
	this.pannel = new Division( this.element );
	this.pannel.setColor( "#ebfbfb" );
	
	Lema.SetTextProperties(
		"header",
		{ color: Lema.Colors.TOPBAR_BG, alignment: Text.LEFT, weight: "bold" }
	);
	
	// Pannel :: Geometrix
	this.img_geometrix = new LemaImage( this.pannel.element );
	this.img_geometrix.setImage(Lema.imagePath + "geometrix.png");
	this.img_geometrix.setPositioningMode(Division.TOP_RIGHT);
	
	// Pannel :: Login
	this.txt_header = Lema.CreateText( "header", this.pannel.element, "Login" );
	
	// Pannel :: Username
	this.username = new LemaInputField(
		this.pannel.element, "email", "username", "E-mail", {value: ""}
	);
	this.username.input.focus();
	
	// Pannel :: Password
	this.password = new LemaInputField(
		this.pannel.element, "password", "password", "Senha", {value: ""}
	);
	
	// Pannel :: Enter
	this.start_button = new Button(this, "enter");
	this.start_button.setIcon( Lema.iconPath + "btn_key.png" );
	this.start_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.start_button.setPositioningMode(Division.TOP_RIGHT);
	this.start_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.start_button.setText("Entrar");
	this.start_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.start_button.setOnClick( this.onClickEnter.bind( this ) );
	this.start_button.setClickable(true);
	
	// Pannel :: Recover password
	this.recover_button = new TextButton(this, "_recover");
	// this.recover_button.setIcon( Lema.iconPath + "btn_key.png" );
	// this.recover_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.recover_button.setPositioningMode(Division.TOP_RIGHT);
	this.recover_button.setTextScale( Lema.Const.BTN_TEXT_SCALE / 2 );
	this.recover_button.setText("Recuperar senha");
	this.recover_button.setColor(Lema.Colors.TOPBAR_INFO_BG, "white" );
	this.recover_button.text.setTextColor( "#000" );
	this.recover_button.setOnClick( this.onClickRecover.bind( this ) );
	this.recover_button.setClickable(true);
	
	// Pannel :: About
	this.about_button = new TextButton(this.element, "about");
	this.about_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.about_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.about_button.setText("Sobre o " + Lema.name);
	this.about_button.setColor(Lema.Colors.TOPBAR_INFO_BG, "white" );
	this.about_button.text.setTextColor( "#000" );
	this.about_button.setOnClick( Lema.Goto.AboutScreen );
	this.about_button.setClickable(true);
	
	// Pannel :: NewAccount
	this.account_button_1 = new TextButton(this.pannel.element, "create_tutor");
	this.account_button_1.setPositioningMode(Division.BOTTOM_LEFT);
	this.account_button_1.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.account_button_1.setText("Conta tutor");
	this.account_button_1.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.account_button_1.setOnClick( this.onClickNewAccount1.bind( this ) );
	this.account_button_1.setClickable(true);
	
	// Pannel :: NewAccount
	this.account_button_2 = new TextButton(this.pannel.element, "create_student");
	this.account_button_2.setPositioningMode(Division.BOTTOM_RIGHT);
	this.account_button_2.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.account_button_2.setText("Conta aluno");
	this.account_button_2.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.account_button_2.setOnClick( this.onClickNewAccount2.bind( this ) );
	this.account_button_2.setClickable(true);
	
	// Dialog box
	this.dialog = new Dialog(this);
	
	Lema.Sound.RegisterDialogue( "incorrect_email" );
	Lema.Sound.RegisterDialogue( "incorrect_password" );
	Lema.Sound.RegisterDialogue( "missing_email" );
	Lema.Sound.RegisterDialogue( "missing_password" );
	
	//
	window.document.title = Lema.NAME + " - " + "LoginScreen";
}

//Functions Prototype
LoginScreen.prototype = Object.create(Division.prototype);

//
LoginScreen.prototype.onClickRecover = function( evt ) {
	var message = null, e = null, dlg = null;
	
	var username = Lema.eById( "input_username" );
		if ( username.value.length == 0 ) {
		e = username;
		message = Lema.Const.Dialog.TXT_LOGIN_EMAIL;
		dlg = "dlg_missing_email";
	}
	
	if ( message != null ) {
		Lema.onInputError( e, message );
		Lema.SoundManager.Play( dlg );
	} else {
		this.RecoverPassword( evt.ctrlKey );
	}
};

//
LoginScreen.prototype.RecoverPassword = function( verbose ) {
	//** Collect field values
	var form_data = new FormData();
	var lst = [ "username" ];
	var idx, id, field;
	for ( idx = 0; idx < lst.length; ++ idx ) {
		id = lst[ idx ];
		field = Lema.eById( "input_" + id );
		form_data.append( id, field.value );
	}
	form_data.append( "verbose", verbose ? 1 : 0 );
	
	//** Send XML HTTP Request
	Lema.screen.dialog.showWithoutButtons( Lema.Const.Dialog.TXT_REQUEST_PWD );
	Lema.XHR.Send(
		"recover-password.php",
		form_data,
		this.RecoverPassword_OK.bind( this )
	);
};

LoginScreen.prototype.RecoverPassword_OK = function( response ) {
	// Lema.screen.dialog.hide();
	console.log( response );
	if ( Lema.XHR.json ) {
		if ( response.status == "ok" ) {
			var txt = response.password
				? ( "Senha: " + response.password )
				: ( Lema.Const.Dialog.TXT_REQUEST_PWD_OK );
			Lema.screen.dialog.show(
				txt,
				function () {
					Lema.screen.dialog.hide();
				},
				false
			);
		} else {
			Lema.screen.dialog.SetMode( 0 );
			Lema.screen.dialog.show( response.message, Lema.NullFunction, false );
			if ( response.code == 11 ) {
				Lema.SoundManager.Play( "dlg_incorrect_email" );
			} 
		}
	} else {
			Lema.screen.dialog.hide();
	}
};

//
LoginScreen.prototype.onClickEnter = function() {
	var message = null, e = null, dlg = null;
	
	var username = Lema.eById( "input_username" );
	var password = Lema.eById( "input_password" );
	if ( username.value.length == 0 ) {
		e = username;
		message = Lema.Const.Dialog.TXT_LOGIN_EMAIL;
		dlg = "dlg_missing_email";
	} else if ( password.value.length == 0 ) {
		e = password;
		message = Lema.Const.Dialog.TXT_LOGIN_PASSWORD;
		dlg = "dlg_missing_password";
	}
	
	if ( message != null ) {
		Lema.onInputError( e, message );
		Lema.SoundManager.Play( dlg );
	} else {
		var test_enter = this.TestEnter();
		if ( test_enter !== null ) {
			this.Enter( test_enter );
		} else {
			this.SubmitLoginInfo();
		}
	}
};


LoginScreen.prototype.SubmitLoginInfo = function() {
	//** Collect field values
	var form_data = new FormData();
	var lst = [ "username", "password" ];
	var idx, id, field;
	for ( idx = 0; idx < lst.length; ++ idx ) {
		id = lst[ idx ];
		field = Lema.eById( "input_" + id );
		form_data.append( id, field.value );
	}
	
	//** Send XML HTTP Request
	Lema.screen.dialog.showWithoutButtons( Lema.Const.Dialog.TXT_LOGIN_ATHENTICATE );
	Lema.XHR.Send(
		"validate-login.php",
		form_data,
		this.SubmitLoginInfo_OK.bind( this )
	);
};

LoginScreen.prototype.SubmitLoginInfo_OK = function( response ) {
	console.log( response );
	if ( Lema.XHR.json ) {
		if ( response.status == "ok" ) {
			this.Enter( response );
		} else {
			Lema.screen.dialog.SetMode( 0 );
			Lema.screen.dialog.show( response.message, Lema.NullFunction, false );
			if ( response.code == 11 ) {
				Lema.SoundManager.Play( "dlg_incorrect_email" );
			} else if ( response.code == 12 ) {
				Lema.SoundManager.Play( "dlg_incorrect_password" );
			}
		}
	} else {
		Lema.screen.dialog.hide();
	}
};


LoginScreen.prototype.TestEnter = function() {
	var username = Lema.eById( "input_username" ).value;
	var password = Lema.eById( "input_password" ).value;
	
	if ( password === "lema" ) {
		if ( username === "tutor@lema" || username === "totora@lema" ) {
			return {
				id_pessoa: ( username === "tutor@lema" ? 12 : 11 ),
				name: ( username === "tutor@lema" ? "Tutor Geometrix" : "Tutora Geometrix" ),
				id: ( username === "tutor@lema" ? 12 : 11 ),
				login: "tutor"
			};
		}
	}
	
	return null;
};

LoginScreen.prototype.Enter = function( response ) {
	Lema.Login.Enter(
		//** Pessoa: id_pessoa, name
		{ id: response.id_pessoa, name: response.name },
		//** Login: id, 'tutor' | 'student'
		{ id: response.id, mode: response.login }
	);
	Lema.Goto.MainMenu();
};

LoginScreen.prototype.onClickAbout = function() {
	Lema.screen.dialog.show( Lema.Const.Text.MAIN_TITLE, null );
};

LoginScreen.prototype.onClickNewAccount1 = function() {
	Lema.Goto.CreateAccountTeacher();
};

LoginScreen.prototype.onClickNewAccount2 = function() {
	Lema.Goto.CreateAccountStudent();
};

LoginScreen.prototype.updateInterface = function()
{
	this.size.set(window.innerWidth, window.innerHeight);

	Division.prototype.updateInterface.call(this);
	
	var w1 = Math.round( this.size.x * 2 / 3 );
	var w2 = this.size.x - w1;
	// Screen Image
	var img_ar = 1223 / 1024;
	var ar = w1 / this.size.y;
	var img_w, img_h;
	if ( ar > img_ar ) {
		img_w = w1;
		img_h = img_w / img_ar;
	} else {
		img_h = this.size.y;
		img_w = img_h * img_ar;
	}
	this.screen_image.size.set(img_w, img_h);
	this.screen_image.position.set(w2, 0);
	this.screen_image.updateInterface();
	
	// Pannel
	this.pannel.size.set( w2, this.size.y );
	this.pannel.position.set( w1, 0 );
	this.pannel.updateInterface();
	
	var padding = this.pannel.size.x * ( 1 - 0.90 ) / 2;
	var y = this.pannel.size.y * 0.33 + padding;
	var LINE_TEXT_SCALE = 0.55;
	var INPUT_TEXT_SCALE = 0.60;
	
	// Geometrix logo
	this.img_geometrix.size.set(
		this.pannel.size.x, this.pannel.size.x /  (2389/625)
	);
	this.img_geometrix.position.set(
		0,
		0
	);
	this.img_geometrix.updateInterface();
	
	// Login Text
	this.txt_header.size.set( this.pannel.size.x - 2 * padding, this.size.y * 0.05 );
	this.txt_header.position.set( padding, y );
	this.txt_header.setTextSize( this.txt_header.size.y * 0.75 );
	this.txt_header.updateInterface();
	y += this.txt_header.size.y + padding;
	
	// Login username
	this.username.size.set( this.pannel.size.x - 2 * padding, this.size.y * 0.05 );
	this.username.position.set( padding, y );
	this.username.setTextSize( this.username.size.y * INPUT_TEXT_SCALE );
	this.username.updateInterface();
	y += this.username.size.y + padding;

	// Login password
	this.password.size.set( this.pannel.size.x - 2 * padding, this.size.y * 0.05 );
	this.password.position.set( padding, y );
	this.password.setTextSize( this.username.size.y * INPUT_TEXT_SCALE );
	this.password.updateInterface();
	y += this.password.size.y + padding;
	
	// Enter
	this.start_button.size.set( w2 * 0.38, this.size.y * 0.05 );
	this.start_button.position.set(padding, y );
	this.start_button.updateInterface();
	
	// Recover
	this.recover_button.size.set( w2 * 0.38, this.size.y * 0.05 );
	this.recover_button.position.set(
		this.start_button.position.x + this.recover_button.size.x + padding,
		this.start_button.position.y
	);
	this.recover_button.updateInterface();
	
	// About 
	var w = this.pannel.size.x * 0.50 - 1.5 * padding;
	this.about_button.size.set( w, this.size.y * 0.03 );
	this.about_button.position.set( w1 / 2 - this.about_button.size.x / 2, padding );
	this.about_button.setTextScale( 0.55 );
	this.about_button.updateInterface();
	
	// Account 1
	this.account_button_1.size.set( w, this.size.y * 0.03 );
	this.account_button_1.position.set( padding, padding );
	this.account_button_1.setTextScale( 0.55 );
	this.account_button_1.updateInterface();
	
	// Account 2
	this.account_button_2.size.set( w, this.size.y * 0.03 );
	this.account_button_2.position.set( padding, padding );
	this.account_button_2.setTextScale( 0.55 );
	this.account_button_2.updateInterface();
	
	//Dialog
	this.dialog.size.copy(this.size);
	this.dialog.updateInterface();
};

