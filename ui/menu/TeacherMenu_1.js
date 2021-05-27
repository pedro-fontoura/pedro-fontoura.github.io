"use strict";

//** Constructor
function TeacherMenu_1( parent ) {
	console.log("TeacherMenu_1");
	TeacherMenu.call( this, parent );
	
	Lema.ClientStorage.SetItem( "goto", "TeacherMenu_1" );
	
	//** Create container items
	
	var item = Lema.CreateText( "header", this.container, "Desempenho do aluno" );
	this.items.push( item );
	
	this.SetSelectedStudentId();
	if ( this.id_aluno <= 0 ) {
		return; //** NO STUDENT SELECTED
	}
	
	this.filter = {
		status: QuerySeachString( "status", -1, true ),
		ref: QuerySeachString( "ref", -1, true ),
		activity: null,
		buttons: []
	};
		
	var lst = [
		{ id: "_status:1", label: "Status: " + Lema.Const.APP_STAT_TXT[Lema.Const.APP_STAT_SUCCESS], toggle: true, title: "Success" },
		{ id: "_status:0", label: "Status: " + Lema.Const.APP_STAT_TXT[Lema.Const.APP_STAT_FAIL], toggle: true, title: "Fail" },
		{ id: "_status:2", label: "Status: " + Lema.Const.APP_STAT_TXT[Lema.Const.APP_STAT_INIT], toggle: true, title: "Skipped" },
		{ id: "_activity", label: "", toggle: true, title: "Activity" },
		{ id: "_filter", label: "Filtrar", toggle: false, title: "Filter" },
	];
	
	this.activity_btn = null;
	
	var idx, data, btn, id;
	for ( idx = 0; idx < lst.length; ++ idx ) {
		data = lst[ idx ];
		id = data.id;
		if ( data.toggle ) {
			btn = new ToggleButton(
				this.container, id, true, this.onClickFilterButtom
			);
			this.filter.buttons.push( btn );
			btn.setColor(
				Lema.Const.Menu.Student.BTN_TOGGLE_OFF,
				Lema.Const.Menu.Student.BTN_TOGGLE_ON
			);
			if ( id == "_activity" ) {
				this.activity_btn = btn;
			} else {
				var k = id.split(":");
				if ( k[0] == "_status" ) {
					if ( k[1] == this.filter.status ) {
						btn.selected = true;
					}
				}
			}
		} else {
			btn = new Button( this.container, id );
			btn.setIcon( Lema.iconPath + "btn_start.png" );
			btn.setIconScale( Lema.Const.BTN_ICON_SCALE );
			// btn.setTextScale( Lema.Const.BTN_TEXT_SCALE );
			btn.setColor( Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER );
			btn.setOnClick( this.onClickFilterButtom.bind( btn ) );
			btn.icon.keep_aspect_ratio = false;
		}
		// btn.setIcon( Lema.iconPath + "cat_" + category.id.toLowerCase() + ".png" );
		// btn.setIconScale( Lema.Const.Menu.Student.BTN_ICON_SCALE );
		btn.setText( data.label );
		btn.text.setTextColor( Lema.Const.Menu.Student.BTN_TOGGLE_FG );
		btn.setTextScale( Lema.Const.Menu.Student.BTN_TEXT_SCALE );
		btn.userData.type = "btn";
		btn.userData.seq_length = lst.length;
		btn.userData.seq_idx = idx;
		btn.element.title = data.title;
		this.items.push( btn );
	}
	
	this.activities = [];
	this.GetStudentPerformance( this.id_aluno );
}

//** Functions Prototype
TeacherMenu_1.prototype = Object.create( TeacherMenu.prototype );

//==============================================================================

//** Update Interface
TeacherMenu_1.prototype.updateInterface = function () {
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
			item.style.marginTop = padding + "px";
		}
		
		if ( item.userData.type != "tbl" ) {
			item.updateInterface();
			if ( item.userData.type == "btn" ) { //** btn.updateInterface sets borderRadius
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
TeacherMenu_1.prototype.GetStudentPerformance = function ( id_aluno ) {
	console.log("-- GetStudentPerformance >> id_aluno:", id_aluno);

	var form_data = new FormData();
	form_data.append( "id", id_aluno );
	form_data.append( "status", this.filter.status );
	form_data.append( "ref", this.filter.ref );
	
	Lema.XHR.Send(
		"get-student-performance.php",
		form_data,
		this.GetStudentPerformance_OK.bind( this )
	);
};

TeacherMenu_1.prototype.GetStudentPerformance_OK = function ( response ) {
	console.log("GetStudentPerformance_OK:", response.length);
	
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
		row = tbl.insertRow( -1 );
		row.userData = { idx: idx };
		col = 0;
		for ( k in data ) {
			if ( k.startsWith("_") ) {
				row.userData.ref = data[ k ];
				continue;
			}
			cell = row.insertCell( col ++ );
			if ( col >= 3 ) {
				cell.style.textAlign = "center";
			}
			cell.style.padding = "5px";
			if ( k == "time" ) {
				v = Lema.MakeDateFromTimeStamp( data[ k ] );
			} else if ( k == "status" ) {
				v = data[ k ];
				if ( v == "1" ) {
					v = Lema.GetInfoMark( "success", true );
				} else {
					v = Lema.GetInfoMark( "fail", true );
				}
			} else if ( k.indexOf("_") != -1 ) {
				v = data[ k ];
				if ( v == 0 ) v = "&nbsp;";
			} else {
				v = data[ k ];
			}
			if ( k == "activity" ) {
				this.activities.push( v );
				if ( row.userData.ref == this.filter.ref ) {
					this.activity_btn.setText( v );
					this.activity_btn.selected = true;
				}
			}
			cell.innerHTML = v;
		}
		row.addEventListener( "click", this.onClickRow.bind( this ) );
	}
	
	this.items.push( tbl );
	this.container.element.appendChild( tbl );
	this.updateInterface();
};

TeacherMenu_1.prototype.MakeTableHeading = function ( table, data ) {
	var row = table.insertRow( -1 ); //** at the end
	var col = 0, cell, k;
	for ( var k in data ) {
		if ( ! k.startsWith("_") ) {
			cell = row.insertCell( col ++ );
			// cell.style.padding = "5px";
			if ( k.indexOf("_") != -1 ) {
				k = k.split("_")[1];
			}
			cell.innerHTML = k;
		}
	}
};

TeacherMenu_1.prototype.onClickRow = function ( evt ) {
	var row = Lema.GetParentNode( evt.target, "TR" );
	var selected = row.classList.toggle( "selected" );
	var activity = this.activities[ row.userData.idx ];
	console.log( row.userData.ref, activity, selected );
	if ( selected ) {
		this.filter.activity = activity;
		this.activity_btn.setText( activity );
		this.filter.ref = row.userData.ref;
	} else {
		this.filter.activity = null;
		this.filter.ref = -1;
		this.activity_btn.setText( "" );
	}
	
	this.activity_btn.selected = selected;
	// this.activity_btn.updateInterface();
	this.updateInterface();
};

TeacherMenu_1.prototype.onClickFilterButtom = function () {
	console.log("onClickFilterButtom:", this.id );
	var id = this.id.split(":");
	var filter = Lema.screen.menu.filter;
	var idx, btn, btn_id;
	if ( id[0] == "_status" ) {
		for ( idx = 0; idx < filter.buttons.length; ++ idx ) {
			btn = filter.buttons[ idx ];
			btn_id = btn.id.split(":");
			if ( btn_id[0] == "_status" ) {
				if ( btn != this ) {
					btn.selected = false;
					// btn.updateInterface();
					Lema.screen.menu.updateInterface();
				}
			}
		}
		if ( this.selected ) {
			Lema.screen.menu.filter.status = id[ 1 ];
		} else {
			Lema.screen.menu.filter.status = -1;
		}
	} else if ( id[0] == "_activity" ) {
		if ( filter.activity == null ) {
			this.selected = false;
			// this.updateInterface();
			Lema.screen.menu.updateInterface();
		}
	} else if ( id[0] == "_filter" ) {
		var url = "index.html";
		url += "?status=" + Lema.screen.menu.filter.status;
		if ( Lema.screen.menu.activity_btn.selected ) {
			url += "&ref=" + Lema.screen.menu.filter.ref;
		}
		window.location.replace( url );
	}
};

// EOF