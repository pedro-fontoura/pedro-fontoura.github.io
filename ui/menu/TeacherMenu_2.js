"use strict";

//** Constructor
function TeacherMenu_2( parent ) {
	console.log("TeacherMenu_2");
	TeacherMenu.call( this, parent );
	
	Lema.ClientStorage.SetItem( "goto", "TeacherMenu_2" );
	
	//** Create container items
	
	var item = Lema.CreateText( "header", this.container, "Atividades enviadas" );
	this.items.push( item );
	
	this.SetSelectedStudentId();
	if ( this.id_aluno > 0 ) {
		this.GetStudentSequencesList( this.id_aluno );
	}
	
}

//** Functions Prototype
TeacherMenu_2.prototype = Object.create( TeacherMenu.prototype );

//==============================================================================

//** Update Interface
TeacherMenu_2.prototype.updateInterface = function () {
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

//**
TeacherMenu_2.prototype.GetStudentSequencesList = function ( id_aluno ) {
	console.log("-- GetStudentSequencesList >> id_aluno:", id_aluno);

	var form_data = new FormData();
	form_data.append( "id", id_aluno );
	
	Lema.XHR.Send(
		"get-student-sequences.php",
		form_data,
		this.GetStudentSequencesList_OK.bind( this )
	);
};

TeacherMenu_2.prototype.GetStudentSequencesList_OK = function ( response ) {
	console.log("GetStudentSequencesList_OK:", response.length);
	// console.log(response);
	
	if ( response.length == 0 ) {
		var item = Lema.CreateText(
			"line",
			this.container,
			Lema.Const.Dialog.TXT_NO_INFO
		);
		this.items.push( item );
		this.updateInterface();
		return;
	}
	
	var tbl = document.createElement("TABLE");
	tbl.classList.add("student_performance");
	tbl.userData = { type: "tbl" };
	
	this.MakeTableHeading( tbl, response[ 0 ] );
	
	var idx, data, item, date, time;
	var k, v, col, row, cell;
	for ( idx = 0; idx < response.length; ++ idx ) {
		data = response[ idx ];
		row = tbl.insertRow( -1 ); //** at the end
		row.userData = { idx: idx };
		col = 0;
		for ( k in data ) {
			if ( k.startsWith("_") ) {
				row.userData.ref = data[ k ]; //** ID
				continue;
			}
			cell = row.insertCell( col ++ );
			if ( col >= 2 ) {
				cell.style.textAlign = "center";
			}
			cell.style.padding = "5px";
			if ( k == "time_stamp" ) {
				v = Lema.MakeDateFromTimeStamp( data[ k ] );
			}
			else if ( k == "status" ) {
				v = parseInt( data[ k ], 10 );
				row.userData.is_done = ( v == 250 );
				if ( v == 255 ) { //** Not Done
					v = "&nbsp;";
				} else if ( v == 250 ) { //** Done
					v = Lema.GetInfoMark( "success", true );
				} else {
					console.warn("Unknown status:", data[ k ], v);
				}
			} else {
				v = data[ k ];
			}
			cell.innerHTML = v;
		}
		if ( row.userData.is_done ) {
			row.addEventListener( "click", this.onClickRow.bind( this ) );
			row.style.cursor = "pointer";
		}
	}
	
	this.items.push( tbl );
	this.container.element.appendChild( tbl );
	this.updateInterface();
};

TeacherMenu_2.prototype.MakeTableHeading = function ( table, data ) {
	var row = table.insertRow( -1 );
	var col = 0, cell, k;
	for ( var k in data ) {
		if ( ! k.startsWith( "_" ) ) { //** IGNORE fields starting with "_"
			cell = row.insertCell( col ++ );
			if ( k == "time_stamp" ) {
				k = "Data - Hora";
			} else if ( k == "length" ) {
				k = "Atividades";
			} else if ( k == "status" ) {
				k = "Feito";
			} else if ( k == "count_ok" ) {
				k = "Certas";
			} else if ( k == "count_nk" ) {
				k = "Erradas";
			}
			cell.innerHTML = k;
		}
	}
};

TeacherMenu_2.prototype.onClickRow = function ( evt ) {
	var row = Lema.GetParentNode( evt.target, "TR" );
	// console.log( row.userData.ref, row.userData.is_done );
	if ( row.userData.is_done ) {
		var url = "show-sequence-details.php?id=" + row.userData.ref;
		if ( Lema.XHR.onLocalhost ) {
			url = "./xhr/" + url;
		} else {
			url = Lema.XHR.DEFAULT_SERVER + "/xhr/" + url;
		}
		window.open( url );
		
	}
};

// EOF