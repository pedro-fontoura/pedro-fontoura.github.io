// "use strict";

function MultipleActivityScreen(parent)
{	
	ActivityScreen.call(this, parent);
	
	
	this.frm_id = ( window.location.href.indexOf("-0.html") != -1 ? 0 : 1 )
	console.assert( this.frm_id == 0 || this.frm_id == 1, this.frm_id );
	this.active = undefined;
	
	console.log("ID:", this.frm_id);
	
	var feedback = this.feedback;
	
	this.attempts = 0;
	
	/** nr_selected_activities **/
	this.nr_selected_activities = Activity.Selection.GetCountNr();
	// console.log("nr_selected_activities:", this.nr_selected_activities);
	/** lst_selected_activities_idx **/
	this.lst_selected_activities_idx = Activity.Selection.GetListActivityIdx();
	// console.log("lst_selected_activities_idx:", this.lst_selected_activities_idx);
	
	/** CURRENT ACTIVITY PROPERTIES **/
	this.SetCurrentActivity();
	
	//Nunu app
	var self = this;
	this.app.setOnDataReceived(
		function(nunuApp_data) {	
			if (feedback.visible) {
				console.error("received data from nunuApp with a visible feddback!");
				return;
			}
			
			libLEMA.Activity.Pause();
			self.app.pause();
			self.ShowButtons( false );
			
			self.attempts++;
			// console.assert( nunuApp_data.btn_submit == self.attempts );
			nunuApp_data.attempts = self.attempts;
			var max_attempts = Math.min(self.attempts, Lema.Const.ATTEMPTS_MAX);
			var status = Lema.Const.APP_STAT_SUCCESS;
			var snd = "on_success_" + max_attempts;
			if (nunuApp_data.result === "FAIL") {
				status = Lema.Const.APP_STAT_FAIL;
				snd = "on_fail_" + max_attempts;
				if (Lema.Const.Feedback["FAIL_" + max_attempts + "_MSG"]) {
					nunuApp_data.message = Lema.Const.Feedback["FAIL_" + max_attempts + "_MSG"];
				}
				if (self.attempts >= Lema.Const.ATTEMPTS_MAX) {
					nunuApp_data.result = "SKIP";
				}
			}
			
			feedback.onRepeat = function() {
				Lema.SoundManager.StopAll();
				libLEMA.Activity.Resume();
				self.app.resume();
				self.ShowButtons(true);
			};
			
			feedback.onMenu = function() {
				Lema.SoundManager.StopAll();
				// self.ShowButtons(true);
				Activity.Selection.Clear();
				Lema.Goto.URL( "index.html" );
			};
			
			feedback.onUp = function() {
				Lema.SoundManager.StopAll();
				if (Lema.app_level_idx < Lema.app_lst_levels.length - 1) {
					Lema.app_level_idx += 1;
					Lema.app_level = parseInt(Lema.app_lst_levels[Lema.app_level_idx]);
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.SetStatusInfo();
				} else {
					console.error("feedback.onUp >> Lema.app_level_idx", Lema.app_level_idx);
				}
				self.attempts = 0;
				libLEMA.Activity.Restart(Lema.app_level);
				self.app.resume();
				self.ShowButtons(true);
			};
			
			feedback.onDown = function() {
				Lema.SoundManager.StopAll();
				if (Lema.app_level_idx > 0) {
					Lema.app_level_idx -= 1;
					Lema.app_level = parseInt(Lema.app_lst_levels[Lema.app_level_idx]);
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.SetStatusInfo();
				} else {
					console.error("feedback.onDown >> Lema.app_level_idx", Lema.app_level_idx);
				}
				self.attempts = 0;
				libLEMA.Activity.Restart(Lema.app_level);
				self.app.resume();
				self.ShowButtons(true);
			};
			
			feedback.onKeep = function() {
				Lema.SoundManager.StopAll();
				self.attempts = 0;
				libLEMA.Activity.Restart( Lema.app_level );
				self.app.resume();
				self.ShowButtons( true );
			};
			
			Activity.Selection.SetActivityStatus( self.current_activity.selected_idx, status );
			self.SetStatusInfo();
			
			//Show feedback dialog with data
			nunuApp_data.answered_count = Activity.Selection.GetAnsweredCount();
			nunuApp_data.total_count = self.nr_selected_activities;
			nunuApp_data.last_level = ( Lema.app_level_idx == Lema.app_lst_levels.length - 1 );
			nunuApp_data.last_activity = ( nunuApp_data.answered_count == nunuApp_data.total_count );
			nunuApp_data.end_sequence = ( nunuApp_data.last_activity && nunuApp_data.last_level );
			feedback.size.set(window.innerWidth, window.innerHeight);
			feedback.show( nunuApp_data );
			feedback.updateInterface();

			Lema.SoundManager.Play( snd ); // after feedback.updateInterface

			//Set feedback onSuccess callback
			feedback.onSuccess = function() {
				Lema.SoundManager.StopAll();
				self.attempts = 0;
				
				if ( Lema.app_level_idx < Lema.app_lst_levels.length - 1 ) {
					/** Continue === Level Up **/
					Lema.app_level_idx += 1;
					Lema.app_level = parseInt(Lema.app_lst_levels[Lema.app_level_idx]);
					Activity.Selection.SetLevelIdx( self.current_activity.selected_idx, Lema.app_level_idx );
					self.SetStatusInfo();
					libLEMA.Activity.Restart(Lema.app_level);
					self.app.resume();
					self.ShowButtons(true);
				} else {
					/** end of activity levels **/
					self.app.exit();
					Lema.screen.canvas.element.style.display = "none";
					if ( Activity.Selection.GetAnsweredCount() !== self.nr_selected_activities )	{
						/** next unanswered activity **/
						var idx = Activity.Selection.GetNextUnansweredIdx( self.current_activity.selected_idx );
						Activity.Selection.SetCurrentIdx( idx );
						
						//== activate peer frame
						var frm = window.parent.frames[ self.frm_id == 0 ? 1 : 0 ];
						frm.Lema.screen.Activate();
						
						Lema.Goto.URL( "MultipleActivityScreen-frame-" + self.frm_id + ".html" );
					} else {
						/** selection completed: well done! **/
						Lema.SoundManager.StopAll();
						feedback.onSuccess = function() {
							Activity.Selection.Clear();
							Lema.Goto.URL( "index.html" );
						};
						feedback.show(
							{result: "END", message: Lema.Const.Feedback.END_1_MSG}
						);
						Lema.SoundManager.Play("on_congrats");
					}
				}
			};
			
		} // end: setOnDataReceived function
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

MultipleActivityScreen.prototype = Object.create(ActivityScreen.prototype);

//== SetCurrentActivity
MultipleActivityScreen.prototype.SetCurrentActivity = function() {
	this.current_activity = {};
	/** selected current_activity_idx **/
	/*
	var idx = QuerySeachString( "idx", -1, true );
	if ( idx == -1 ) {
		this.current_activity.selected_idx = Activity.Selection.GetCurrentIdx();
		idx = this.current_activity.selected_idx;
	} else {
		// this.current_activity.selected_idx = idx;
		// Activity.Selection.SetCurrentIdx( idx );
	}
	// console.log("selected_idx:", this.current_activity.selected_idx);
	*/
	var current_idx = Activity.Selection.GetCurrentIdx();
	var idx;
	
	if ( current_idx % 2 == this.frm_id % 2 ) {
		idx = current_idx;
	} else {
		idx = current_idx + 1;
	}
	this.current_activity.selected_idx = idx;
	this.active = ( idx == current_idx);
	
	/** global current_activity_idx **/
	this.current_activity.global_idx = this.lst_selected_activities_idx[ this.current_activity.selected_idx ];
	// console.log("global_idx:", this.current_activity.global_idx);
	
	this.current_activity.activity_obj = Activity.list[ this.current_activity.global_idx ];
	// console.log("activity_obj:", this.current_activity.activity_obj);
	console.assert( this.current_activity.activity_obj.idx == this.current_activity.global_idx );
	
	/** [Array(LEVELS), Array(LEVELS), ...] **/
	var lst_lst_levels = Activity.Selection.GetListListLevel();
	/** Array(LEVELS) = Ex: ["2", "3", "4"] **/
	this.current_activity.lst_levels = lst_lst_levels[ this.current_activity.selected_idx ];
	// console.log("lst_levels", this.current_activity.lst_levels);
		
	/** [idx_0, idx_1, idx_k, ]
		k = 0 .. this.nr_selected_activities - 1
		idx_k = 0 .. max(4)
	  **/
	var lst_levels_idx = Activity.Selection.GetListLevelIdx();
	// console.log("lst_levels_idx", lst_levels_idx);
	// /** 0 .. max(4) **/
	this.current_activity.level_idx = parseInt( lst_levels_idx[ this.current_activity.selected_idx ], 10 );
	// console.log("level_idx", this.current_activity.level_idx);
	/** 1 .. 5 **/
	this.current_activity.level = parseInt(
		this.current_activity.lst_levels[ this.current_activity.level_idx ], 10
	);
	// console.log("level", this.current_activity.level);
};

//== ShowButtons
MultipleActivityScreen.prototype.ShowButtons = function(mode) {
	if (typeof mode == "undefined") {
		mode = true;
	}
	
	Lema.screen.back_button.visible = mode;
	Lema.screen.back_button.updateInterface();
	
	Lema.screen.submit_button.visible = mode;
	Lema.screen.submit_button.updateInterface();
};

//== Activate
MultipleActivityScreen.prototype.Activate = function() {
	this.active = true;
	this.SetStatusInfo();
	this.app.resume();
};

//== SetStatusInfo
MultipleActivityScreen.prototype.SetStatusInfo = function() {
	var lst_status = Activity.Selection.GetListActivityStatus();
	var top_bar = Lema.screen.top_bar;
	top_bar.activateRightGrid(lst_status.length);
	top_bar.updateInterface();
	// top_bar.info_left.element.title = "Nível " + Lema.app_level;
	top_bar.info_left.element.style.pointerEvents = "auto";
	top_bar.info_left.setText(
		this.current_activity.activity_obj.name
		+ " &raquo; "
		+ "Nível " + Lema.app_level
	);
	
	var idx, status, answered, cell;
	for (idx = 0; idx < lst_status.length; idx++) {
		status = parseInt(lst_status[idx]);
		cell = top_bar.right_grid[lst_status.length - idx - 1];
		answered = false;
		if (status === Lema.Const.APP_STAT_SUCCESS) {
			cell.text.setTextColor("darkgreen");
			answered = true;
		} else if (status === Lema.Const.APP_STAT_FAIL) {
			cell.text.setTextColor("crimson");
		}
		
		cell.text.setText(Lema.Const.APP_STAT_TXT[status]);
		cell.element.title = Activity.list[this.lst_selected_activities_idx[idx]].name;
		cell.element.style.borderBottom =
			"solid 2px " + (idx === this.current_activity.selected_idx ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF);
		if (!answered) {
			cell.setAnchor(
				"MultipleActivityScreen.html?idx=" + idx,
				Lema.Colors.ANCHOR_BORDER_OFF,
				Lema.Colors.ANCHOR_HOVER
			);
		}
	}
};

//== LoadAndStartActivity
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
		this.current_activity.activity_obj.file
	);

	window.document.title =
		Lema.NAME
		+ " - "
		+ (1 + this.current_activity.selected_idx) + "/" + this.nr_selected_activities
		+ " - "
		+ this.current_activity.activity_obj.file;
	
	if ( this.active ) {
		Activity.Selection.SetActivityStatus(
			this.current_activity.selected_idx,
			Lema.Const.APP_STAT_CURRENT
		);
		this.SetStatusInfo();
	}
	
	console.assert( Lema.libLEMA.program == null );
	Lema.libLEMA.Load( this.LoadActivityFile.bind(this) );
	
	// var Kiko = window.parent.Kiko;
	// console.log("##", Kiko.libLEMA.program == null );
	// Kiko.libLEMA.Load( this.LoadActivityFile.bind(this) );
	
	// Lema.libLEMA.program = window.parent.Kiko.libLEMA.program;
	// this.LoadActivityFile();
};

//== onWorkerMessage
MultipleActivityScreen.prototype.LoadActivityFile = function () {
	var url = Lema.GetActivityURL( this.current_activity.activity_obj );
	var load_worker = new Worker('core/load-worker.js');
	window.worker = load_worker;
	load_worker.onmessage = this.onWorkerMessage.bind( this );
	load_worker.postMessage( { url: url } );
};

//== onWorkerMessagge
MultipleActivityScreen.prototype.onWorkerMessage = function ( evt ) {
	if ( evt.data.percent ) {
		var msg = ( "A carregar: " + evt.data.percent + "%" );
		Lema.screen.dialog.showWithoutButtons(msg);
	} else {
		Lema.screen.dialog.showWithoutButtons("A preparar...");
		this.app.setProgramRun( evt.data, this.active );
		Lema.screen.canvas.element.style.display = "";
		this.setBackButton(true);
		this.setSubmitButton(true, libLEMA.Template.onClickSubmit );
		setTimeout( Lema.LoadSounds, 3E3 );
	}
};

//== setProgramRun: arraybuffer -> decode, parse, run
NunuApp.prototype.setProgramRun = function ( arraybuffer, active ) {
	console.log("NunuApp.setProgramRun", Math.round(arraybuffer.byteLength / 1024));
	var object_loader = new ObjectLoader;
	var pson_static_pair = new dcodeIO.PSON.StaticPair;
	var time = Date.now();
	var data = pson_static_pair.decode(arraybuffer);
	console.log("\tPSON.decode:", Date.now() - time);
	if ( this.program != null ) {
		delete this.program;
	}
	this.program = object_loader.parse( data );
	console.log("\tloader.parse:", Date.now() - time);
	console.log("\tapp.run:", this.program.name);
	this.run();
	if ( ! active ) {
		this.pause();
	}
};
