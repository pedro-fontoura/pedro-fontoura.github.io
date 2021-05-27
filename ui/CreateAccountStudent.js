"use strict";

//screen constructor
function CreateAccountStudent(parent)
{
	Division.call(this, parent);
	
	Lema.ClientStorage.SetItem("goto", "CreateAccountStudent");
	
	this.setColor( "#d6f7f9" );

	// Main Image
	this.screen_image = new LemaImage(this);
	this.screen_image.setImage(Lema.imagePath + "screen_account.png");
	
	// Pannel
	this.pannel = new Division( this.element );
	this.pannel.setColor( "#ebfbfb" );
	this.pannel.element.style.overflow = "auto";
	
	Lema.SetTextProperties(
		"header",
		{ color: Lema.Colors.TOPBAR_BG, alignment: Text.LEFT, weight: "bold" }
	);
	
	Lema.SetTextProperties(
		"line",
		{ color: "#666", alignment: Text.LEFT, weight: "normal" }
	);
	
	// Pannel :: Title
	this.txt_header = Lema.CreateText( "header", this.pannel.element, "Criar conta de aluno" );
	
	// Pannel :: Name
	this.txt_name = Lema.CreateText( "line", this.pannel.element, "Nome" );
	this.input_name = new LemaInputField( this.pannel.element, "text", "name", "Nome" );
	
	// Pannel :: Sex
	this.txt_sex = Lema.CreateText( "line", this.pannel.element, "Sexo" );
	this.input_sex = new LemaInputField(
		this.pannel.element, "select", "sex", "Sexo", {options: ["Feminino", "Masculino"]}
	);
	
	// Pannel :: Date of Birth
	this.txt_dob = Lema.CreateText( "line", this.pannel.element, "Nascimento" );
	this.input_dob_d = new LemaInputField(
		this.pannel.element, "number", "dob_d", "D", {min: 1, max: 31, value: ""}
	);
	this.input_dob_m = new LemaInputField(
		this.pannel.element, "number", "dob_m", "M", {min: 1, max: 12, value: ""}
	);
	var year = new Date().getFullYear();
	this.input_dob_y = new LemaInputField(
		this.pannel.element, "number", "dob_y", "A", {min: year - 100, max: year, value: year - 6}
	);
	
	// Pannel :: Concelho
	this.txt_concelho = Lema.CreateText( "line", this.pannel.element, "Concelho" );
	this.input_concelho = new LemaInputField( this.pannel.element, "text", "concelho", "Concelho" );
	
	// Pannel :: Distrito
	this.txt_distrito = Lema.CreateText( "line", this.pannel.element, "Distrito" );
	this.input_distrito = new LemaInputField( this.pannel.element, "text", "distrito", "Distrito" );
	
	// Pannel :: Escola
	this.txt_escola = Lema.CreateText( "line", this.pannel.element, "Escola" );
	this.input_escola = new LemaInputField( this.pannel.element, "text", "escola", "Escola" );
	
	// Pannel :: E-Mail
	this.txt_email = Lema.CreateText( "line", this.pannel.element, "E-Mail" );
	this.input_email = new LemaInputField( this.pannel.element, "email", "email", "E-Mail do aluno" );
	
	// Pannel :: Senha
	this.txt_senha = Lema.CreateText( "line", this.pannel.element, "Senha" );
	this.input_senha = new LemaInputField( this.pannel.element, "password", "senha", "Senha do aluno" );
	
	// Pannel :: Tutor
	this.txt_tutor = Lema.CreateText( "line", this.pannel.element, "Tutor" );
	this.input_teacher = new LemaInputField( this.pannel.element, "email", "tutor", "E-Mail do tutor" );
	
	// Pannel :: Escolaridade
	this.txt_school = Lema.CreateText( "line", this.pannel.element, "Escolaridade" );
	this.input_school = new LemaInputField(
		this.pannel.element, "number", "school", "Ano", {min: 1, max: 6, value: ""}
	);
	
	// Pannel :: Start
	this.start_button = new TextButton(this, "create");
	this.start_button.setPositioningMode(Division.TOP_RIGHT);
	this.start_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.start_button.setText("Criar");
	this.start_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.start_button.setOnClick( this.onClickCreate.bind( this ) );
	this.start_button.setClickable(true);
	
	// Pannel :: About
	this.about_button = new TextButton(this.element, "about");
	this.about_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.about_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.about_button.setText("Sobre o " + Lema.name);
	this.about_button.setColor(Lema.Colors.TOPBAR_INFO_BG, "white" );
	this.about_button.text.setTextColor( "#000" );
	this.about_button.setOnClick( Lema.Goto.AboutScreen );
	this.about_button.setClickable(true);
	
	// Pannel :: Goto Login
	this.login_button = new TextButton(this.pannel.element, "back");
	this.login_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.login_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.login_button.setText("Voltar");
	this.login_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.login_button.setOnClick( Lema.Goto.LoginScreen );
	this.login_button.setClickable(true);
	
	// Dialog box
	this.dialog = new Dialog(this);
	
	// Fields
	this.lst_fields = [
		["name", "Nome"],
		["sex", "Sexo"],
		["dob_d", "Nascimento / Dia"],
		["dob_m", "Nascimento / M&ecirc;s"],
		["dob_y", "Nascimento / Ano"],
		["concelho", "Concelho"],
		["distrito", "Distrito"],
		["escola", "Escola"],
		["email", "E-Mail"],
		["senha", "Senha"],
		["tutor", "tutor"],
		["school", "Escolaridade"]
	];

	// Window title
	window.document.title = Lema.NAME + " - " + "CreateAccountStudent";
}

//Functions Prototype
CreateAccountStudent.prototype = Object.create(Division.prototype);

//Update interface elements
CreateAccountStudent.prototype.onClickCreate = function() {
	var message = null;
	
	var idx, field;
	for ( idx = 0; idx < this.lst_fields.length; ++ idx ) {
		field = Lema.eById( "input_" + this.lst_fields[ idx ][ 0 ] );
		if ( field.value.length == 0 ) {
			message = Lema.Const.Dialog.TXT_INPUT_FIELD + this.lst_fields[ idx ][ 1 ] + ".";
			Lema.onInputError( field, message );
			break;
		}
	}
	
	if ( message == null ) {
		this.SubmitFormInfo();
	}
};

CreateAccountStudent.prototype.SubmitFormInfo = function() {
	//** Collect field values
	Lema.HorizontalRuler();
	var form_data = new FormData();
	var idx, id, field;
	for ( idx = 0; idx < this.lst_fields.length; ++ idx ) {
		id = this.lst_fields[ idx ][ 0 ];
		field = Lema.eById( "input_" + id );
		form_data.append( id, field.value );
		console.log( id, field.value );
	}
	Lema.HorizontalRuler();
	
	//** Send XML HTTP Request
	Lema.screen.dialog.showWithoutButtons( Lema.Const.Dialog.TXT_SEND_REQUEST );
	Lema.XHR.Send(
		"create-account-student.php",
		form_data,
		this.SubmitFormInfo_OK.bind( this )
	);
};

CreateAccountStudent.prototype.SubmitFormInfo_OK = function( response ) {
	console.log( response );
	if ( Lema.XHR.json ) {
		if ( response.status == "ok" ) {
			Lema.screen.dialog.SetMode( 1 );
			Lema.screen.dialog.show( "Conta criada:<br>" + response.email, Lema.Goto.LoginScreen, false );
		} else {
			Lema.screen.dialog.SetMode( 0 );
			Lema.screen.dialog.show( "Aten&ccedil;&atilde;o:<br>" + response.message, Lema.NullFunction, false );
		}
	} else {
		Lema.screen.dialog.hide();
	}
};

CreateAccountStudent.prototype.onClickAbout = function() {
	Lema.screen.dialog.show( Lema.Const.Text.MAIN_TITLE, null );
};

CreateAccountStudent.prototype.updateInterface = function()
{
	this.size.set(window.innerWidth, window.innerHeight);

	Division.prototype.updateInterface.call(this);
	
	var w1 = Math.round( this.size.x * 0.5 );
	
	// Screen Image
	var w2 = Math.min( w1, this.size.y ) * ( 1 - 0.05 * 2 );
	this.screen_image.size.set(w2, w2);
	this.screen_image.position.set((w1 - w2) / 2 , (this.size.y - w2) / 2 );
	this.screen_image.updateInterface();
	
	// Pannel
	this.pannel.size.set( this.size.x - w1, this.size.y );
	this.pannel.position.set( w1, 0 );
	this.pannel.updateInterface();
	
	var padding = this.pannel.size.x * ( 1 - 0.90 ) / 2;
	var y_spacing = padding * 0.40;
	var y = padding;
	var label_width = ( this.pannel.size.x - 2 * padding ) * 0.25;
	var input_text_width = ( this.pannel.size.x - 2 * padding ) * 0.70;
	var height_1 = this.size.y * 0.05;
	var LINE_TEXT_SCALE = 0.55;
	var INPUT_TEXT_SCALE = 0.60;
	
	// Header
	this.txt_header.size.set( this.pannel.size.x - 2 * padding, height_1 );
	this.txt_header.position.set( padding, y );
	this.txt_header.setTextSize( this.txt_header.size.y * 0.75 );
	this.txt_header.updateInterface();
	y += this.txt_header.size.y + padding;
	
	// Name
	this.txt_name.size.set( label_width, height_1 );
	this.txt_name.position.set( padding, y );
	this.txt_name.setTextSize( this.txt_name.size.y * LINE_TEXT_SCALE);
	this.txt_name.updateInterface();
	
	this.input_name.size.set( input_text_width, height_1 );
	this.input_name.position.set( this.txt_name.position.x + this.txt_name.size.x + padding, this.txt_name.position.y );
	this.input_name.setTextSize( this.input_name.size.y * INPUT_TEXT_SCALE );
	this.input_name.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// Sex
	this.txt_sex.size.set( label_width, height_1 );
	this.txt_sex.position.set( padding, y );
	this.txt_sex.setTextSize( this.txt_sex.size.y *LINE_TEXT_SCALE );
	this.txt_sex.updateInterface();
	
	this.input_sex.size.set( input_text_width, height_1 );
	this.input_sex.position.set( this.txt_sex.position.x + this.txt_sex.size.x + padding, this.txt_sex.position.y );
	this.input_sex.setTextSize( this.input_sex.size.y * INPUT_TEXT_SCALE );
	this.input_sex.updateInterface();
	y += this.input_sex.size.y + y_spacing;
	
	// Date of birth
	this.txt_dob.size.set( label_width, height_1 );
	this.txt_dob.position.set( padding, y );
	this.txt_dob.setTextSize( this.txt_dob.size.y *LINE_TEXT_SCALE );
	this.txt_dob.updateInterface();
	
	this.input_dob_d.size.set( input_text_width / 4, height_1 );
	this.input_dob_d.position.set( this.txt_dob.position.x + this.txt_dob.size.x + padding, this.txt_dob.position.y );
	this.input_dob_d.setTextSize( this.input_dob_d.size.y * INPUT_TEXT_SCALE );
	this.input_dob_d.updateInterface();
	
	this.input_dob_m.size.set( input_text_width / 4, height_1 );
	this.input_dob_m.position.set( this.input_dob_d.position.x + this.input_dob_d.size.x + 0, this.txt_dob.position.y );
	this.input_dob_m.setTextSize( this.input_dob_m.size.y * INPUT_TEXT_SCALE );
	this.input_dob_m.updateInterface();
	
	this.input_dob_y.size.set( input_text_width / 2, height_1 );
	this.input_dob_y.position.set( this.input_dob_m.position.x + this.input_dob_m.size.x + 0, this.txt_dob.position.y );
	this.input_dob_y.setTextSize( this.input_dob_d.size.y * INPUT_TEXT_SCALE );
	this.input_dob_y.updateInterface();
	
	y += this.input_name.size.y + y_spacing;
	
	// Concelho
	this.txt_concelho.size.set( label_width, height_1 );
	this.txt_concelho.position.set( padding, y );
	this.txt_concelho.setTextSize( this.txt_name.size.y * LINE_TEXT_SCALE );
	this.txt_concelho.updateInterface();
	
	this.input_concelho.size.set( input_text_width, height_1 );
	this.input_concelho.position.set( this.txt_concelho.position.x + this.txt_concelho.size.x + padding, this.txt_concelho.position.y );
	this.input_concelho.setTextSize( this.input_concelho.size.y * INPUT_TEXT_SCALE );
	this.input_concelho.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// Distrito
	this.txt_distrito.size.set( label_width, height_1 );
	this.txt_distrito.position.set( padding, y );
	this.txt_distrito.setTextSize( this.txt_distrito.size.y * LINE_TEXT_SCALE );
	this.txt_distrito.updateInterface();
	
	this.input_distrito.size.set( input_text_width, height_1 );
	this.input_distrito.position.set( this.txt_concelho.position.x + this.txt_concelho.size.x + padding, this.txt_distrito.position.y );
	this.input_distrito.setTextSize( this.input_distrito.size.y * INPUT_TEXT_SCALE );
	this.input_distrito.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// Escola
	this.txt_escola.size.set( label_width, height_1 );
	this.txt_escola.position.set( padding, y );
	this.txt_escola.setTextSize( this.txt_escola.size.y * LINE_TEXT_SCALE );
	this.txt_escola.updateInterface();
	
	this.input_escola.size.set( input_text_width, height_1 );
	this.input_escola.position.set( this.txt_escola.position.x + this.txt_escola.size.x + padding, this.txt_escola.position.y );
	this.input_escola.setTextSize( this.input_escola.size.y * INPUT_TEXT_SCALE );
	this.input_escola.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// E-Mail
	this.txt_email.size.set( label_width, height_1 );
	this.txt_email.position.set( padding, y );
	this.txt_email.setTextSize( this.txt_email.size.y * LINE_TEXT_SCALE );
	this.txt_email.updateInterface();
	
	this.input_email.size.set( input_text_width, height_1 );
	this.input_email.position.set( this.txt_email.position.x + this.txt_email.size.x + padding, this.txt_email.position.y );
	this.input_email.setTextSize( this.input_email.size.y * INPUT_TEXT_SCALE );
	this.input_email.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// Senha
	this.txt_senha.size.set( label_width, height_1 );
	this.txt_senha.position.set( padding, y );
	this.txt_senha.setTextSize( this.txt_senha.size.y * LINE_TEXT_SCALE );
	this.txt_senha.updateInterface();
	
	this.input_senha.size.set( input_text_width, height_1 );
	this.input_senha.position.set( this.txt_senha.position.x + this.txt_senha.size.x + padding, this.txt_senha.position.y );
	this.input_senha.setTextSize( this.input_senha.size.y * INPUT_TEXT_SCALE );
	this.input_senha.updateInterface();
	y += this.input_name.size.y + y_spacing;
	
	// Teacher
	this.txt_tutor.size.set( label_width, height_1 );
	this.txt_tutor.position.set( padding, y );
	this.txt_tutor.setTextSize( this.txt_tutor.size.y * LINE_TEXT_SCALE );
	this.txt_tutor.updateInterface();
	
	this.input_teacher.size.set( input_text_width, height_1 );
	this.input_teacher.position.set( this.txt_tutor.position.x + this.txt_tutor.size.x + padding, this.txt_tutor.position.y );
	this.input_teacher.setTextSize( this.input_teacher.size.y * INPUT_TEXT_SCALE );
	this.input_teacher.updateInterface();
	y += this.input_teacher.size.y + y_spacing;
	
	// School
	this.txt_school.size.set( label_width, height_1 );
	this.txt_school.position.set( padding, y );
	this.txt_school.setTextSize( this.txt_school.size.y * LINE_TEXT_SCALE );
	this.txt_school.updateInterface();
	
	this.input_school.size.set( input_text_width / 4, height_1 );
	this.input_school.position.set( this.txt_school.position.x + this.txt_school.size.x + padding, this.txt_school.position.y );
	this.input_school.setTextSize( this.input_school.size.y * INPUT_TEXT_SCALE );
	this.input_school.updateInterface();
	// y += this.input_school.size.y + y_spacing;
	
	//Start
	this.start_button.size.set( w2 * 0.25, this.size.y * 0.05 );
	this.start_button.position.set(padding, y );
	this.start_button.updateInterface();
	
	// About 
	var w = this.pannel.size.x * 0.50 - 1.5 * padding;
	this.about_button.size.set( w, this.size.y * 0.03 );
	this.about_button.position.set( w1 / 2 - this.about_button.size.x / 2, padding );
	this.about_button.setTextScale( 0.55 );
	this.about_button.updateInterface();
	
	// Account
	this.login_button.size.set( w, this.size.y * 0.03 );
	this.login_button.setTextScale( 0.66 );
	this.login_button.position.set( padding, padding );
	this.login_button.updateInterface();
	
	//Dialog
	this.dialog.size.copy(this.size);
	this.dialog.updateInterface();
};
