"use strict";

/*
include( "libs/nunu.min_201702040109.js" );
//include( "libs/nunu.min_201704231328.js" );

include( "data/style/style.css" );

include( "ui/elements/Division.js" );
include( "ui/elements/LemaImage.js" );
include( "ui/elements/Text.js" );
include( "ui/elements/Button.js" );
include( "ui/elements/ButtonIcon.js" );
include( "ui/elements/TextButton.js" );
include( "ui/elements/ToggleButton.js" );
include( "ui/elements/Canvas.js" );

include( "ui/menu/SettingsMenu.js" );
include( "ui/menu/MainMenu.js" );
include( "ui/menu/AboutMenu.js" );
include( "ui/menu/ActivityMenu.js" );
include( "ui/menu/CategorySelectionMenu.js" );
include( "ui/menu/ManualSelectionMenu.js" );
include( "ui/menu/DevelopmentMenu.js" );

include( "ui/TopBar.js" );
include( "ui/Dialog.js" );
include( "ui/Feedback.js" );
include( "ui/ActivityScreen.js" );
include( "ui/MultipleActivityScreen.js" );
include( "ui/FirstLaunch.js" );
include( "ui/LoginScreen.js" );
include( "ui/Menu.js" );

include( "core/Activity.js" );
include( "core/Preferences.js" );
*/

console.assert( Lema == undefined || typeof Lema == "function" );
function Lema(){};

//Hardware flags
Lema.touchscreen = false;
Lema.cordova = false;

//Runtime variables
Lema.dialog = null;
Lema.screen = null;
Lema.gotoMultipleActivityScreen = false; // see: MultipleActivityScreen.html

Lema.SoundManager = null;
Lema.app_level = NaN;
Lema.app_level_idx = NaN;
Lema.app_lst_levels = null;

Lema.Sound = {
	load_all: {
		idx: undefined,
		callback: null,
		cnt: 0
	},
	lst_buttons: [],
	lst_dialogues: [],
	lst_numbers: [],
	verbose: false,
	play_button: null,
	lst_registered: []
};
Lema.Sound.LoadAll = function ( callback ) {
	console.log("Lema.Sound.LoadAll >>", "BEGIN");
	Lema.Sound.load_all.callback = callback;
	Lema.Sound.load_all.idx = 0;
	Lema.LoadAll_Item();
};

//** Load all registered: Buttons, Dialogues, Numbers
Lema.LoadAll_Item = function () {
	var lst = null, path = null;
	switch ( Lema.Sound.load_all.idx ) {
		case 0 :
			lst = Lema.Sound.lst_buttons;
			path = "buttons";
			break;
		case 1 :
			lst = Lema.Sound.lst_dialogues;
			path = "dialogues";
			break;
		case 2 :
			lst = Lema.Sound.lst_numbers;
			path = "numbers";
			break;
	}
	if ( lst != null && path != null ) {
		console.log("Lema.LoadAll_Item >>", Lema.Sound.load_all.idx, ":", path, "files:", lst.length);
		Lema.Sound.load_all.idx += 1;
		Lema.Sound.load_all.cnt += lst.length;
		Lema.Sound.LoadListFromPath(
			lst,
			Lema.audioPath + path + "/",
			Lema.LoadAll_Item
		);
	} else {
		console.log("Lema.LoadAll >>", "END", "files:", Lema.Sound.load_all.cnt);
		if ( typeof Lema.Sound.load_all.callback == "function" ) {
			Lema.Sound.load_all.callback();
		}
	}
};

Lema.Sound.PlayButton = function ( id ) {
	if ( ! Lema.SoundManager ) {
		return; //** no sound manager, abort
	}
	if ( id.startsWith("_") ) {
		return; //** ignore these ones
	}
	if ( Lema.Sound.playing == id ) {
		return; //** already playing, let it finish
	}
	if ( SoundManager.IsPlaying() ) {
		SoundManager.StopAll(); //** no overlapping sounds
	}
	
	Lema.Sound.playing = id;
	
	if ( isNaN(id) ) {
		id = "btn_" + id;
	} else {
		id = "nr_" + id;
	}
	Lema.SoundManager.Play( id, Lema.Sound.onEndPlayButton );
	
};
Lema.Sound.onEndPlayButton = function ( label, target ) {
	Lema.Sound.playing = null;
};

Lema.Sound.RegisterButton = function ( id ) {
	if ( id.startsWith("_") ) {
		return false;
	}
	
	if ( isFinite( id ) ) {
		return Lema.Sound.RegisterNumber( id );
	}
	
	console.info("Lema.Sound.RegisterButton:", id );
	id = "btn_" + id;
	
	//** Already registered?
	if ( Lema.Sound.lst_registered.indexOf( id ) == -1 ) {
		var src = id + ".mp3";
		Lema.Sound.lst_buttons.push( [ id, src ] );
		Lema.Sound.lst_registered.push( id );
	}
	
	return true;
};

Lema.Sound.RegisterDialogue = function ( id ) {
	console.info("Lema.Sound.RegisterDialogue:", id );
	if ( id.startsWith("_") ) {
		return false;
	}
	
	id = "dlg_" + id;
	
	//** Already registered?
	if ( Lema.Sound.lst_registered.indexOf( id ) == -1 ) {
		var src = id + ".mp3";
		Lema.Sound.lst_dialogues.push( [ id, src ] );
		Lema.Sound.lst_registered.push( id );
	}
	
	return true;
};

Lema.Sound.RegisterNumber = function ( id, load_now ) {
	console.info("Lema.Sound.RegisterNumber:", id );
	id = String( id );
	if ( id.startsWith("_") ) {
		return false;
	}
	id = "nr_" + id;
	var src = id + ".mp3";
	
	if ( load_now ) {
		return SoundManager.LoadAndDecodeFile( //** label, url, callback
			id, Lema.audioPath + "numbers/" + src
		);
	}
	
	//** Already registered?
	if ( Lema.Sound.lst_registered.indexOf( id ) == -1 ) {
		Lema.Sound.lst_numbers.push( [ id, src ] );
		Lema.Sound.lst_registered.push( id );
	}	
	return true;
};

Lema.Sound.LoadListFromPath = function ( list, path, callback ) {
	console.info( "Lema.Sound.LoadListFromPath >> LOAD", list.length, "files from", path );
	if ( list.length == 0 ) {
		if ( typeof callback == "function" ) {
			callback();
		}
		return;
	}
	if ( ! Lema.SoundManager ) {
		Lema.SoundManager = SoundManager;
		Lema.SoundManager.Initialize( { verbose: Lema.Sound.verbose } );
	}
	Lema.SoundManager.LoadAndDecodeList( 
		list,
		path,
		function () {
			console.info( 
				"Lema.Sound.LoadListFromPath >> LOADED",
				list.length,
				"files"
			);
			if ( typeof callback == "function" ) {
				callback();
			}
		}
	 );
};

//== TODO: move to Lema.Sound

Lema.Sound.lst_feedback_sounds = [
	["on_success_1", "feedback_boa_ganhaste.mp3"],
	["on_success_2", "feedback_bravo.mp3"],
	["on_success_3", "feedback_boa.mp3"],
	["on_fail_1", "feedback_naoestabem_tentadenovo.mp3"],
	["on_fail_2", "feedback_naoestabem_tentaoutravez.mp3"],
	["on_fail_3", "feedback_naoestacerto.mp3"],
	["on_congrats", "feedback_parabens.mp3"]
];

Lema.Sound.LoadFeedbackSounds = function ( callback ) {
	console.info(
		"Lema.Sound.LoadFeedbackSounds:",
		Lema.Sound.lst_feedback_sounds.length,
		"files from",
		Lema.audioPath
	);
	
	if ( ! Lema.SoundManager ) {
		Lema.SoundManager = SoundManager;
		Lema.SoundManager.Initialize( { verbose: Lema.Sound.verbose } );
	}
	
	if ( Lema.SoundManager.loading ) {
		console.warn("LoadFeedbackSounds:", "SoundManager is busy! Retry...");
		var fn = function () {
			Lema.Sound.LoadFeedbackSounds( callback );
		};
		setTimeout( fn, 1E3 / 6 );
	} else {
		Lema.SoundManager.LoadAndDecodeList( 
			Lema.Sound.lst_feedback_sounds,
			Lema.audioPath + "feedback/",
			function () {
				console.info( 
					"Lema.SoundManager: loaded",
					Lema.Sound.lst_feedback_sounds.length,
					"files"
				);
				if ( typeof callback == "function" ) {
					callback();
				}
			}
		);
	}
};
	
// Debug aid
Lema.HorizontalRuler = function() {
	console.log( "============================================================" );
};

//Initialize lema
Lema.initialize = function() {
	console.log( Lema.NAME, "V" + Lema.VERSION, "TimeStamp", Lema.TIMESTAMP );
	console.assert( storageAvailable( "localStorage" ) );
	
	var idx;

	//Disable html body scroll
	document.body.style.overflow = "hidden";

	//Update hardware flags
	Lema.updateHardwareFlags();

	//Create lema dialog
	Lema.dialog = new Dialog();
	Lema.dialog.setTextScale( 0.08 );
	Lema.dialog.text.setMultiLine( true );
	
	var logout = Lema.ClientStorage.GetItem( "logout", 0 );
	if ( logout != 0 ) {
		Lema.Goto.LoginScreen();
		return;
	}
	
	Lema.User.SetRole();
	if ( Lema.User.is_tutor ) {
		Lema.SelectedStudent.Init();
	}
	// Lema.User.is_student = true; //** test sounds
	
	Activity.LoadCategoriesAndSubacategories();
	
	Activity.LoadActivitiesList();
	
	if ( Lema.gotoMultipleActivityScreen ) {
		Lema.setScreen( MultipleActivityScreen );
		Lema.Login.KeepAlive();
	} else {
		
		Lema.libLEMA.SaveToCache();
		
		var go_to = Lema.ClientStorage.GetItem( "goto" );
		if ( go_to == null ) {
			go_to = "LoginScreen";
		}
		
		var lst = [
			"AboutScreen",
			"LoginScreen",
			"CreateAccountTeacher",
			"CreateAccountStudent",
			"MustRead"
		];
		if ( lst.indexOf( go_to ) == -1 ) {
			//** these sections/pages require a valid login
			if ( ! Lema.Login.ValidateTime() ) {
				console.warn("Failed >> Lema.Login.ValidateTime:", go_to);
				go_to = "LoginScreen";
			} else {
				Lema.Login.KeepAlive();
			}
		}
		
		if ( Lema.ClientStorage.GetItem( "login_mustread", 0 ) == 0 ) {
			go_to = "MustRead";
		}
		
		console.log( ">> GOTO:", go_to );
		
		//** Create main menu instance
		Lema.setScreen( Menu );
		if ( go_to == "ManualSelectionMenu" ) {
			Lema.screen.changeMenu( ManualSelectionMenu );
		} else if ( go_to == "ListSelectionMenu" ) {
			Lema.screen.changeMenu( ListSelectionMenu );
		} else if ( go_to == "StudentMenu" ) {
			Lema.screen.changeMenu( StudentMenu );
		} else if ( go_to == "TeacherMenu_0" ) {
			Lema.screen.changeMenu( TeacherMenu_0 );
		} else if ( go_to == "TeacherMenu_1" ) {
			Lema.screen.changeMenu( TeacherMenu_1 );
		} else if ( go_to == "TeacherMenu_2" ) {
			Lema.screen.changeMenu( TeacherMenu_2 );
		} else if ( go_to == "TeacherMenu_3" ) {
			Lema.screen.changeMenu( TeacherMenu_3 );
		} else if ( go_to == "TeacherMenu_4" ) {
			Lema.screen.changeMenu( TeacherMenu_4 );
		} else if ( go_to == "LoginScreen" ) {
			Lema.setScreen( LoginScreen );
		} else if ( go_to == "CreateAccountTeacher" ) {
			Lema.setScreen( CreateAccountTeacher );
		} else if ( go_to == "CreateAccountStudent" ) {
			Lema.setScreen( CreateAccountStudent );
		} else if ( go_to == "AboutScreen" ) {
			Lema.setScreen( AboutScreen );
		} else if ( go_to == "MustRead" ) {
			Lema.setScreen( MustRead );
		}
		else { // MainMenu
			if ( Lema.Login.GetItem( "role" ) == "student" ) {
				Lema.screen.changeMenu( StudentMenu );
			}
		}
	}
	
	Lema.Sound.LoadAll();
	
	// Add main event listeners
	window.addEventListener( "resize", Lema.onWindowResize );
}

// =============================================================================
// Lema.CIentStorage

//** Reference: MDN
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable( type ) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem( x, x );
		storage.removeItem( x );
		return true;
	}
	catch( e ) {
		return false;
	}
}

Lema.ClientStorage = {
};

Lema.ClientStorage.GetItem = function ( key, set_if_null ) {
	var value = localStorage.getItem( key );
	if ( value == null && set_if_null != undefined ) {
		value = set_if_null;
	} else if ( typeof set_if_null == "number" ) {
		value = parseInt( value, 10 );
	}
	return value;
};

Lema.ClientStorage.SetItem = function ( key, value ) {
	localStorage.setItem( key, value );
};

Lema.ClientStorage.RemoveItem = function ( key ) {
	localStorage.removeItem( key );
};

Lema.ClientStorage.Clear = function () {
	localStorage.clear();
};

// =============================================================================

Lema.Goto = {};

Lema.Goto.Back = function () {
	var go_to = Lema.ClientStorage.GetItem( "backto" );
	Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
	Lema.ClientStorage.SetItem( "goto", go_to );
	Lema.Goto.URL( "index.html" );
};

Lema.Goto.URL = function ( url ) {
	window.parent.location.replace( url );
};

Lema.Goto.Menu = function ( id ) {
	if ( typeof id == "string" ) {
		Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
		Lema.ClientStorage.SetItem( "goto", id );
		Lema.Goto.URL( "index.html" );
	} else if ( typeof id == "function" ) {
		Lema.screen.changeMenu( id );
	}
};

Lema.Goto.MainMenu = function () {
	Lema.Goto.Menu( "MainMenu" );
};
Lema.Goto.UserMenu = function ( evt ) {
	if ( typeof evt == "object" && evt.ctrlKey ) {
		Lema.Goto.Menu( "StudentMenu" );
	} else {
		var tab_idx = Lema.User.GetSelectedTabIdx();
		Lema.Goto.Menu( "TeacherMenu_" + tab_idx );
	}
};

Lema.Goto.ManualSelectionMenu = function () {
	Lema.Goto.Menu( ManualSelectionMenu );
	window.location.reload();
};

Lema.Goto.ListSelectionMenu  = function () {
	Lema.Goto.Menu( ListSelectionMenu  );
};

Lema.Goto.SettingsMenu = function () {
	Lema.Goto.Menu( SettingsMenu );
};

Lema.Goto.AboutMenu = function () {
	Lema.Goto.Menu( AboutMenu );
};

Lema.Goto.AboutScreen = function () {
	Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
	Lema.ClientStorage.SetItem( "goto", "AboutScreen" );
	Lema.Goto.URL( "index.html" );
};

Lema.Goto.LoginScreen = function () {
	Lema.ClientStorage.RemoveItem( "logout" );
	Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
	Lema.ClientStorage.SetItem( "goto", "LoginScreen" );
	Lema.Goto.URL( "index.html" );
};

Lema.Goto.CreateAccountTeacher = function () {
	Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
	Lema.ClientStorage.SetItem( "goto", "CreateAccountTeacher" );
	Lema.Goto.URL( "index.html" );
};

Lema.Goto.CreateAccountStudent = function () {
	Lema.ClientStorage.SetItem( "backto", Lema.ClientStorage.GetItem( "goto" ) );
	Lema.ClientStorage.SetItem( "goto", "CreateAccountStudent" );
	Lema.Goto.URL( "index.html" );
};

Lema.Goto.MultipleActivityScreen = function () {
	Activity.Selection.SetCurrentIdx( 0 );
	Activity.Selection.SetCacheIdx( 1 ); //** Initiate sequence cache at idx == 1
	// window.location = "MultipleActivityScreen-frame.html";
	window.location = "MultipleActivityScreen.html";
};

Lema.Goto.MultipleActivityScreenDialog = function () {
	console.log( "MultipleActivityScreenDialog" );
	var count_nr = Activity.Selection.GetCountNr();
	if ( count_nr === 0 ) {
		// there are no activities
		var msg = ( 
			Lema.ClientStorage.GetItem( "goto" ) == "StudentMenu"
			? Lema.Const.Dialog.TXT_UNAVAILABLE_ACTIVITIES
			: Lema.Const.Dialog.TXT_NO_ACTIVITIES
		 );
		Lema.screen.dialog.show( msg, null, false );
	} else {
		// show GOOD LUCK dialog
		// ... and start selected activities sequence
		var msg = "Vais realizar " + count_nr + " desafio";
		if ( count_nr > 1 ) {
			msg += "s";
		}
		msg += ".\nBoa sorte!";
		Lema.screen.dialog.show( msg, Lema.Goto.MultipleActivityScreen, false );
		if ( Lema.User.is_student ) {
			SoundManager.PlaySequence(
				[
					"dlg_sequence_start",
					"nr_" + count_nr,
					"dlg_sequence_end",
					"dlg_good_luck"
				]
			);
		}
	}
};

// =============================================================================

Lema.text_properties = {
	header: {
		size: 20,
		color: "black",
		alignment: Text.LEFT,
		type: "text_heading",
		weight: "bold"
	},
	line: {
		size: 18,
		color: "black",
		alignment: Text.LEFT,
		type: "text_line",
		weight: "normal"
	}
};

Lema.SetTextProperties = function ( group_key, properties ) {
	var group = Lema.text_properties[ group_key ];
	for ( var pk in properties ) {
		group[ pk ] = properties[ pk ];
	}
};

Lema.CreateText = function ( group_key, parent, txt, id ) {
	var text_properties = Lema.text_properties[ group_key ];
	var item = new Text( parent );
	item.setText( txt );
	item.setTextSize( text_properties.size );
	item.setTextColor( text_properties.color );
	item.setAlignment( text_properties.alignment );
	item.userData.type = text_properties.type;
	item.element.style.fontWeight = text_properties.weight;
	if ( id != undefined ) {
		item.element.id = id;
	}
	return item;
};

// =============================================================================

Lema.User = {
	role: null,
	is_tutor: false,
	is_student: false
};

Lema.User.SetRole = function () {
	Lema.User.role = Lema.ClientStorage.GetItem( "login_role" );
	Lema.User.is_tutor = ( Lema.User.role == "tutor" );
	Lema.User.is_student = ( Lema.User.role == "student" );
	return Lema.User.role;
};

Lema.User.SetSelectedTabIdx = function ( idx ) {
	Lema.ClientStorage.SetItem( "user_tab_idx", idx );
};
Lema.User.GetSelectedTabIdx = function () {
	return Lema.ClientStorage.GetItem( "user_tab_idx", 0 );
};

Lema.User.SetSequenceId = function ( id ) {
	Lema.ClientStorage.SetItem( "user_sequence", String(id) );
};
Lema.User.GetSequenceId = function () {
	return Lema.ClientStorage.GetItem( "user_sequence", 0 );
};

// =============================================================================

Lema.SelectedStudent = {
	fields: [ "student_id_pessoa", "student_id_aluno", "student_nome" ],
	set: false
};

Lema.SelectedStudent.Init = function () {
	var n = Lema.SelectedStudent.GetItem( "id_pessoa" );
	console.log("Lema.SelectedStudent.Init", n);
	Lema.SelectedStudent.set = ( parseInt( n, 10 ) > 0 );
};

Lema.SelectedStudent.Toggle = function ( data ) {
	var clear = false;
	if ( Lema.SelectedStudent.set ) {
		var id_pessoa = Lema.ClientStorage.GetItem( "student_id_pessoa" );
		clear = ( id_pessoa == data.id_pessoa );
	} 
	console.log( "Lema.SelectedStudent.Toggle >> clear:", clear );
	
	if ( clear ) {
		Lema.SelectedStudent.Clear();
	} else {
		Lema.SelectedStudent.Set( data );
	}
	
	return ( ! clear );
};

Lema.SelectedStudent.Set = function ( data ) {
	Lema.ClientStorage.SetItem( "student_id_pessoa", data.id_pessoa);
	Lema.ClientStorage.SetItem( "student_id_aluno", data.id_aluno);
	Lema.ClientStorage.SetItem( "student_nome", data.nome);
	Lema.SelectedStudent.set = true;
};

Lema.SelectedStudent.Info = function () {
	var idx, item, value;
	for ( idx = 0; idx < Lema.SelectedStudent.fields.length; ++ idx ) {
		item = Lema.SelectedStudent.fields[ idx ];
		value = Lema.ClientStorage.GetItem( item );
		console.log(item, value);
	}
};

Lema.SelectedStudent.Clear = function () {
	var idx, item;
	for ( idx = 0; idx < Lema.SelectedStudent.fields.length; ++ idx ) {
		item = Lema.SelectedStudent.fields[ idx ];
		Lema.ClientStorage.RemoveItem( item );
	}
	Lema.SelectedStudent.set = false;
};

Lema.SelectedStudent.GetItem = function ( id, to_int ) {
	var item = Lema.ClientStorage.GetItem( "student_" + id );
	if ( to_int ) {
		return parseInt( item, 10 );
	}
	return item;
};

// =============================================================================

Lema.Login = {
	fields: [ "login_pessoa", "login_nome", "login_role", "login_id", "login_time", "login_mustread" ],
	MAX_IDLE_MINUTES: 30
};

Lema.Login.ValidateTime = function () {
	var time_ms = Lema.Login.GetItem( "time", true );
	if ( isNaN( time_ms ) ) {
		return false;
	}
	var time_m = Lema.MilisecondsToMinutes( Date.now() - time_ms );
	return ( time_m < Lema.Login.MAX_IDLE_MINUTES );
	
};

Lema.Login.KeepAlive = function () {
	Lema.ClientStorage.SetItem( "login_time", Date.now() );
};

Lema.Login.Enter = function ( pessoa, login ) {
	Lema.ClientStorage.SetItem( "login_pessoa", pessoa.id );
	Lema.ClientStorage.SetItem( "login_nome", pessoa.name );
	Lema.ClientStorage.SetItem( "login_id", login.id );
	Lema.ClientStorage.SetItem( "login_role", login.mode );
	Lema.ClientStorage.SetItem( "login_time", Date.now() );
};

Lema.Login.Exit = function () {
	console.log("Lema.Login.Exit");
	Lema.Login.Clear();
	Lema.SelectedStudent.Clear();
	Lema.ClientStorage.SetItem( "logout", 1 );
	Lema.ClientStorage.SetItem( "login_mustread", 0 );
	Lema.Goto.URL( "index.html" );
};

Lema.Login.Clear = function () {
	var idx, item;
	for ( idx = 0; idx < Lema.Login.fields.length; ++ idx ) {
		item = Lema.Login.fields[ idx ];
		Lema.ClientStorage.RemoveItem( item );
	}
};

Lema.Login.Info = function () {
	var idx, item, value;
	for ( idx = 0; idx < Lema.Login.fields.length; ++ idx ) {
		item = Lema.Login.fields[ idx ];
		value = Lema.ClientStorage.GetItem( item );
		console.log("#", item, value);
	}
};

Lema.Login.GetItem = function ( id, to_int ) {
	var item = Lema.ClientStorage.GetItem( "login_" + id );
	if ( to_int ) {
		return parseInt( item, 10 );
	}
	return item;
};

// =============================================================================

Lema.DefineEvents = function () {
	Lema.events = {};
	
	if(Lema.touchscreen)
	{
		Lema.events.enter = "touchstart";
		Lema.events.leave = "touchend";
	}
	else
	{
		Lema.events.enter = "mouseenter";
		Lema.events.leave = "mouseleave";
	}
	
};

Lema.eById = function ( id ) {
	return document.getElementById( id );
};

Lema.MakeDateFromTimeStamp = function ( timestamp ) {
	timestamp = parseInt( timestamp, 10 );
	//** unix timestamp: seconds, javascript timestamp: miliseconds
	timestamp = Math.round( timestamp * 1E3 );
	var date = new Date( timestamp );
	
	var str = date.getDate();
	str += "." + ( 1 + date.getMonth() );
	str += "." +  date.getFullYear();
	str += " - ";
	str += date.getHours();
	str += ":"
	str += date.getMinutes();
	return str;
};

Lema.GetInfoMark = function ( info_id, color ) {
	var color, mark;
	
	if ( info_id == "success" ) {
		mark = Lema.Const.APP_STAT_TXT[Lema.Const.APP_STAT_SUCCESS];
		color = Lema.Colors.TOPBAR_SEQUENCE_SUCCESS;
	} else if ( info_id == "fail" ) {
		mark = Lema.Const.APP_STAT_TXT[Lema.Const.APP_STAT_FAIL];
		color = Lema.Colors.TOPBAR_SEQUENCE_FAIL;
	}
	
	if ( color ) {
		mark = "<span style='color:" + color + "'>" + mark + "</span>";
	}
	
	return mark;
}

Lema.GetParentNode = function ( e, tag_name ) {
	tag_name = tag_name.toUpperCase();
	while ( e != null && e.tagName != tag_name ) {
		e = e.parentNode;
	}
	return e;
};


Lema.MilisecondsToHours = function ( ms ) {
	return Lema.MilisecondsToMinutes( ms ) / 60;
};

Lema.MilisecondsToMinutes = function ( ms ) {
	return ( ms / 1E3 ) / 60;
};

Lema.NullFunction = function () {
};

//== 
Lema.onInputError = function ( element, message ) {
	console.log( "onInputError", element.name, element.id );
	element.style.background = Lema.Colors.BAD_INPUT_BG;
	element.addEventListener( "click", Lema.ClearInputError );
	if ( message != undefined ) {
		Lema.screen.dialog.show(
			message, function () { element.focus() }, false
		);
	}
}

//== 
Lema.ClearInputError = function ( event ) {
	event.target.style.background = Lema.Colors.OK_INPUT_BG;
};

//==
Lema.onWindowResize = function() {
	if( Lema.screen !== null ) {
		Lema.screen.size.set( window.innerWidth, window.innerHeight );
		Lema.screen.updateInterface();
	}

	Lema.dialog.size.set( window.innerWidth, window.innerHeight );
	Lema.dialog.updateInterface();
}

//Auxiliar function to set screen instance to use
Lema.setScreen = function( ScreenConstructor ) {
	if( Lema.screen !== null ) {
		Lema.screen.destroy();
	}
	
	Lema.screen = new ScreenConstructor();
	Lema.screen.size.set( window.innerWidth, window.innerHeight );
	Lema.screen.updateInterface();
	
	//==
	if ( typeof Lema.screen.afterConstructor == "function" ) {
		Lema.screen.afterConstructor();
	}
}

//Used to check for available hardware/software resources and flaging them
Lema.updateHardwareFlags = function() {
	//Check if running on touch enabled device
	if( "ontouchstart" in window || navigator.msMaxTouchPoints > 0 ) {
		Lema.touchscreen = true;
	}

	//Check if running inside cordova
	Lema.cordova = window.cordova !== undefined;
	
	Lema.DefineEvents();
}

//Auxiliar function to include JS and CSS files
/*
function include( file )
{
	console.info( "include:", file );
	var ext = file.split( "." )[1];
	if( ext == "js" ) {
		var js = document.createElement( "script" );
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		document.body.appendChild( js );
	} else if( ext ".css" ) ) {
		var css = document.createElement( "link" );
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild( css );
	}
}
*/

//Sort array
function sortArray( array, lessThan )
{
	if( lessThan === undefined )
	{
		lessThan = function( a, b )
		{
			return a < b;
		};
	}

	for( var i = 0; i < array.length; i++ )
	{
		for( var j = i; j < array.length; j++ )
		{
			if( lessThan( array[j], array[i] ) )
			{
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
	}
}

function QuerySeachString( k, v_default, to_int ) {
	var lst_kv = window.location.search.substr( 1 ).split( "&" );
	for ( var idx = 0, kv, v = null; idx < lst_kv.length; idx++ ) {
		kv = lst_kv[ idx ].split( "=" );
		if ( kv[0] == k ) {
			v = kv[1];
			break;
		}
	}
	if ( v != null ) {
		if ( to_int ) {
			v = parseInt( v, 10 );
		}
	} else {
		v = v_default;
	}
	return v;
}


window.onError = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }

    return false;
};

window.addEventListener( "error", onError );

Math.randomInt = function ( min, max ) {
	return Math.floor( Math.random() * ( max - min + 1 ) ) + min; // [ MIN, MAX ]
};


if ( typeof noLemaInitialize == "undefined" ) {
	window.addEventListener( "load", Lema.initialize );
}

window.addEventListener(
	"contextmenu",
	function ( evt ) {
		evt.preventDefault();
		evt.target.click();
		return false;
	}
);

//==

// Lema.LoadFile = {
	// time: null,
	// xhr: null
// };

// Lema.LoadFile.Start = function ( fname, callback ) {
	// fname = Lema.activityPath + fname;
	// console.log( "Lema.LoadFile.Start:", fname );
	// Lema.LoadFile.xhr = new XMLHttpRequest();
	// Lema.LoadFile.xhr.addEventListener( "load", Lema.LoadFile.onLoad );
	// Lema.LoadFile.xhr.addEventListener( "progress", Lema.LoadFile.onProgress );
	// Lema.LoadFile.xhr.open( "GET", fname );
	// Lema.LoadFile.xhr.responseType = "arraybuffer";
	// Lema.LoadFile.time = Date.now();
	// Lema.LoadFile.callback = callback;
	// Lema.LoadFile.xhr.send();
// };

// Lema.LoadFile.onLoad = function ( evt ) {
	// Lema.LoadFile.time = Date.now() - Lema.LoadFile.time;
	// console.log( "Lema.LoadFile.onLoad:", Lema.LoadFile.time, "ms" );
	// Lema.LoadFile.arraybuffer = Lema.LoadFile.xhr.response; // not responseText
	// if ( typeof Lema.LoadFile.callback == "function" ) {
		// Lema.LoadFile.callback();
	// }
// };

// Lema.LoadFile.onProgress = function ( evt ) {
	// if ( evt.lengthComputable ) {
		// var percentComplete = evt.loaded / evt.total;
		// console.log( "Lema.LoadFile.onProgress:", percentComplete.toFixed( 2 ) );
		// percentComplete = Math.ceil( percentComplete * 100 );
		// var msg = ( "A carregar: " + percentComplete + "%" );
		// Lema.screen.dialog.showWithoutButtons( msg );
	// }
// };

// Lema.LoadFile.Test = function () {
	// Lema.LoadFile.Start( "21_garden_area.nsp" )
// };

Lema.GetActivityURL = function ( a ) {
	var file_name = ( typeof a == "string" ? a : a.file );
	var url = window.location.href.substr( 0, window.location.href.lastIndexOf( "/" ) );
	url += "/" + Lema.activityPath + file_name;
	return url;
};

// =============================================================================


Lema.XHR = {
	ajax: null,
	localhost: undefined,
	url: null,
	json: true,
	DEFAULT_SERVER: "https://geometrix.cidma-ua.org/lema"
};

Lema.XHR.onLocalhost = function () {
	var idx = window.location.href.indexOf("/localhost/");
	return idx != -1;
};

Lema.XHR.Init = function () {
	Lema.XHR.ajax = new AJAX(
		{ method: "POST", json: Lema.XHR.json, failure: Lema.XHR.onError }
	);
	
	if ( Lema.XHR.onLocalhost() ) {
		var idx = window.location.href.lastIndexOf( "/" );
		Lema.XHR.url = window.location.href.substr( 0, idx );
	} else {
		Lema.XHR.url = Lema.XHR.DEFAULT_SERVER;
	}
	
	if ( ! Lema.XHR.url.endsWith("/") ) {
		Lema.XHR.url += "/";
	}
	
	Lema.XHR.url += "xhr/";
	
	console.info("Lema.XHR.Init >> url:", Lema.XHR.url);
};

Lema.XHR.onError = function ( code, msg ) {
	console.error("Lema.XHR.onError >> " + code + " : " + msg);
	Lema.screen.dialog.SetMode( 0 );
	var message;
	if ( code == 404 ) {
		message = "Servidor n&atilde;o encontrado.<br>H&aacute; liga&ccedil;&atilde;o &agrave; Internet?";
	} else {
		message = "Erro: " + code + ".<br>" + msg;
	}
	Lema.screen.dialog.show( message, Lema.NullFunction, false );
};

Lema.XHR.Send = function ( file, data, on_success ) {
	if ( ! Lema.XHR.ajax ) {
		Lema.XHR.Init();
	}
	
	console.info("Lema.XHR.Send >> file:", file);
	try {
		Lema.XHR.ajax.xhr(
			{
				file: Lema.XHR.url + file,
				values: data,
				success: on_success
			}
		);
	} catch ( e ) {
		console.log("##", e);
	}
};

function TesteXHR( a, b ) {
	var form_data = new FormData();
	form_data.append( "a", a || Math.randomInt(1, 9) );
	form_data.append( "b", b || Math.randomInt(1, 9) );
	Lema.XHR.Send(
		"add.php",
		form_data,
		TesteXHR_OK
	);
}
function TesteXHR_OK( response ) {
	console.log( "TesteXHR_OK:", response );
}

// =============================================================================

Lema.libLEMA = {
	file: "libLEMA_v1.nsp",
	url: null,
	program: null,
	callback: null,
	time: null,
	timestamp: NaN,
	MAX_HOURS: 24
};

Lema.libLEMA.GetTimestamp = function ( delta ) {
	Lema.libLEMA.timestamp = Lema.ClientStorage.GetItem( "libLEMA" );
	if ( Lema.libLEMA.timestamp == null ) {
		Lema.libLEMA.timestamp = 0;
	} else {
		Lema.libLEMA.timestamp = parseInt( Lema.libLEMA.timestamp, 10 );
	}
	
	if ( delta ) {
		return Date.now() - Lema.libLEMA.timestamp;
	}
	
	return Lema.libLEMA.timestamp;
};

Lema.libLEMA.SetTimestamp = function () {
	Lema.libLEMA.timestamp = Date.now();
	Lema.ClientStorage.SetItem( "libLEMA", Lema.libLEMA.timestamp );
	return Lema.libLEMA.timestamp;
};

Lema.libLEMA.SaveToCache = function ( reload ) {
	var dt_ms = Lema.libLEMA.GetTimestamp( true );
	var dt_h = Lema.MilisecondsToHours( dt_ms );
	if ( reload || dt_h > Lema.libLEMA.MAX_HOURS ) {
		console.log( "Lema.libLEMA.SaveToCache >> get it" );
		Lema.libLEMA.Load();
	} else {
		console.log( "Lema.libLEMA.SaveToCache >> skip it" );
	}
};

Lema.libLEMA.SetURL = function () {
	if ( Lema.XHR.onLocalhost() ) {
		var idx = window.location.href.lastIndexOf( "/" );
		var url = window.location.href.substr( 0, idx );
		Lema.libLEMA.url = url + "/libs/";
	} else {
		Lema.libLEMA.url = Lema.XHR.DEFAULT_SERVER + "/libLEMA";
	}
	
	if ( ! Lema.libLEMA.url.endsWith("/") ) {
		Lema.libLEMA.url += "/";
	}
	
	Lema.libLEMA.url += Lema.libLEMA.file;
};

Lema.libLEMA.Load = function ( callback ) {
	Lema.libLEMA.callback = callback;
	if ( true ) {
		Lema.libLEMA.time = Date.now();
		if ( Lema.libLEMA.url == null ) {
			Lema.libLEMA.SetURL();
		}
		var load_worker = new Worker( 'core/load-worker.js' );
		load_worker.onmessage = Lema.libLEMA.onWorkerMessage.bind( Lema.libLEMA );
		load_worker.postMessage( { url: Lema.libLEMA.url, progress: false } );
	}
};

Lema.libLEMA.onWorkerMessage = function ( evt ) {
	Lema.libLEMA.SetTimestamp();
	console.log( "Lema.libLEMA >> worker.load:", Date.now() - Lema.libLEMA.time );
	if ( typeof Lema.libLEMA.callback == "function" ) {
		var arraybuffer = evt.data;
		var object_loader = new ObjectLoader;
		var pson_static_pair = new dcodeIO.PSON.StaticPair;
		var data = pson_static_pair.decode( arraybuffer );
		console.log( "Lema.libLEMA >> PSON.decode:", Date.now() - Lema.libLEMA.time );
		Lema.libLEMA.program = object_loader.parse( data );
		console.log( "Lema.libLEMA >> loader.parse:", Date.now() - Lema.libLEMA.time );
		console.log( "Lema.libLEMA >> READY:", Lema.libLEMA.program.name );
		Lema.libLEMA.callback();
	}
};

// =============================================================================

// EOF