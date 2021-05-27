// "use strict";

function MultipleActivityScreen( parent ) {	
	ActivityScreen.call( this, parent );
	
	this.attempts = 0;
	this.fake_id = parseInt( Lema.SelectedStudent.GetItem( "id_aluno" ), 10 );
	if ( isNaN(this.fake_id) ) {
		this.fake_id = Math.randomInt( 11, 22 );
		console.log("RND_ID:", this.fake_id);
	} else {
		console.log("ALUNO_ID:", this.fake_id);
	}
	
	//** nr_selected_activities
	this.nr_selected_activities = Activity.Selection.GetCountNr();
	//** lst_selected_activities_idx
	this.lst_selected_activities_idx = Activity.Selection.GetListActivityIdx();
	//** Current activity properties: this.current_activity = { ... }
	this.SetCurrentActivity();
	
	//** Nunu app
	var self = this;
	var feedback = this.feedback;
	
	this.app.setOnDataReceived( 
		function( nunuApp_data ) {	
			if ( feedback.visible ) {
				console.error( "received data from nunuApp with a visible feddback!" );
				return;
			}
			
			//** pause nunuApp && hide Lema.screen buttons
			libLEMA.Activity.Pause();
			self.app.pause();
			self.ShowButtons( false );
			
			//** Note: self.attempts NOT ALLWAYS == nunuApp_data.btn_submit
			self.attempts += 1;
			nunuApp_data.attempts = self.attempts;
			nunuApp_data.level = Lema.app_level;
			var max_attempts = Math.min( self.attempts, Lema.Const.ATTEMPTS_MAX );
			//** default status && feedback sound: SUCCESS
			var status = Lema.Const.APP_STAT_SUCCESS;
			var snd = "on_success_" + max_attempts;
			if ( nunuApp_data.result === "FAIL" ) {
				//** status && sound: FAIL
				status = Lema.Const.APP_STAT_FAIL;
				snd = "on_fail_" + max_attempts;
				if ( Lema.Const.Feedback["FAIL_" + max_attempts + "_MSG"] ) {
					nunuApp_data.message = Lema.Const.Feedback["FAIL_" + max_attempts + "_MSG"];
				}
				//** result: FAIL -> SKIP
				if ( self.attempts >= Lema.Const.ATTEMPTS_MAX ) {
					nunuApp_data.result = "SKIP";
				}
			}
			
			//** Update activity status && top bar information
			Activity.Selection.SetActivityStatus( self.current_activity.selected_idx, status );
			self.UpdateTopBarSequenceInfo();
			
			//** Feddback button handlers
			
			feedback.onRepeat = function() {
				//** Go back to activity: change nothing
				Lema.SoundManager.StopAll();
				libLEMA.Activity.Resume();
				self.app.resume();
				self.ShowButtons( true );
			};
			
			feedback.onMenu = function() {
				//** Go back to MENU: forget activity sequence
				Lema.SoundManager.StopAll();
				Activity.Selection.Clear();
				Lema.Goto.URL( "index.html" );
			};
			
			feedback.onUp = function() {
				Lema.SoundManager.StopAll();
				if ( Lema.app_level_idx < Lema.app_lst_levels.length - 1 ) {
					//** Level UP: reset attempts
					Lema.app_level_idx += 1;
					Lema.app_level = parseInt( Lema.app_lst_levels[Lema.app_level_idx] );
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.UpdateTopBarSequenceInfo();
					self.attempts = 0;
					libLEMA.Activity.Restart( Lema.app_level );
					self.app.resume();
					self.ShowButtons( true );
				} else {
					console.error( "feedback.onUp >> Lema.app_level_idx:", Lema.app_level_idx );
				}
			};
			
			feedback.onDown = function() {
				Lema.SoundManager.StopAll();
				if ( Lema.app_level_idx > 0 ) {
					//** Level DOWN: reset attempts
					Lema.app_level_idx -= 1;
					Lema.app_level = parseInt( Lema.app_lst_levels[Lema.app_level_idx] );
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.UpdateTopBarSequenceInfo();
					self.attempts = 0;
					libLEMA.Activity.Restart( Lema.app_level );
					self.app.resume();
					self.ShowButtons( true );
				} else {
					console.error( "feedback.onDown >> Lema.app_level_idx:", Lema.app_level_idx );
				}
			};
			
			feedback.onKeep = function() {
				//** Keep level: restart activity, reset attempts
				Lema.SoundManager.StopAll();
				self.attempts = 0;
				libLEMA.Activity.Restart( Lema.app_level );
				self.app.resume();
				self.ShowButtons( true );
			};
			
			//** Show feedback dialog with data
			//** includes{ attempts, result, message && libLEMA fields }
			nunuApp_data.answered_count = Activity.Selection.GetAnsweredCount();
			nunuApp_data.total_count = self.nr_selected_activities;
			nunuApp_data.last_level = ( Lema.app_level_idx == Lema.app_lst_levels.length - 1 );
			nunuApp_data.last_activity = ( nunuApp_data.answered_count == nunuApp_data.total_count );
			nunuApp_data.end_sequence = ( nunuApp_data.last_activity && nunuApp_data.last_level );
			feedback.size.set( window.innerWidth, window.innerHeight );
			feedback.show( nunuApp_data );
			feedback.updateInterface();

			Lema.SoundManager.Play( snd ); //** after feedback.updateInterface

			//** Set feedback onSuccess callback
			feedback.onSuccess = function() {
				Lema.SoundManager.StopAll();
				self.attempts = 0;
				
				if ( Lema.app_level_idx < Lema.app_lst_levels.length - 1 ) {
					//** Continue === Level Up
					Lema.app_level_idx += 1;
					Lema.app_level = parseInt( Lema.app_lst_levels[Lema.app_level_idx] );
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.UpdateTopBarSequenceInfo();
					libLEMA.Activity.Restart( Lema.app_level );
					self.app.resume();
					self.ShowButtons( true );
				} else {
					//** end of activity levels
					self.app.exit();
					Lema.screen.canvas.element.style.display = "none";
					if ( Activity.Selection.GetAnsweredCount() !== self.nr_selected_activities )	{
						//** next unanswered activity
						var idx = Activity.Selection.GetNextUnansweredIdx( self.current_activity.selected_idx );
						Activity.Selection.SetCurrentIdx( idx );
						Lema.Goto.URL( "MultipleActivityScreen.html" );
					} else {
						//** selection completed: Well Done!
						self.SelectionCompleted();
					}
				}
			};
			
			//** Save activity performance
			self.SaveActivityPerformance( nunuApp_data );
		} //** end: function setOnDataReceived
	 );
	
	Lema.HorizontalRuler();
	console.info( 
		"MultipleActivityScreen",
		this.current_activity.selected_idx,
		"/",
		this.nr_selected_activities,
		">>",
		this.current_activity.activity_obj.file
	 );
	Lema.HorizontalRuler();
	
	this.afterConstructor = this.LoadAndStartActivity;
}

MultipleActivityScreen.prototype = Object.create( ActivityScreen.prototype );

//** SelectionCompleted
MultipleActivityScreen.prototype.SelectionCompleted = function() {
	Lema.SoundManager.StopAll();
	this.feedback.onSuccess = function() {
		Lema.User.SetRole();
		if ( Lema.User.is_student ) {
			Activity.Selection.Clear();
		}
		Lema.Goto.URL( "index.html" );
	};
	this.feedback.show( 
		{result: "END", message: Lema.Const.Feedback.END_1_MSG}
	 );
	Lema.SoundManager.Play( "on_congrats" );
	//** Student and finished a teacher sequence?
	Lema.User.SetRole();
	if ( Lema.User.is_student ) {
		var sequence_id = Lema.User.GetSequenceId();
		if ( sequence_id > 0 ) {
			//** Update sequence status
			this.TeacherSequenceDone( sequence_id );
		}
	}
};

//** TeacherSequenceDone
MultipleActivityScreen.prototype.TeacherSequenceDone = function( sequence_id ) {
	console.log("-- TeacherSequenceDone:", sequence_id);
	var form_data = new FormData();
	form_data.append( "id", sequence_id );
	Lema.XHR.Send(
		"set-sequence-done.php",
		form_data,
		this.TeacherSequenceDone_OK.bind( this )
	);
};

MultipleActivityScreen.prototype.TeacherSequenceDone_OK = function( response ) {
	console.log("TeacherSequenceDone_OK:", response);
};

//** SaveActivityPerformance
MultipleActivityScreen.prototype.SaveActivityPerformance = function( nunuApp_data ) {
	Lema.User.SetRole();
	if ( ! Lema.User.is_student ) {
		return;
	}
	
	var id_aluno = Lema.Login.GetItem( "id", true );
	var id_file = this.current_activity.activity_obj.file.split("_")[0];
	var p_status = 1; //** success
	if ( nunuApp_data.result == "FAIL" ) {
		p_status = 0;
	} else if ( nunuApp_data.result == "SKIP" ) {
		p_status = 2;
	}
	
	var form_data = new FormData();
	form_data.append( "id_aluno", id_aluno );
	form_data.append( "id_file",  parseInt( id_file, 10 ) );
	form_data.append( "duration",  nunuApp_data.time );
	form_data.append( "status",  p_status );
	form_data.append( "level",  nunuApp_data.level );
	form_data.append( "attempts",  nunuApp_data.attempts );
	form_data.append( "click_sound",  nunuApp_data.btn_sound );
	form_data.append( "click_hint",  nunuApp_data.btn_hint );
	form_data.append( "click_restart",  nunuApp_data.btn_restart );
	form_data.append( "click_undo",  nunuApp_data.btn_undo );
	form_data.append( "click_submit",  nunuApp_data.btn_submit );
	form_data.append( "sequence_id",  Lema.User.GetSequenceId() );
	
	Lema.XHR.Send(
		"save-activity-performance.php",
		form_data,
		this.SaveActivityPerformance_OK.bind( this )
	);
	
	// var sequence_id = ;
	// if ( sequence_id > 0 ) {
		// //** Update sequence status
		// self.TeacherSequenceDone( sequence_id );
	// }
};

//** SaveActivityPerformance_OK
MultipleActivityScreen.prototype.SaveActivityPerformance_OK = function( response ) {
	console.log("SaveActivityPerformance_OK:", response);
};

//** SetCurrentActivity
MultipleActivityScreen.prototype.SetCurrentActivity = function() {
	this.current_activity = {};
	
	//** sequence current_activity_idx
	var idx = QuerySeachString( "idx", -1, true );
	if ( idx == -1 ) {
		this.current_activity.selected_idx = Activity.Selection.GetCurrentIdx();
		idx = this.current_activity.selected_idx;
	} else {
		this.current_activity.selected_idx = idx;
		Activity.Selection.SetCurrentIdx( idx );
	}
	
	//** global current_activity_idx
	this.current_activity.global_idx =
		this.lst_selected_activities_idx[ this.current_activity.selected_idx ];
	
	//** activity_obj
	this.current_activity.activity_obj = Activity.list[ this.current_activity.global_idx ];
	console.assert( this.current_activity.activity_obj.idx == this.current_activity.global_idx );
	
	//** [lst_lst_levels :: Array( LEVELS ), Array( LEVELS ), ...]
	var lst_lst_levels = Activity.Selection.GetListListLevel();
	
	//** lst_levels :: Array( LEVELS ) = Ex: ["2", "3", "4"]
	this.current_activity.lst_levels = lst_lst_levels[ this.current_activity.selected_idx ];
		
	//** lst_levels_idx
	var lst_levels_idx = Activity.Selection.GetListLevelIdx();
	
	//** level_idx
	this.current_activity.level_idx = parseInt( lst_levels_idx[ this.current_activity.selected_idx ], 10 );
	
	//** activity.level
	this.current_activity.level = parseInt( 
		this.current_activity.lst_levels[ this.current_activity.level_idx ],
		10
	 );
	 
	 console.log(this.current_activity);
};

//** ShowButtons: back_button && submit_button
MultipleActivityScreen.prototype.ShowButtons = function( mode ) {
	if ( typeof mode == "undefined" ) {
		mode = true;
	}
	
	Lema.screen.back_button.visible = mode;
	Lema.screen.back_button.updateInterface();
	
	Lema.screen.submit_button.visible = mode;
	Lema.screen.submit_button.updateInterface();
};

//** UpdateTopBarSequenceInfo
MultipleActivityScreen.prototype.UpdateTopBarSequenceInfo = function() {
	var lst_status = Activity.Selection.GetListActivityStatus();
	var top_bar = Lema.screen.top_bar;
	top_bar.activateRightGrid( lst_status.length );
	top_bar.info_left.element.style.pointerEvents = "auto";
	top_bar.info_left.setText( 
		this.current_activity.activity_obj.name
		+ " &raquo; "
		+ "Nível " + Lema.app_level
	 );
	top_bar.updateInterface();

	//** Update activity sequence status information
	var idx, status, answered, cell, border_color;
	for ( idx = 0; idx < lst_status.length; idx++ ) {
		status = parseInt( lst_status[idx] );
		cell = top_bar.right_grid[lst_status.length - idx - 1];
		answered = false;
		if ( status === Lema.Const.APP_STAT_SUCCESS ) {
			cell.text.setTextColor( Lema.Colors.TOPBAR_SEQUENCE_SUCCESS );
			answered = true;
		} else if ( status === Lema.Const.APP_STAT_FAIL ) {
			cell.text.setTextColor( Lema.Colors.TOPBAR_SEQUENCE_FAIL );
		}
		
		cell.text.setText( Lema.Const.APP_STAT_TXT[status] );
		cell.element.title = Activity.list[this.lst_selected_activities_idx[idx]].name;
		if ( idx === this.current_activity.selected_idx ) {
			border_color = Lema.Colors.ANCHOR_BORDER_ON;
		} else {
			border_color = Lema.Colors.ANCHOR_BORDER_OFF;
		}
		cell.element.style.borderBottom = "solid 2px " + border_color;
		if ( ! answered ) {
			// cell.setAnchor( 
				// "MultipleActivityScreen.html?idx=" + idx,
				// Lema.Colors.ANCHOR_BORDER_OFF,
				// Lema.Colors.ANCHOR_HOVER
			// );
		}
	}
};

//** LoadAndStartActivity
MultipleActivityScreen.prototype.LoadAndStartActivity = function() {
	Lema.app_level = this.current_activity.level;
	Lema.app_lst_levels = this.current_activity.lst_levels;
	Lema.app_level_idx = this.current_activity.level_idx;
	
	console.info( 
		"LoadAndStartActivity",
		this.current_activity.selected_idx,
		"/",
		this.nr_selected_activities,
		">>",
		this.current_activity.activity_obj.file,
		"level:", Lema.app_level
	 );

	top.document.title =
		Lema.NAME
		+ " - "
		+ ( 1 + this.current_activity.selected_idx ) + "/" + this.nr_selected_activities
		+ " - "
		+ this.current_activity.activity_obj.file;
	
	Activity.Selection.SetActivityStatus( 
		this.current_activity.selected_idx,
		Lema.Const.APP_STAT_CURRENT
	 );
	this.UpdateTopBarSequenceInfo();
	
	console.assert( Lema.libLEMA.program == null );
	Lema.libLEMA.Load( this.LoadActivityFile.bind( this ) );
	
	// var Kiko = window.parent.Kiko;
	// console.log( "##", Kiko.libLEMA.program == null );
	// Kiko.libLEMA.Load( this.LoadActivityFile.bind( this ) );
	
	// Lema.libLEMA.program = window.parent.Kiko.libLEMA.program;
	// this.LoadActivityFile();
};

//** LoadActivityFile: uses a webworker
MultipleActivityScreen.prototype.LoadActivityFile = function () {
	var url = Lema.GetActivityURL( this.current_activity.activity_obj );
	var load_worker = new Worker( 'core/load-worker.js' );
	load_worker.onmessage = this.onWorkerMessage.bind( this );
	load_worker.postMessage( { url: url } );
};

//** onWorkerMessagge: progress || file loaded
MultipleActivityScreen.prototype.onWorkerMessage = function ( evt ) {
	if ( evt.data.percent ) {
		var msg = ( "A carregar: " + evt.data.percent + "%" );
		Lema.screen.dialog.showWithoutButtons( msg );
	} else { //** Activity file loaded
		Lema.screen.dialog.showWithoutButtons( "A preparar..." );
		this.app.setProgramRun( evt.data );
		if ( window.parent != window ) {
			window.parent.onActivityInitialized = this.onActivityInitialized.bind( this );
		}
	}
};

//** Called by libLEMA on libLEMA.Activity.Initialize
//** Note: after the message "READY: libLEMA.Activity"
MultipleActivityScreen.prototype.onActivityInitialized = function () {
	Lema.screen.canvas.element.style.display = "";
	Lema.screen.dialog.hide(); //** Hide: "A preparar..."
	Lema.Sound.LoadFeedbackSounds( this.onSoundsLoaded.bind( this ) );
};

//**
MultipleActivityScreen.prototype.onSoundsLoaded = function () {
	this.setBackButton( true );
	this.setSubmitButton( true, libLEMA.Template.onClickSubmit );
	if ( typeof window.parent.ActivitySelectionCache == "function" ) {
		window.parent.ActivitySelectionCache();
	}
};

//** NunuApp.setProgramRun: arraybuffer -> decode, parse, run
NunuApp.prototype.setProgramRun = function ( arraybuffer ) {
	console.log( "NunuApp.setProgramRun:", Math.round( arraybuffer.byteLength / 1024 ), "KB" );
	var object_loader = new ObjectLoader;
	var pson_static_pair = new dcodeIO.PSON.StaticPair;
	var time = Date.now();
	var data = pson_static_pair.decode( arraybuffer );
	console.log( "\tPSON.decode:", Date.now() - time );
	if ( this.program != null ) {
		delete this.program;
	}
	this.program = object_loader.parse( data );
	console.log( "\tloader.parse:", Date.now() - time );
	console.log( "\tapp.run:", this.program.name );
	this.run();
	
};

//** EOF