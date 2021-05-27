"use strict";

//** Constructor
function TeacherMenu_0( parent ) {
	console.log("TeacherMenu_0");
	TeacherMenu.call( this, parent );
	
	Lema.ClientStorage.SetItem( "goto", "TeacherMenu_0" );
	
	var self = this;
	var top_bar = Lema.screen.top_bar;
		
	//** Create container items
	var item = Lema.CreateText( "header", this.container, "Alunos" );
	this.items.push( item );
	
	var txt = "Posi&ccedil;&atilde;o &raquo; Enviadas: por fazer | feitas &raquo; Nome";
	item = Lema.CreateText( "line", this.container, txt );
	this.items.push( item );
	
	this.GetStudentsList();
}

//** Functions Prototype
TeacherMenu_0.prototype = Object.create( TeacherMenu.prototype );

//==============================================================================

//** Update Interface
TeacherMenu_0.prototype.updateInterface = function () {
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
	
	//** Back button
	this.back_button.size.set( h * 4, h );
	this.back_button.position.set( p, p );
	this.back_button.updateInterface();
};

//==============================================================================

//**

TeacherMenu_0.prototype.GetStudentsList = function () {
	var form_data = new FormData();
	form_data.append( "id", Lema.Login.GetItem("id") );
	Lema.XHR.Send(
		"get-students-list.php",
		form_data,
		this.GetStudentsList_OK.bind( this )
	);
};

TeacherMenu_0.prototype.GetStudentsList_OK = function ( response ) {
	console.log("GetStudentsList_OK");
	console.log(response);
	var id_pessoa = Lema.SelectedStudent.GetItem( "id_pessoa" );
	
	this.lst_student_data = [];
	var idx, data, item, text;
	for ( idx = 0; idx < response.length; ++ idx ) {
		data = response[ idx ];
		text = (idx + 1).toString().padStart( 2, "0");
		text += " &raquo; ";
		text += data.tpc_todo + " | " + data.tpc_done;
		text += " &raquo; ";
		text += data.nome;
		item = Lema.CreateText(
			"line", this.container, text );
		this.items.push( item );
		this.lst_student_data.push( data );
		item.element.id = "student_" + idx;
		item.element.userData = {id_pessoa: data.id_pessoa };
		console.log(item.element.id, data.nome );
		item.element.style.pointerEvents = "auto";
		item.element.style.cursor = "pointer";
		item.element.style.padding = "5px";
		item.element.style.borderBottom = "solid 1px " + Lema.Colors.TOPBAR_INFO_BG;
		item.setOnClick( this.onClickStudent.bind( this ) );
		
		if ( id_pessoa == data.id_pessoa ) {
			item.element.style.background = Lema.Colors.TOPBAR_INFO_BG2;
		}
	}
	this.updateInterface();
};

TeacherMenu_0.prototype.onClickStudent = function ( evt ) {
	var id = evt.target.id.split("_");
	var idx = parseInt( id[ 1 ], 10 );
	var data = this.lst_student_data[ idx ];
	console.log( data );
	Lema.SelectedStudent.Toggle( data );
	
	var n, element, data_n;
	for ( n = 0; n < this.lst_student_data.length; ++ n ) {
		data_n = this.lst_student_data[ n ];
		element = Lema.eById( "student_" + n );
		element.style.background = "transparent";
	}
	
	var text = Lema.Login.GetItem("nome");
	if ( Lema.SelectedStudent.set ) {
		text += " &raquo; " + data.nome;
		console.log( "student_" + idx );
		element = Lema.eById( "student_" + idx );
		element.style.background = Lema.Colors.TOPBAR_INFO_BG2;
	}
	
	Lema.screen.top_bar.updateInterface();
};

// EOF