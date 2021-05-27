/** ############################################################
  *	libLEMA
  * Geometrix LEMA's activities library
  * ############################################################
  **/

/** Library container
  * ------------------------------------------------------------
  **/

var libLEMA = {
	VERSION: "1.30",
	TIMESTAMP: "2017.NOV.09.1839",
	APP_CODE_CHECK: "starfish",
	ready: false
};

/** History
  * ------------------------------------------------------------
  
  1.30
  - pre-launch
  - new APP_CODE_CHECK starfish
  
  1.29
  - libLEMA.LemaPlatform.screen.onActivityInitialized
  
  1.28
  - New button icons
  - REMOVED "submit button"
  - libLEMA.Template.onClickSubmit
  
  1.27
  - libLEMA.Mouse.Update
		if ( libLEMA.Kinect.on ) libLEMA.Mouse.delta = ...
  - REMOVED libLEMA.Kinect.delta
  
  1.26
  - DragAndDrop, adjust_z property, default value = 1
		z increse on drag, decrease on drop so that draged objects don't stay behind other objects on teh scene
  
  1.25
  
  - CORRECTION DragAndDrop devicePixelRatio 
  - REMOVED LemaPlatform.cursor
  
  1.24
  
  - first support for LEMA menu/dialog/feedback interaction with keyboard
		arrows (move), enter (click)
		under developement...
  
  1.23
  
  - libLEMA.Calculator
		. libLEMA.Calculator.Initialize([true|false])
		. libLEMA.Calculator.Show([true|false])
		. libLEMA.Calculator.GetValue()
		. libLEMA.Calculator.SetPositionLeftTop(x, y)
			libLEMA.Calculator.width | libLEMA.Calculator.height

  1.22
  
  - saved as NSP format
  
  - libLEMA.Activity.Initialize = function (lemaApp, lemaAppInitialize, app_script, app_update)
		this function now calls libLEMA.Activity.SetUpdate(app_script, app_update)
		
  - libLEMA.DragAndDrop.Update
		takes into account window.devicePixelRatio
  
  1.21
  
  - libLEMA.DragAndDrop.ForceDrop
  
  1.20
  
  - libLEMA.Activity.SetMinimumWidth
		This adjusts camera size automatically:
		» libLEMA.Activity.SetCameraSize
		» libLEMA.Template.force_resize
		
  - Hint visibility sync
  - libLEMA.Activity.Restart() hides hint [sync to 0 clicks]
  
  1.19
  
  - libLEMA.Tools.MoveObjectTo
 
  1.18
  
  - libLEMA.SetOfficialURL(url)
  
  - libLEMA.Sound.LoadNumber(nr, emitter_name)
  
  1.17
  
  - libLEMA.Template.SetTitle() » automatic text size && line break
		only two lines
		"\n" ignored
		corrected: txt.replace(/\n/g, " ")
  
  1.16
  
  - libLEMA.Keyboard » allow keyboard as mouse:
		arrows: move
		enter: click
		space: toggle click

  - libLEMA.Template.ShowUndoButton()
		btn_undo: defaults not visible
  
  - libLEMA.Template.onHandle.on_restart(level)
		activity: receives level BOTH on lemaApp.level and function lemaAppOnRestart(lvl)
  
  1.15
  
  - New button: btn_undo
		activity: new function, new handler
			«function lemaAppOnClickButtonUndo()»
			«btn_undo: lemaAppOnClickButtonUndo.bind(self)»
  
  1.14
  
  - libLEMA.Kinect »» corrected: delta, ndc
		
  - libLEMA.Mouse »» removed: JustPressed, JustReleased
  
  - libLEMA.Activity.Restart( LEVEL )
		activity: function lemaAppOnRestart( VOID )
		activity: NEW LEVEL defined on lemaApp.level
  
  - libLEMA.Tools.GetTextDimension = function (text3d, scale)
		scale: boolean, whether to return absolute or scaled dimension
  
  1.13
  
  - libLEMA.Kinect
		initial implementation: tested and working
		raycasting: implemented, NOT tested

  - libLEMA.Update()
		libLEMA.DragAndDrop.Update()

  - libLEMA.Ativity.Update()
		activity_script.update() moved to libLEMA.Update()
  
  1.12
  
  - libLEMA.Mouse
		booleans: just_pressed, just_released
		world: screen alias (mouse position on THREE space)
		ShowCursor(): show|hide default cursor (canvas only)
		ShowHand(): show|hide activity hand cursor
  
  1.11
  
  - libLEMA.Mouse
		JustPressed()
		JustReleased()
  
  1.10
  
  - libLEMA.Sound.LoadByURL (name, url, callback)
  
  1.9
  
  - libLEMA.Activity.Restart, receives: level
  - lemaAppOnRestart
  - libLEMA.Sound.AudioEmitter_Play, wait for audio buffer availability
  - libLEMA.Activity.lemaApp as a reference, for libLEMA.Activity.Restart
  
  1.8
  
  - libLEMA.Tools.GetWorldPosition
  - libLEMA.Activity.SetCameraPosition (is this working?)
  
  v1.7
  
  - libLEMA.Sound.TogglePlayByNameList

  v1.6
  
  - libLEMA.Sound.TogglePlayByName
  - Template buttons have a new 3rd state:
		off (white) / hover (gray) / on (black)
  - sounds associated with "btn_sound" MUST begin with "snd_enunciado"
  
  v1.5
  
  - libLEMA.DragAndDrop.dragging
  - libLEMA.DragAndDrop.moving
  - libLEMA.DragAndDrop.Set
  - libLEMA.DragAndDrop.Update
  - libLEMA.DragAndDrop.MoveObjectTo
  
  - libLEMA.Activity.Initialize [ lemaApp, lemaAppInitialize ]
  
  - libLEMA.Activity
		. program
		. scene
		. screen
		. canvas
		. camera
		. camera_aspect
		. camera2canvas_ratio
		. hint
		. paused
  
  v1.4
  
  - libLEMA.Activity.SubmitResult
  - libLEMA.Activity.Pause
  - libLEMA.Activity.Resume
  - libLEMA.Activity.ShowScene
  - libLEMA.Activity.GetLevel
  
  v1.3
  
  - libLEMA.Sound.RegisterHTMLVideoElement
  
  v1.2
  
  - libLEMA.Sound.Initialize
		. activity_sounds: container
  - libLEMA.Template.Initialize
		. parameter onHandle = {resize: activity_handler_function}
		. initializes activity hint area:
			activity_hint: container
				background: plane, set to position {x: 0, y: 0}
				hint_information: container
  - libLEMA.Template.Update
		. if libLEMA.Template.resized
			repositions activity_hint container
			calls: activity_handler_function for 'resize'
  
  v1.1
  
  - hint.triangle, visible according to hint.nr_clicks
  - libLEMA.Template.resized
  - libLEMA.Template.ActivityPause/Resume
  - libLEMA.Template.ActivitySubmitResult [function renamed]
  - libLEMA.Template.ActivityShowScene
  - libLEMA.Const.DEFAULT_FRAME_RATE
  - libLEMA.Const.DEFAULT_FRAME_TIME
  
  v1.0
  
  - libLEMA.Sound.PlayByNameList
  - libLEMA.Template.GetObjectByName
  - Adjust libLEMA buttons/title/lawn position.z
  - libLEMA.Sound.LoadAll
  - libLEMA.Template.SetTitle
  - libLEMA.Sound.Initialize, give it the parent_container
  - libLEMA.Sound.PlayByName callback
  - libLEMA.Sound.audio_emitter.onEnded default handler
  
  **/

/** nunu: initialize
  * ------------------------------------------------------------
  **/
this.initialize = function() {
	console.info("libLEMA_script.initialize");
	libLEMA.script = this;
	window.libLEMA = libLEMA;
};

/** nunu: update
  * ------------------------------------------------------------
  **/

this.update = function() {
	if (window.libLEMA && libLEMA.ready && libLEMA.Template.ready) {
		if (libLEMA.Activity.ready && libLEMA.Sound.ready) {
			libLEMA.script.update = libLEMA.Update;
		}
	}
};

/** ############################################################
  *	Library functions && modules
  * ############################################################
  **/

/** libLEMA.Initialize
  * ------------------------------------------------------------
  **/

libLEMA.Initialize = function (parameters) {
	libLEMA.fps = {
		now: 0,
		time: 0,
		cnt: 0,
		element: null
	};
	libLEMA.fps.element = document.getElementById("fps");
	libLEMA.nunu_editor = window.location.href.toString().indexOf("editor") > 0;
	if (typeof Lema != "undefined") {
		libLEMA.LemaPlatform = Lema;
	} else {
		libLEMA.LemaPlatform = null;
	}
	libLEMA.Tools.HorizontalRuler();
	console.info("NSP >> libLEMA", "v" + libLEMA.VERSION, libLEMA.TIMESTAMP);
	console.log("nunu editor:", libLEMA.nunu_editor);
	console.log("LEMA platform:", libLEMA.LemaPlatform !== null);
	libLEMA.Tools.HorizontalRuler();
	libLEMA.ready = true;
};

/** libLEMA.Update
  * ------------------------------------------------------------
  **/

libLEMA.Update = function () {
	if (libLEMA.fps.element) {
		libLEMA.fps.now = Date.now();
		if (libLEMA.fps.now - libLEMA.fps.time >= 1E3) {
			libLEMA.fps.element.innerHTML = libLEMA.fps.cnt;
			libLEMA.fps.cnt = 0;
			libLEMA.fps.time = libLEMA.fps.now;
		} else {
			libLEMA.fps.cnt++;
		}
	}
	if (libLEMA.Keyboard.on) {
		if (Mouse.delta.x || Mouse.delta.y) {
			console.log("keyboard OFF");
			libLEMA.Keyboard.on = false;
		} else {
			if (libLEMA.Keyboard.key !== null) {
				if (Keyboard.keyJustReleased(libLEMA.Keyboard.key)) {
					libLEMA.Keyboard.move_step = 1;
					libLEMA.Keyboard.key = null;
				} else {
					libLEMA.Keyboard.move_step += libLEMA.Keyboard.step_up;
				}
			} else {
				libLEMA.Keyboard.TestActivity();
			}
		}
	} else {
		if (libLEMA.Keyboard.TestActivity()) {
			console.log("keyboard ON");
			libLEMA.Keyboard.move_step = 1;
			libLEMA.Keyboard.on = true;
		}
		else if ( Keyboard.keyJustPressed(Keyboard.K) ) {
			if ( libLEMA.Kinect.on ) {
				libLEMA.Kinect.Close();
			} else {
				libLEMA.Kinect.Open(); // libLEMA.Kinect.default_url
			}
		}
	}
	libLEMA.Mouse.Update();
	libLEMA.Template.Update();
	libLEMA.Activity.Update();
	if (libLEMA.DragAndDrop.dragging) {
		libLEMA.DragAndDrop.Update();
	}
	if (libLEMA.Calculator.active) {
		libLEMA.Calculator.Update();
	}
};

/** libLEMA.SetOfficialURL
  * ------------------------------------------------------------
  **/

libLEMA.SetOfficialURL = function (url) {
	libLEMA.official_url = url;
};

/** libLEMA.AssertType
  * ------------------------------------------------------------
  **/

libLEMA.AssertType = function (id, object, type) {
	if (!(typeof object == "object" && object.type == type)) {
		console.error(
			"libLEMA.AssertType",
			":", id,
			">> Expected THREE object of type", type
		);
		console.log(object);
		return false;
	}
	return true;
};

/** libLEMA.AssertContainer
  * ------------------------------------------------------------
  **/

libLEMA.AssertContainer = function (id, object) {
	var status = false;
	/** test object itself **/
	if (object && typeof object == "object") {
		/** test constructor: Container **/
		if (object.type == "Group" || object.type == "Container") {
			status = true;
		}
	}
	if (!status) {
		console.error(
			"libLEMA.AssertContainer",
			":", id, 
			">> not a THREE Container or Group"
		);
	}
	return status;
};

/** libLEMA.AssertTypeOf
  * ------------------------------------------------------------
  **/

libLEMA.AssertTypeOf = function (id, object, type) {
	if (object === null || typeof object != type) {
		console.error(
			"libLEMA.AssertTypeOf",
			":", id,
			">> Expected JS object of type", type
		);
		console.log(object);
		return false;
	}
	return true;
};

/** ############################################################
  *	libLEMA.Activity
  * ############################################################
  **/

libLEMA.Activity = {
	ready: false,
	paused: false,
	script: null,
	app_update: function() {
		console.warn("'app_update' not defined!");
	},
	minimum_width: 0,
	DEFAULT_CAMERA_SIZE: null
};

libLEMA.Activity.SetUpdate = function (app_script, app_update) {
	console.info("libLEMA.Activity.SetUpdate");
	libLEMA.AssertType("app_script", app_script, "Script");
	libLEMA.AssertTypeOf("app_update", app_update, "function");
	libLEMA.Activity.script = app_script;
	libLEMA.Activity.app_update = app_update;
	libLEMA.Activity.Update = libLEMA.Activity.UpdateLemaApp;
};

libLEMA.Activity.UpdateNull = function () {
};

libLEMA.Activity.UpdateLemaApp = function () {
	libLEMA.Activity.app_update();
};

libLEMA.Activity.Update = libLEMA.Activity.UpdateNull;

/** libLEMA.Activity.SubmitResult
  * ------------------------------------------------------------
  * Receives: success, boolean = aplication validation
  * Sends to LEMA platform:
  *		- result: accordind to success value
  *		- time: current aplication clock time
  *		- data: other aplication specific values
  **/

libLEMA.Activity.SubmitResult = function (success, data) {
	console.info("libLEMA.Activity.SubmitResult:", success);
	// libLEMA.Template.buttons.btn_submit.background.material =
		// libLEMA.Template.materials[success ? "clr_lawn" : "clr_highlight"];
	var output = {
		result: (success ? "SUCCESS" : "FAIL"),
		time: Math.round(libLEMA.Template.clock.getElapsedTime()),
		btn_submit: libLEMA.Template.submit_nr_clicks
	};
	var idx, k;
	/** add buttons click counter **/
	for (k in libLEMA.Template.buttons) {
		output[k] = libLEMA.Template.buttons[k].nr_clicks;
	}
	/** copy activity specific data **/
	for (k in data) {
		if (typeof output[k] == "undefined") {
			output[k] = data[k];
		} else {
			console.error("libLEMA.Activity.SubmitResult >> cannot override:", k);
		}
	}
	/** send to LEMA platform **/
	libLEMA.Sound.StopIfPlaying();
	if (libLEMA.LemaPlatform) {
		libLEMA.Template.activity_program.sendDataApp(output);
	} else {
		console.log(output);
	}
};

/** libLEMA.Activity.Pause
  * ------------------------------------------------------------
  **/

libLEMA.Activity.Pause = function () {
	console.info("libLEMA.Activity.Pause");
	libLEMA.Activity.ShowScene(false);
	libLEMA.Activity.paused = true;
	libLEMA.Activity.Update = libLEMA.Activity.UpdateNull;
};

/** libLEMA.Activity.Resume
  * ------------------------------------------------------------
  **/

libLEMA.Activity.Resume = function () {
	console.info("libLEMA.Activity.Resume");
	libLEMA.Activity.ShowScene(true);
	libLEMA.Activity.paused = false;
	libLEMA.Activity.Update = libLEMA.Activity.UpdateLemaApp;
};

/** libLEMA.Activity.Restart
  * ------------------------------------------------------------
  **/

libLEMA.Activity.Restart = function (level) {
	libLEMA.AssertTypeOf("level", level, "number");
	/** set activity level **/
	libLEMA.Activity.lemaApp.level = level;
	libLEMA.Tools.HorizontalRuler();
	console.info("libLEMA.Activity.Restart: level", libLEMA.Activity.lemaApp.level);
	libLEMA.Tools.HorizontalRuler();
	/** reset button click counter **/
	var idx, k, btn;
	for (idx in libLEMA.Template.lst_buttons) {
		k = "btn_" + libLEMA.Template.lst_buttons[idx];
		btn = libLEMA.Template.buttons[k];
		btn.nr_clicks = 0;
		libLEMA.Template.Button_Sync(btn, false);
	}
	libLEMA.Template.submit_nr_clicks = 0;
	/** hide hint **/
	libLEMA.Template.activity_hint.container.visible = false;
	libLEMA.Template.buttons.btn_hint.container.triangle.visible = false;
	/** reset activity clock **/
	libLEMA.Template.clock.stop();
	libLEMA.Template.clock.start();
	/** restart **/
	libLEMA.Template.onHandle.on_restart(level);
	/** ready to go **/
	libLEMA.Activity.ShowScene(true);
	libLEMA.Activity.paused = false;
	libLEMA.Activity.Update = libLEMA.Activity.UpdateLemaApp;
};

/** libLEMA.Activity.ShowScene
  * ------------------------------------------------------------
  **/

libLEMA.Activity.ShowScene = function (mode) {
	console.info("libLEMA.Activity.ShowScene:", mode);
	libLEMA.Template.scene.visible = Boolean(mode);
};

/** libLEMA.Activity.Initialize
  * ------------------------------------------------------------
  **/

libLEMA.Activity.Initialize = function (lemaApp, lemaAppInitialize, app_script, app_update, app_code_check) {
	console.info("libLEMA.Activity.Initialize");
	if ( libLEMA.APP_CODE_CHECK !== app_code_check ) {
		console.error(
			"libLEMA.Activity.Initialize",
			">> bad app code:", app_code_check
		);
		return;
	} 
	if (!lemaApp || typeof lemaApp != "object") {
		console.error(
			"libLEMA.Activity.Initialize",
			">> expected object: lemaApp"
		);
		return;
	}
	if (typeof lemaAppInitialize != "function") {
		console.error(
			"libLEMA.Activity.Initialize",
			">> expected function: lemaAppInitialize"
		);
		return;
	}
	
	/** init: libLEMA.Sound, requires 'activity_program' **/
	libLEMA.Sound.Initialize();
	libLEMA.Sound.LoadAll(); // from: activity_sounds
	
	libLEMA.Activity.lemaApp = lemaApp;
	lemaApp.clicked = null;
	lemaApp.hint = libLEMA.Activity.hint;
	lemaApp.level = libLEMA.Activity.GetLevel();
	console.log("Load && Init:", Date.now() - libLEMA.Activity.program.userData.time, "ms");
	libLEMA.Tools.HorizontalRuler();
	lemaAppInitialize();
	libLEMA.Activity.ShowScene(true);
	libLEMA.Activity.ready = true;
	libLEMA.Activity.SetUpdate(app_script, app_update);
	console.log("READY:", "libLEMA.Activity");
	libLEMA.Tools.HorizontalRuler();
	if (libLEMA.LemaPlatform) {
		libLEMA.LemaPlatform.screen.onActivityInitialized();
	}
};

/** libLEMA.Activity.GetLevel
  * ------------------------------------------------------------
  **/

libLEMA.Activity.GetLevel = function () {
	var level = 1;
	if (typeof Lema == "function") {
		console.assert(Lema.app_level);
		level = Lema.app_level;
	} else {
		console.warn(
			"libLEMA.Activity.GetLevel",
			">> Lema platform not found: level set to 1"
		);
	}
	return level;
};

/** libLEMA.Activity.SetCameraPosition
  * ------------------------------------------------------------
  **/

libLEMA.Activity.SetCameraPosition = function (v3, is_delta) {
	if (is_delta) {
		libLEMA.Activity.camera.position.add(v3);
	} else {
		libLEMA.Activity.camera.position.set(v3.x, v3.y, v3.z);
	}
	libLEMA.Activity.camera.updateMatrix();
	libLEMA.Template.Update_Position();
};

libLEMA.Activity.SetMinimumWidth = function (width) {
	libLEMA.Activity.minimum_width = parseInt(width);
	libLEMA.Activity.SetCameraSize();
};

libLEMA.Activity.SetCameraSize = function () {
	//var camera_size = Math.ceil(libLEMA.Activity.minimum_width / libLEMA.Activity.camera.aspect);
	var camera_size = libLEMA.Activity.minimum_width / libLEMA.Activity.camera.aspect;
	if (camera_size < libLEMA.Activity.DEFAULT_CAMERA_SIZE) {
		camera_size = libLEMA.Activity.DEFAULT_CAMERA_SIZE;
	}
	if (camera_size != libLEMA.Activity.camera.size) {
		console.info(
			"libLEMA.Activity.SetCameraSize:",
			libLEMA.Activity.camera.size,
			">>",
			camera_size
		);
		libLEMA.Activity.camera.size = camera_size;
		libLEMA.Activity.camera.updateMatrix();
		libLEMA.Template.camera.updateProjectionMatrix();
		libLEMA.Template.force_resize = true;
	}
};

/** ############################################################
  *	libLEMA.Template
  * ############################################################
  **/

libLEMA.Template = {
	ready: false,
	/** **/
	activity_program: null,
	libLEMA_program: null,
	scene: null,
	camera: null,
	raycaster: null,
	onHandle: null,
	canvas: null,
	camera2canvas_ratio: null,
	camera_aspect: 0,
	paused: false,
	resized: false,
	force_resize: false,
	screen: {},
	onClickButtonHandle: null,
	title: null,
	lawn: null,
	lst_buttons: ["sound", "hint", "restart", "undo"],
	lst_hover_elements: [],
	mouse_dt: 0.5E3,
	mouse_over_button: false,
	hover_element: null,
	buttons: {},
	lst_materials: [
		"btn_bg_off", "btn_bg_on", "btn_bg_hover",
		"clr_highlight", "clr_white", "clr_black", "clr_lawn", "clr_green", "clr_sky",
		"m_hand_point", "m_hand_on", "m_hand_drag"
	],
	materials: {},
	lst_sounds: [],
	sounds: {},
	lst_handlers: ["resize", "restart"],
	activity_hint: {
		container: null,
		background: null,
		information: null,
		delta: {x: 0, y: 0}
	},
	editor: null,
	btn: {
		spacing: null,
		scale: null
	},
	show_undo: false,
	resize_change: false,
	resize_timer: null,
	submit_nr_clicks: 0
};

/** libLEMA.Template.Initialize
  * ------------------------------------------------------------
	parameters:
		activity_program
		libLEMA_program
		onClickButtonHandle
		onHandler
  **/

libLEMA.Template.Initialize = function (parameters) {
	var time = Date.now();
	console.info("libLEMA.Template.Initialize");
	parameters = parameters || {};
	
	/** activity: program, scene, camera, raycaster **/
	libLEMA.Template.Initialize_ProgramAndScene(parameters);
	
	/** handler functions: button clicks, resize, ... **/
	libLEMA.Template.Initialize_Handlers(parameters);
	
	/** materials **/
	libLEMA.Template.Initialize_Materials();
	
	/** buttons **/
	libLEMA.Template.Initialize_Buttons();
	
	/** activity hint **/
	libLEMA.Template.Initialize_Hint();
	
	/** sounds **/
	libLEMA.Template.Initialize_Sounds();
	
	/** title **/
	libLEMA.Template.Initialize_Title(parameters.title);
	
	/** lawn **/
	libLEMA.Template.Initialize_Lawn();
	
	/** mouse **/
	libLEMA.Mouse.Initialize();
	
	/** activity main clock **/
	libLEMA.Template.clock = new Clock();
	libLEMA.Template.clock.start();
	
	/** READY **/
	libLEMA.Template.ready = true;
	console.log("READY:", "libLEMA.Template", Date.now() - time);
};

/** libLEMA.Template.Initialize_ProgramAndScene
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_ProgramAndScene = function (parameters) {
	libLEMA.Template.activity_program = parameters.activity_program;
	libLEMA.AssertType(
		"parameters.activity_program",
		libLEMA.Template.activity_program,
		"Program"
	);
	
	libLEMA.Template.scene = libLEMA.Template.activity_program.scene;
	libLEMA.AssertType(
		"activity_program.scene",
		libLEMA.Template.scene,
		"Scene"
	);
	libLEMA.Activity.ShowScene(false);
	
	libLEMA.Template.libLEMA_program = parameters.libLEMA_program;
	libLEMA.AssertType(
		"parameters.libLEMA_program",
		libLEMA.Template.libLEMA_program,
		"Program"
	);
	
	libLEMA.Template.camera = libLEMA.Template.scene.cameras[0];
	libLEMA.AssertType(
		"activity_program.scene.cameras[0]",
		libLEMA.Template.camera,
		"OrthographicCamera"
	);

	libLEMA.Template.raycaster = libLEMA.Template.scene.raycaster;
	libLEMA.AssertTypeOf(
		"activity_program.scene.raycaster",
		libLEMA.Template.raycaster,
		"object"
	);
	
	/** **/
	
	libLEMA.Template.canvas =
		libLEMA.Template.activity_program.renderer.domElement;

	libLEMA.Template.camera2canvas_ratio =
		libLEMA.Template.camera.size / libLEMA.Template.canvas.height;
		
	/** **/
	
	libLEMA.Activity.program = libLEMA.Template.activity_program;
	libLEMA.Activity.scene = libLEMA.Template.scene;
	libLEMA.Activity.screen = libLEMA.Template.screen;
	libLEMA.Activity.canvas = libLEMA.Template.canvas;
	libLEMA.Activity.camera = libLEMA.Template.camera;
	libLEMA.Activity.camera_aspect = libLEMA.Template.camera_aspect;
	libLEMA.Activity.camera2canvas_ratio = libLEMA.Template.camera2canvas_ratio;
	libLEMA.Activity.DEFAULT_CAMERA_SIZE = libLEMA.Template.camera.size;
};

/** libLEMA.Template.Initialize_Handlers
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_Handlers = function (parameters) {
	var k, idx;
	
	/** client functions that handle button clicks **/
	libLEMA.Template.onClickButtonHandle = parameters.onClickButtonHandle;
	libLEMA.AssertTypeOf(
		"parameters.onClickButtonHandle",
		libLEMA.Template.onClickButtonHandle,
		"object"
	);
	for (idx = 0; idx < libLEMA.Template.lst_buttons.length; idx++) {
		k = "btn_" + libLEMA.Template.lst_buttons[idx];
		libLEMA.AssertTypeOf(
			"parameters.onClickButtonHandle." + libLEMA.Template.lst_buttons[idx],
			libLEMA.Template.onClickButtonHandle[k],
			"function"
		);
	}
	
	/** client functions that handle ... things **/
	libLEMA.Template.onHandle = parameters.onHandle;
	libLEMA.AssertTypeOf(
		"parameters.onHandle",
		libLEMA.Template.onHandle,
		"object"
	);
	for (idx = 0; idx < libLEMA.Template.lst_handlers.length; idx++) {
		k = "on_" + libLEMA.Template.lst_handlers[idx];
		libLEMA.AssertTypeOf(
			"parameters.onHandle." + libLEMA.Template.lst_handlers[idx],
			libLEMA.Template.onHandle[k],
			"function"
		);
	}
};

/** libLEMA.Template.Initialize_Hint
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_Hint = function () {
	libLEMA.Activity.hint = libLEMA.Template.activity_hint;
	var hint = libLEMA.Template.activity_hint, ok;
	
	hint.container = libLEMA.Template.scene.getObjectByName("activity_hint");
	ok = libLEMA.AssertContainer("activity_hint", hint.container);
	
	hint.information = hint.container.getObjectByName("hint_information");
	ok = libLEMA.AssertContainer("hint_information", hint.information);
	
	hint.background = hint.container.getObjectByName("background");
	ok = libLEMA.AssertType("activity_hint.background", hint.background, "Mesh");
	
	hint.container.visible = false;
	
	if (hint.container.position.z < 5) {
		console.warn("activity_hint.position.z set to 5");
		hint.container.position.z = 5;
	}
	if (hint.background.position.x !== 0) {
		console.warn("activity_hint.background.position.x set to 0");
		hint.background.position.x = 0;
	}
	if (hint.background.position.y !== 0) {
		console.warn("activity_hint.background.position.y set to 0");
		hint.background.position.y = 0;
	}
	if (hint.background.scale.x < 2 * libLEMA.Template.btn.spacing + 3 * libLEMA.Template.btn.scale.x) {
		hint.background.scale.x = 2 * libLEMA.Template.btn.spacing + 3 * libLEMA.Template.btn.scale.x;
	}
	hint.delta.x = hint.background.scale.x / 2 + libLEMA.Template.btn.spacing;
	hint.delta.y =
		libLEMA.Template.btn.spacing
		+ libLEMA.Template.btn.scale.y
		+ libLEMA.Template.btn.spacing
		+ hint.background.scale.y / 2;
};

/** libLEMA.Template.Initialize_Title
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_Title = function (txt) {
	libLEMA.Template.title = {
		text3d: libLEMA.Template.activity_program.getObjectByName("libLEMA_title"),
		size: 60
	};
	
	libLEMA.Template.title.clone = libLEMA.Template.title.text3d.children[0].clone();
	libLEMA.Template.title.clone.visible = false;
	libLEMA.Template.title.clone.scale.x = libLEMA.Template.title.text3d.children[0].scale.x;
	libLEMA.Template.title.clone.scale.y = libLEMA.Template.title.text3d.children[0].scale.y;
	libLEMA.Template.title.clone.scale.z = libLEMA.Template.title.text3d.children[0].scale.z;
	scene.add(libLEMA.Template.title.clone);
	
	if (typeof txt == "string") {
		libLEMA.Template.SetTitle(txt);
	}
};

/** libLEMA.Template.SetTitle
  * ------------------------------------------------------------
  **/

libLEMA.Template.SetTitle = function (txt) {
	if (typeof txt != "string") {
		return;
	}
	txt = txt.replace(/\n/g, " ");
	libLEMA.Template.title.text_1 = txt;
	libLEMA.Template.title.text_2 = null;
	libLEMA.Template.title.text_1w = null;
	libLEMA.Template.title.text_2w = null;
	libLEMA.Template.title.factor = null;
	return libLEMA.Template.Title_Apply();
};

libLEMA.Template.Title_Apply = function () {
	var text3d = libLEMA.Template.title.text3d;
	var text3d_0 = text3d.children[0];
	var text3d_1 = text3d.children[1];
	var clone = libLEMA.Template.title.clone;
	
	/** try 1 line, full size **/
	var txt = libLEMA.Template.title.text_1;
	clone.size = libLEMA.Template.title.size;
	clone.setText(txt);
	if (!libLEMA.Template.title.text_1w) {
		libLEMA.Template.title.text_1w = libLEMA.Tools.GetTextDimension(clone).x;
	}
	var width = libLEMA.Template.title.text_1w;
	
	if (width > libLEMA.Template.btn.dst) {
		/** cannot fit in 1 line, make 2 lines **/
		if (!libLEMA.Template.title.text_2) {
			libLEMA.Template.title.text_2 =
				libLEMA.Template.Title_Split(libLEMA.Template.title.text_1);
		}
		/** try 2 lines, full size **/
		txt = libLEMA.Template.title.text_2;
		clone.setText(txt);
		if (!libLEMA.Template.title.text_2w) {
			libLEMA.Template.title.text_2w = libLEMA.Tools.GetTextDimension(clone).x;
		}
		width = libLEMA.Template.title.text_2w;
		var use_factor = true, n = 0;
		while (width > libLEMA.Template.btn.dst) {
			n += 1;
			if (!libLEMA.Template.title.factor) {
				clone.size = Math.min(libLEMA.Template.title.size, Math.floor(width * 10));
				libLEMA.Template.title.factor = clone.size / libLEMA.Template.btn.dst;
			} else if (libLEMA.Template.title.factor && use_factor) {
				clone.size = Math.floor(libLEMA.Template.btn.dst * libLEMA.Template.title.factor);
				use_factor = false;
			} else {
				clone.size -= 1;
			}
			if (clone.size == 1) {
				break;
			}
			clone.setText(txt);
			width = libLEMA.Tools.GetTextDimension(clone).x;
		}
	} else {
		libLEMA.Template.title.length = txt.length;
	}
	
	/** calculations done... **/
	libLEMA.Template.title.factor = clone.size / libLEMA.Template.btn.dst;	
	//console.log("dst:", libLEMA.Template.btn.dst, "width:", width, "size:", clone.size, "factor: ", libLEMA.Template.title.factor, "n:", n);
	
	/** apply **/
	text3d_0.size = clone.size;
	text3d_1.size = clone.size;
	text3d_0.setText(txt);
	text3d_1.setText(txt);
	text3d.visible = true;
	return n;
};

libLEMA.Template.Title_Split = function (txt) {
	var idx = 0, linha_1, linha_2;
	var partes = txt.split(" ");
	/** calculate idx **/
	do {
		idx += 1;
		linha_1 = partes.slice(0, -idx).join(" ");
		linha_2 = partes.slice(-idx).join(" ");
	} while (linha_2.length < linha_1.length);
	idx -= 1;
	/** apply idx **/
	linha_1 = partes.slice(0, -idx).join(" ");
	linha_2 = partes.slice(-idx).join(" ");
	return linha_1 + "\n" + linha_2;
	
};

/** libLEMA.Template.Initialize_Lawn
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_Lawn = function () {
	libLEMA.Template.lawn =
		libLEMA.Template.activity_program.getObjectByName("libLEMA_lawn");
	libLEMA.Template.lawn.visible = false;
};

/** libLEMA.Template.Initialize_Buttons
  * ------------------------------------------------------------
  * Creates:
  *		libLEMA.Template.buttons.BTN_NAME = {
  *			container: button container
  *			background: button background object (plane)
  *			sprite: button image object (sprite)
  *			//text: button text object (text3d)
  *			nr_clicks: counter
  *		}
  *		//libLEMA.Template.materials.(BTN_NAME + "_on")
  *		//libLEMA.Template.materials.(BTN_NAME + "_off")
  *		libLEMA.Template.materials.(BTN_NAME)
  **/
libLEMA.Template.Initialize_Buttons = function () {
	var container = libLEMA.Template.activity_program.getObjectByName("libLEMA_buttons");
	var idx, k, e, btn;
	for (idx in libLEMA.Template.lst_buttons) {
		k = "btn_" + libLEMA.Template.lst_buttons[idx];
		e = container.getObjectByName(k);
		libLEMA.Template.buttons[k] = {
			name: e.name, // e.name == k
			container: e,
			background: e.getObjectByName("background"),
			sprite: e.getObjectByName("sprite"),
			//text: e.getObjectByName("text"),
			hover_time: 0,
			click_time: 0,
			nr_clicks: 0,
			on: false
		};
		libLEMA.Template.lst_hover_elements.push(libLEMA.Template.buttons[k].background);
		if (libLEMA.Template.buttons[k].sprite) {
			btn = libLEMA.Template.buttons[k];
			if (!Boolean(idx === 0)) { // typeof idx == 'string'
				/** DEFINE: btn.scale, btn.spacing **/
				libLEMA.Template.btn.scale = btn.background.scale;
				libLEMA.Template.btn.spacing = libLEMA.Template.btn.scale.x / 5;
			} else { /** buttons should have the same size **/
				btn.background.scale.x = libLEMA.Template.btn.scale.x;
				btn.background.scale.y = libLEMA.Template.btn.scale.y;
			}
			/** button's material **/
			libLEMA.Template.materials[k] =
				libLEMA.Template.libLEMA_program.getMaterialByName(k);
			/** button's HIGHLIGHT ON material **/
			// e = k + "_on";
			// libLEMA.Template.materials[e] =
				// libLEMA.Template.libLEMA_program.getMaterialByName(e);
			/** button's HIGHLIGHT OFF material **/
			// e = k + "_off";
			// libLEMA.Template.materials[e] =
				// libLEMA.Template.libLEMA_program.getMaterialByName(e);
		}
	}
	/** make HINT triangle **/
	var hint = libLEMA.Template.buttons.btn_hint.container;
	hint.triangle = libLEMA.Tools.MakePolygonMesh(
		3,
		-libLEMA.Math.PI_OVER_6,
		libLEMA.Template.materials.clr_white
	);
	hint.triangle.name = "hint_triangle";
	hint.triangle.scale.x = 0.25;
	hint.triangle.scale.y = 0.25;
	hint.triangle.position.x = 0;
	hint.triangle.position.y -= (1 * hint.triangle.scale.y + libLEMA.Template.btn.scale.y / 2);
	hint.triangle.visible = false;
	hint.add(hint.triangle);
	/** undo **/
	libLEMA.Template.buttons.btn_undo.container.visible = libLEMA.Template.show_undo;
	/** submit **/
	libLEMA.Template.submit_nr_clicks = 0;
	/** ready **/
	container.visible = true;
};

/** libLEMA.Template.Initialize_Materials
  * ------------------------------------------------------------
	Colors:
	- sky			BFE1F4
	- highlight		FDA600
	- lawn			A6D054
	- bg_on			5B87C5
  **/

 libLEMA.Template.Initialize_Materials = function () {
	var idx, k;
	for (idx in libLEMA.Template.lst_materials) {
		k = libLEMA.Template.lst_materials[idx];
		libLEMA.Template.materials[k] =
			libLEMA.Template.libLEMA_program.getMaterialByName(k);
	}
};

/** libLEMA.Template.Initialize_Sounds
  * ------------------------------------------------------------
  **/

libLEMA.Template.Initialize_Sounds = function () {
	var program = libLEMA.Template.activity_program;
	var container = program.getObjectByName("libLEMA_sounds");
	var idx, k;
	for (idx in libLEMA.Template.lst_sounds) {
		k = "snd_" + libLEMA.Template.lst_sounds[idx];
		libLEMA.Template.sounds[k] = container.getObjectByName(k);
	}
};

/** libLEMA.Template.GetObjectByName
  * ------------------------------------------------------------
  **/

libLEMA.Template.GetObjectByName = function (obj_name) {
	var obj = null;
	if (obj_name == "title") {
		obj = libLEMA.Template.title;
	} else if (obj_name == "lawn") {
		obj = libLEMA.Template.lawn;
	}
	return obj;
};

/** libLEMA.Template.Update
  * ------------------------------------------------------------
  **/

libLEMA.Template.Update = function () {
	if (libLEMA.Activity.paused) {
		return;
	}
	/** what MIGHT change? camera.aspect **/
	libLEMA.Template.resized = 
		libLEMA.Template.camera.aspect - libLEMA.Template.camera_aspect;
	if (libLEMA.Template.resized || libLEMA.Template.force_resize) {
		if (libLEMA.Template.force_resize) {
			libLEMA.Template.force_resize = false;
		} else {
			/** this might activate a 'force_resize' **/
			libLEMA.Activity.SetCameraSize();
		}
		libLEMA.Template.resize_change = true;
		libLEMA.Template.title.text3d.visible = false;
		libLEMA.Template.Update_Position();
		/** call aplication handler function **/
		libLEMA.Template.onHandle.on_resize();
	} else {
		if (libLEMA.Template.resize_change) {
			clearTimeout(libLEMA.Template.resize_timer);
			libLEMA.Template.resize_timer = setTimeout(
				libLEMA.Template.Title_Apply,
				10 * libLEMA.Const.DEFAULT_FRAME_TIME
			);
		}
		libLEMA.Template.resize_change = false;
	}
	/** react on mouse hovering and clicking buttons **/
	libLEMA.Template.Update_Mouse();
};

/** libLEMA.Template.Update_Position
  * ------------------------------------------------------------
  **/

libLEMA.Template.Update_Position = function () {
	var camera = libLEMA.Template.camera;
	
	libLEMA.Template.camera_aspect =
	libLEMA.Activity.camera_aspect =
		camera.aspect;
	
	libLEMA.Template.camera2canvas_ratio =
	libLEMA.Activity.camera2canvas_ratio = 
		camera.size / libLEMA.Template.canvas.height;
	
	/** screen: width, height, left, right, top, bottom **/
	libLEMA.Template.screen.width =
		camera.size * camera.aspect;
		
	libLEMA.Template.screen.height =
		camera.size;
	
	libLEMA.Template.screen.left =
		camera.position.x - libLEMA.Template.screen.width / 2;
	
	libLEMA.Template.screen.right =
		camera.position.x + libLEMA.Template.screen.width / 2;
	
	libLEMA.Template.screen.top =
		camera.position.y + libLEMA.Template.screen.height / 2;
	
	libLEMA.Template.screen.bottom =
		camera.position.y - libLEMA.Template.screen.height / 2;
		
	libLEMA.Template.screen.center = {
		x: (libLEMA.Template.screen.width / 2) - camera.position.x,
		y: (libLEMA.Template.screen.height / 2) + camera.position.y
	};
	
	var btn;
	var y = libLEMA.Template.screen.top;
	y -= (libLEMA.Template.btn.scale.y / 2 + libLEMA.Template.btn.spacing);
	
	//Set TITLE position
	libLEMA.Template.title.text3d.position.y = (y - libLEMA.Template.btn.scale.y / 2 + libLEMA.Template.btn.spacing) * 1.02;
	libLEMA.Template.title.text3d.position.x = libLEMA.Template.screen.left + 2 * libLEMA.Template.btn.spacing + libLEMA.Template.btn.scale.x;

	//Set SOUND button  position
	btn = libLEMA.Template.buttons.btn_sound.container;
	btn.position.x = libLEMA.Template.screen.left + (libLEMA.Template.btn.scale.x / 2 + libLEMA.Template.btn.spacing);
	btn.position.y = y;
	
	//Set RESTART button position
	var x = libLEMA.Template.screen.right;
	x -= (libLEMA.Template.btn.scale.x / 2 + libLEMA.Template.btn.spacing);
	btn = libLEMA.Template.buttons.btn_restart.container;
	btn.position.x = x;
	btn.position.y = y;
	
	//Set UNDO button position (relative to RESTART button)
	if (libLEMA.Template.show_undo) {
		x -= (libLEMA.Template.btn.scale.x + libLEMA.Template.btn.spacing);
		btn = libLEMA.Template.buttons.btn_undo.container;
		btn.position.x = x;
		btn.position.y = y;
	}

	//Set HINT button position (relative to RESTART button)
	x -= (libLEMA.Template.btn.scale.x + libLEMA.Template.btn.spacing);
	btn = libLEMA.Template.buttons.btn_hint.container;
	btn.position.x = x;
	btn.position.y = y;

	//Set SUBMIT button position
	// btn = libLEMA.Template.buttons.btn_submit.container;
	// btn.position.y = libLEMA.Template.screen.bottom + (libLEMA.Template.btn.spacing + libLEMA.Template.buttons.btn_submit.background.scale.y / 2);
	// btn.position.x = libLEMA.Template.screen.right - (libLEMA.Template.btn.spacing + libLEMA.Template.buttons.btn_submit.background.scale.x / 2);
	
	//Set ACTIVITY HINT position (relative to HINT button)
	btn = libLEMA.Template.buttons.btn_hint.container;
	var hint = libLEMA.Template.activity_hint;
	hint.container.position.x = libLEMA.Template.screen.right - hint.delta.x;
	hint.container.position.y = libLEMA.Template.screen.top - hint.delta.y;
	
	libLEMA.Template.btn.dst = Math.abs(libLEMA.Template.title.text3d.position.x);
	libLEMA.Template.btn.dst += libLEMA.Template.buttons.btn_hint.container.position.x;
	libLEMA.Template.btn.dst -= libLEMA.Template.btn.scale.x / 2;
	libLEMA.Template.btn.dst -= libLEMA.Template.btn.spacing;
	
	/*
	if (!libLEMA.Template.linha) {
		libLEMA.Template.linha = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			libLEMA.Template.materials.clr_highlight
		);
		libLEMA.Template.linha.scale.y = 0.1;
		libLEMA.Template.scene.add(libLEMA.Template.linha);
	}
	libLEMA.Template.linha.scale.x = libLEMA.Template.btn.dst;
	libLEMA.Template.linha.position.x =
		libLEMA.Template.title.text3d.position.x + libLEMA.Template.linha.scale.x / 2;
	libLEMA.Template.linha.position.y = libLEMA.Template.title.text3d.position.y;
	libLEMA.Template.linha.position.y = libLEMA.Template.screen.top - libLEMA.Template.btn.spacing;
	*/
};

/** libLEMA.Template.Update_Mouse
  * ------------------------------------------------------------
  * Updates: libLEMA.Template.mouse_over_button
  **/

libLEMA.Template.Update_Mouse = function () {
	var btn, btn_name;
	var hover_element = libLEMA.Tools.MouseOverObjectList(
		libLEMA.Template.lst_hover_elements
	);
	libLEMA.Template.mouse_over_button = (hover_element !== null);
	if (hover_element) { /** user is hovering a button **/
		var now = Date.now();
		btn_name = hover_element.parent.name;
		if (hover_element != libLEMA.Template.hover_element) {
			btn = libLEMA.Template.buttons[btn_name];
			btn.background.material = libLEMA.Template.materials.btn_bg_hover;
			if (now - btn.hover_time > libLEMA.Template.mouse_dt) {
				btn.hover_time = now;
				libLEMA.Template.on_HoverButton(btn, btn_name);
			}
			// if (btn.sprite) {
				// btn.sprite.material =
					// libLEMA.Template.materials[hover_element.parent.name + "_on"];
			// }
			libLEMA.Template.hover_element = hover_element;
		}
		if(libLEMA.Mouse.just_pressed) {
			btn = libLEMA.Template.buttons[btn_name];
			if (now - btn.click_time > libLEMA.Template.mouse_dt) {
				btn.click_time = now;
				libLEMA.Template.on_ClickButton(btn, btn_name);
			}
		}
	} else { /** user is NOT hovering a button **/
		if (libLEMA.Template.hover_element) {
			btn_name = libLEMA.Template.hover_element.parent.name;
			btn = libLEMA.Template.buttons[btn_name];
			
			if (btn.on) {
				btn.background.material = libLEMA.Template.materials.btn_bg_on;
			} else {
				btn.background.material = libLEMA.Template.materials.btn_bg_off;
			}
			
			// if (btn.sprite && !btn.on) {
				// btn.sprite.material =
					// libLEMA.Template.materials[
						// libLEMA.Template.hover_element.parent.name + "_off"
					// ];
			// }
			libLEMA.Template.hover_element = null;
		}
	}
};

/** libLEMA.Template.Button_Sync
  * ------------------------------------------------------------
  **/

libLEMA.Template.Button_Sync = function (btn, mode) {
	if (typeof btn == "string") {
		btn = libLEMA.Template.buttons[btn];
	}
	if (mode != btn.on) {
		btn.on = mode;
		libLEMA.Template.Button_Update(btn);
	}
};

/** libLEMA.Template.Button_Update
  * ------------------------------------------------------------
  **/

libLEMA.Template.Button_Update = function (btn) {
	if (btn.on) {
		btn.background.material = libLEMA.Template.materials.btn_bg_on;
	} else {
		btn.background.material = libLEMA.Template.materials.btn_bg_off;
	}
	// if (btn.sprite) {
		// if (btn.on) {
			// btn.sprite.material =
				// libLEMA.Template.materials[btn.name + "_on"];
		// } else {
			// btn.sprite.material =
				// libLEMA.Template.materials[btn.name + "_off"];
		// }
	// }
};


/** libLEMA.Template.onClickSubmit
  * ------------------------------------------------------------
  **/

libLEMA.Template.onClickSubmit = function () {
	libLEMA.Template.submit_nr_clicks += 1;
	/** call aplication handler function **/
	libLEMA.Template.onClickButtonHandle.btn_submit.call(
		libLEMA.Template.activity_program
	);
};

/** libLEMA.Template.on_ClickButton
  * ------------------------------------------------------------
  **/

libLEMA.Template.on_ClickButton = function (btn, btn_name) {
	console.info("libLEMA.Template.on_ClickButton:", btn_name);
	if (!btn.container.visible) {
		return;
	}
	
	if (btn_name == "btn_restart" && Keyboard.keyPressed(Keyboard.CTRL)) {
		var level = prompt("Restart: LEVEL?", libLEMA.Activity.lemaApp.level);
		level = parseInt(level);
		if (!isNaN(level)) {
			libLEMA.Activity.Restart(level);
			return;
		}
	}
	if (btn_name == "btn_sound" && Keyboard.keyPressed(Keyboard.CTRL)) {
		libLEMA.Template.onClickSubmit();
		return;
	}
	
	btn.nr_clicks += 1;
	// if (btn_name != "btn_restart" && btn_name != "btn_undo" && btn_name != "btn_submit") {
	if (btn_name != "btn_restart" && btn_name != "btn_undo") {
		libLEMA.Template.Button_Sync(btn, !btn.on);
	}
	if (btn_name == "btn_restart") {
		libLEMA.Template.clock.stop();
		libLEMA.Template.clock.start();
	} else if (btn_name == "btn_hint") {
			var visible = (btn.nr_clicks % 2 !== 0);
			btn.container.triangle.visible = visible;
			libLEMA.Template.activity_hint.container.visible = visible;
	}
	/** call aplication handler function **/
	libLEMA.Template.onClickButtonHandle[btn_name].call(
		libLEMA.Template.activity_program, btn
	);
};

/** libLEMA.Template.on_HoverButton
  * ------------------------------------------------------------
  **/

libLEMA.Template.on_HoverButton = function (btn, btn_name) {
	if (!btn.container.visible) {
		return;
	}
	// if (btn_name == "btn_submit") {
		// var audio_emitter = libLEMA.Template.sounds.snd_submit;
		// if (!audio_emitter.isPlaying) {
			// libLEMA.Sound.AudioEmitter_StopAndReset(); // stop if playing
			// libLEMA.Sound.AudioEmitter_SetAndPlay(audio_emitter);
		// }
	// }
};

/** libLEMA.Template.Activity*
  * ------------------------------------------------------------
  **/

libLEMA.Template.ActivitySubmitResult = libLEMA.Activity.SubmitResult;

libLEMA.Template.ActivityPause = libLEMA.Activity.Pause;

libLEMA.Template.ActivityResume = libLEMA.Activity.Resume;

libLEMA.Template.ActivityShowScene = libLEMA.Activity.ShowScene;

/** libLEMA.Template.Test
  * ------------------------------------------------------------
  *	Test libLEMA without a client activity
  **/

libLEMA.Template.Test = function () {
	libLEMA.Initialize();
	/** activity_hint **/ 
	var hint = new Container();
	hint.name = "activity_hint";
	scene.add(hint);
	/** activity_hint.hint_information **/ 
	var e = new Container();
	e.name = "hint_information";
	hint.add(e);
	/** activity_hint.background **/ 
	e = new THREE.Mesh(
		new THREE.PlaneGeometry(1, 1),
		program.getMaterialByName("clr_white")
	);
	e.scale.x = 6;
	e.scale.y = 3;
	e.name = "background";
	hint.add(e);
	/** parameters object **/
	var parameters = {
			activity_program: program,
			libLEMA_program: program,
			onClickButtonHandle: {},
			onHandle: {
				on_resize: function() {},
				on_restart: function() {}
			}
	};
	/** add click handlers to 'onClickButtonHandle' **/
	libLEMA.Template.TestOnClick = function (btn) {
		console.log("TestOnClick:", btn.name);
	};
	for (var k, idx = 0; idx < libLEMA.Template.lst_buttons.length; idx++) {
		k = "btn_" + libLEMA.Template.lst_buttons[idx];
		parameters.onClickButtonHandle[k] = libLEMA.Template.TestOnClick;
	}
	/** ready to initialize **/
	libLEMA.Template.Initialize(parameters);
	libLEMA.Template.activity_program.scene.visible = true;
	libLEMA.Template.SetTitle(Date());
	libLEMA.Activity.SetUpdate(new Script(), new Function());
	libLEMA.script.update = libLEMA.Update;
};

/** libLEMA.Template.ShowUndoButton
  * ------------------------------------------------------------
  **/

libLEMA.Template.ShowUndoButton = function (mode) {
	mode = (typeof mode == "undefined" ? true : Boolean(mode));
	libLEMA.Template.show_undo = mode;
	libLEMA.Template.buttons.btn_undo.container.visible = libLEMA.Template.show_undo;
	libLEMA.Template.Update_Position();
};

/** ############################################################
  *	libLEMA.Sound
  * ############################################################
  **/

libLEMA.Sound = {
	ready: false,
	audio_emitter: null, // current audio_emitter playing, if any
	emitters: {}, // 'list' of loaded audio_emitters,
	parent_container: null, // container for all loaded sounds,
	sequence: {
		on: false,
		lst_audio_emitters: null,
		idx: null,
		cnt: null,
		callback: null,
		name: null
	},
	lst_videos: [],
	sync_btn: null
};

/** libLEMA.Sound.Initialize
  * ------------------------------------------------------------
  **/

libLEMA.Sound.Initialize = function (parameters) {
	parameters = parameters || {container_name: 'activity_sounds'};
	console.info("libLEMA.Sound.Initialize");
	if (!(libLEMA.Template.activity_program instanceof Program)) {
		console.error(
			"libLEMA.Sound.Initialize",
			">> 'activity_program' is not a Program"
		);
		return false;
	}
	var container =
		libLEMA.Template.activity_program.getObjectByName("activity_sounds");
	var ok = libLEMA.AssertContainer("activity_sounds", container);
	if (!ok) {
		return false;
	}
	
	libLEMA.Sound.container = container;
	libLEMA.Sound.ready = true;
	console.log("READY:", "libLEMA.Sound");
	return true;
};

/** libLEMA.Sound.RegisterHTMLVideoElement
  * ------------------------------------------------------------
  **/

libLEMA.Sound.RegisterHTMLVideoElement = function (video) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.RegisterHTMLVideoElement",
			">> libLEMA.Sound is not ready"
		);
		return null;
	}
	if (typeof video == "string") {
		var texture = libLEMA.Template.activity_program.getTextureByName(video);
		if (!texture) {
			console.error(
				"libLEMA.Sound.RegisterHTMLVideoElement",
				">> No such texture:", video
			);
			return null;
		}
		video = texture.image;
		/** **/
		video.autoplay = false;
		video.loop = false;
		video.pause();
		video.currentTime = 0;
	}
	if (!video || video.constructor != HTMLVideoElement) {
		console.error(
			"libLEMA.Sound.RegisterHTMLVideoElement",
			">> Not an HTMLVideoElement"
		);
		console.log(video);
		return null;
	}
	libLEMA.Sound.lst_videos.push(video);
	return video;
};


/** libLEMA.Sound.LoadByURL
  * ------------------------------------------------------------
  **/

libLEMA.Sound.LoadByURL = function (emitter_name, url, callback) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.LoadByURL",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	if (typeof emitter_name != "string" || emitter_name.length === 0) {
		console.error(
			"libLEMA.Sound.LoadByURL",
			">> 'emitter_name' is not a String"
		);
		return false;
	}
	if (typeof url != "string" || url.length === 0) {
		console.error(
			"libLEMA.Sound.LoadByURL",
			">> 'url' is not a String"
		);
		return false;
	}
	
	console.info(
		"libLEMA.Sound.LoadByURL",
		">> ", emitter_name, url
	);
	var audio_emitter = new AudioEmitter();
	audio_emitter.autoplay = false;
	audio_emitter.loop = false;
	audio_emitter.name = emitter_name;
	libLEMA.Sound.emitters[emitter_name] = audio_emitter;
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load(
		url,
		function(buffer) {
			audio_emitter.setBuffer(buffer);
			console.log("libLEMA.Sound.LoadByURL >> ready:", emitter_name);
			if (typeof callback == "function") {
				callback(emitter_name);
			}
		}
	);
	return true;
};

/** libLEMA.Sound.LoadByName
  * ------------------------------------------------------------
  **/

libLEMA.Sound.LoadByName = function (emitter_name) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.LoadByName",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	var audio_emitter =
		libLEMA.Sound.container.getObjectByName(emitter_name);
	if (!(audio_emitter instanceof AudioEmitter)) {
		console.error(
			"libLEMA.Sound.LoadByName",
			">> no such AudioEmitter:", emitter_name
		);
		return false;
	}
	libLEMA.Sound.emitters[emitter_name] = audio_emitter;
	console.info("libLEMA.Sound.LoadByName:", emitter_name);
	return true;
};

/** libLEMA.Sound.LoadByNameList
  * ------------------------------------------------------------
  **/

libLEMA.Sound.LoadByNameList = function (lst_emitter_names) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.LoadByNameList",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	if (!(lst_emitter_names instanceof Array)) {
		console.error(
			"libLEMA.Sound.LoadByNameList",
			">> 'lst_emitter_names' is not an Array"
		);
		return false;
	}
	var status = true, idx;
	for (idx = 0; idx < lst_emitter_names.length; idx++) {
		status = status && libLEMA.Sound.LoadByName(
			lst_emitter_names[idx],
			parent_container
		);
	}
	return status;
};

/** libLEMA.Sound.LoadAll
  * ------------------------------------------------------------
  **/

libLEMA.Sound.LoadAll = function (parent_container) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.LoadAll",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	var idx, child, status = true;
	for (idx = 0; idx < libLEMA.Sound.container.children.length; idx++) {
		child = libLEMA.Sound.container.children[idx];
		status = status && libLEMA.Sound.LoadByName(child.name);
	}
	return status;
};

/** libLEMA.Sound.LoadNumber
  * ------------------------------------------------------------
  **/

libLEMA.Sound.LoadNumber = function (nr, emitter_name) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.LoadNumber",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	if (typeof nr != "number" || nr < 0) {
		console.error(
			"libLEMA.Sound.LoadNumber",
			">> 'nr' is not a Number"
		);
		return false;
	}
	if (typeof emitter_name != "string") {
		console.error(
			"libLEMA.Sound.LoadNumber",
			">> 'name' is not a String"
		);
		return false;
	}
	if (typeof libLEMA.official_url != "string") {
		console.error(
			"libLEMA.Sound.LoadNumber",
			">> 'libLEMA.official_url' is not defined"
		);
		return false;
	}
	
	console.info("libLEMA.Sound.LoadNumber:", nr, emitter_name);
	
	var url = libLEMA.official_url;
	url = url.substring(0, url.lastIndexOf("/"));
	url += "/audio/snd_nr_" +  nr + ".mp3";
	libLEMA.Sound.LoadByURL(emitter_name, url);
	return true;
};


/** ------------------------------------------------------------
  *	libLEMA.Sound.PlayByName
  * ------------------------------------------------------------
  *	callback: this == audio_emitter, arg1 == emitter_name
  **/

libLEMA.Sound.PlayByName = function (emitter_name, callback) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.PlayByName",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	var audio_emitter = libLEMA.Sound.emitters[emitter_name];
	if (!(audio_emitter instanceof AudioEmitter)) {
		console.error(
			"libLEMA.Sound.PlayByName",
			">> no such AudioEmitter:", emitter_name
		);
		return false;
	}
	console.info("libLEMA.Sound.PlayByName:", emitter_name);
	libLEMA.Sound.AudioEmitter_StopAndReset();
	libLEMA.Sound.AudioEmitter_SetAndPlay(audio_emitter, callback);
	return true;
};

/** libLEMA.Sound.TogglePlayByNameList
  * ------------------------------------------------------------
  *	Play sounds in sequence
  **/

libLEMA.Sound.TogglePlayByNameList = function (sequence_name, lst_emitter_names, callback) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.TogglePlayByNameList",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	if (typeof sequence_name != "string") {
		console.error(
			"libLEMA.Sound.TogglePlayByNameList",
			">> 'sequence_name' is not a String"
		);
		return false;
	}
	if (!(lst_emitter_names instanceof Array)) {
		console.error(
			"libLEMA.Sound.TogglePlayByNameList",
			">> 'lst_emitter_names' is not an Array"
		);
		return false;
	}
	if (libLEMA.Sound.sequence.on && libLEMA.Sound.sequence.name != sequence_name) {
		console.error(
			"libLEMA.Sound.TogglePlayByNameList",
			">> already playing a sequence:",
			libLEMA.Sound.sequence.name
		);
		return false;
	}
	
	/** ok to go **/
	console.info(
		"libLEMA.Sound.TogglePlayByNameList", 
		">>",
		sequence_name,
		":",
		lst_emitter_names
	);
	
	if (libLEMA.Sound.sequence.on && libLEMA.Sound.sequence.name == sequence_name) {
		/** this sequence IS playing: STOP it **/
		libLEMA.Sound.AudioEmitter_EndSequence(true);
	} else {
		/** this sequence IS NOT playing: PLAY it **/
		libLEMA.Sound.PlayByNameList(sequence_name, lst_emitter_names, callback);
	}
};

/** libLEMA.Sound.PlayByNameList
  * ------------------------------------------------------------
  *	Play sounds in sequence
  **/

libLEMA.Sound.PlayByNameList = function (sequence_name, lst_emitter_names, callback) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.PlayByNameList",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	if (typeof sequence_name != "string") {
		console.error(
			"libLEMA.Sound.PlayByNameList",
			">> 'sequence_name' is not a String"
		);
		return false;
	}
	if (!(lst_emitter_names instanceof Array)) {
		console.error(
			"libLEMA.Sound.PlayByNameList",
			">> 'lst_emitter_names' is not an Array"
		);
		return false;
	}
	if (libLEMA.Sound.sequence.on) {
		console.error(
			"libLEMA.Sound.PlayByNameList",
			">> already playing a sequence:",
			libLEMA.Sound.sequence.name
		);
		return false;
	}
	
	/** check all names for corresponding audio emitters **/
	var sequence = libLEMA.Sound.sequence, lst_names = [];
	sequence.lst_audio_emitters = [];
	var idx, emitter_name, audio_emitter, status = true;
	for (idx = 0; idx < lst_emitter_names.length; idx++) {
		emitter_name = lst_emitter_names[idx];
		audio_emitter = libLEMA.Sound.emitters[emitter_name];
		if (!(audio_emitter instanceof AudioEmitter)) {
			console.error(
				"libLEMA.Sound.PlayByNameList",
				">> no such AudioEmitter:", emitter_name
			);
			status = false;
		} else {
			sequence.lst_audio_emitters.push(audio_emitter);
			lst_names.push(emitter_name);
		}
	}
	
	if (status) {
		/** ok to go **/
		libLEMA.Sound.sequence.name = sequence_name;
		libLEMA.Sound.AudioEmitter_StopAndReset();
		console.info(
			"libLEMA.Sound.PlayByNameList", 
			">>",
			sequence_name,
			":",
			lst_names
		);
		sequence.on = true;
		sequence.idx = 0;
		sequence.cnt = sequence.lst_audio_emitters.length;
		sequence.callback = callback;
		libLEMA.Sound.AudioEmitter_PlaySequence();
	} else {
		/** no go **/
		libLEMA.Sound.AudioEmitter_EndSequence(); // undo settings
	}
	
	return status;
};

/** libLEMA.Sound.AudioEmitter_PlaySequence
  * ------------------------------------------------------------
  **/

libLEMA.Sound.AudioEmitter_PlaySequence = function () {
	if (libLEMA.Sound.sequence.idx == libLEMA.Sound.sequence.cnt) {
		/** sequence ended **/
		if (typeof libLEMA.Sound.sequence.callback == "function") {
			libLEMA.Sound.sequence.callback();
		}
		libLEMA.Sound.AudioEmitter_EndSequence();
	} else {
		/** play current item (and increment index) **/
		var audio_emitter =
			libLEMA.Sound.sequence.lst_audio_emitters[libLEMA.Sound.sequence.idx++];
		console.log(
			"libLEMA.Sound.Play_Sequence", 
			">>",
			libLEMA.Sound.sequence.idx,
			"/",
			libLEMA.Sound.sequence.cnt,
			":",
			audio_emitter.name
		);
		libLEMA.Sound.AudioEmitter_SetAndPlay(
			audio_emitter,
			libLEMA.Sound.AudioEmitter_PlaySequence
		);
	}
};

/** libLEMA.Sound.AudioEmitter_EndSequence
  * ------------------------------------------------------------
  **/

libLEMA.Sound.AudioEmitter_EndSequence = function (cancel) {
	if (cancel) {
		if (libLEMA.Sound.audio_emitter) {
			if (libLEMA.Sound.audio_emitter.isPlaying) {
				libLEMA.Sound.audio_emitter.stop();
			}
			libLEMA.Sound.audio_emitter = null;
		}
	}
	libLEMA.Sound.sequence.on = false;
	libLEMA.Sound.sequence.idx = null;
	libLEMA.Sound.sequence.cnt = null;
	libLEMA.Sound.sequence.lst_audio_emitters = null;
	libLEMA.Sound.sequence.callback = null;
	libLEMA.Sound.sequence.name = null;
};

/** libLEMA.Sound.StopIfPlayingByName
  * ------------------------------------------------------------
  **/

libLEMA.Sound.StopIfPlayingByName = function (emitter_name) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.StopIfPlayingByName",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	var audio_emitter = libLEMA.Sound.emitters[emitter_name];
	if (!(audio_emitter instanceof AudioEmitter)) {
		console.error(
			"libLEMA.Sound.StopIfPlayingByName",
			">> no such AudioEmitter:", emitter_name
		);
		return false;
	}
	if (libLEMA.Sound.audio_emitter == audio_emitter) {
		libLEMA.Sound.AudioEmitter_StopAndReset();
	}
	return false;
};

/** libLEMA.Sound.StopIfPlaying
  * ------------------------------------------------------------
  **/

libLEMA.Sound.StopIfPlaying = function () {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.StopIfPlaying",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	libLEMA.Sound.AudioEmitter_StopAndReset();
	return true;
};

/** libLEMA.Sound.TogglePlayByName
  * ------------------------------------------------------------
  **/

libLEMA.Sound.TogglePlayByName = function (emitter_name, callback) {
	if (!libLEMA.Sound.ready) {
		console.error(
			"libLEMA.Sound.TogglePlayByName",
			">> libLEMA.Sound is not ready"
		);
		return false;
	}
	var audio_emitter = libLEMA.Sound.emitters[emitter_name];
	if (!(audio_emitter instanceof AudioEmitter)) {
		console.error(
			"libLEMA.Sound.TogglePlayByName",
			">> no such AudioEmitter:", emitter_name
		);
		return false;
	}
	if (audio_emitter.isPlaying) {
		libLEMA.Sound.AudioEmitter_StopAndReset();
	} else {
		libLEMA.Sound.AudioEmitter_StopAndReset();
		libLEMA.Sound.AudioEmitter_SetAndPlay(audio_emitter);
	}
};

/** libLEMA.Sound.on_Ended
  * ------------------------------------------------------------
  **/

libLEMA.Sound.on_Ended = function () {
	this.isPlaying = false;
	console.log("libLEMA.Sound >> onEnded:", this.name);
	if (this.name.startsWith("snd_enunciado")) {
		libLEMA.Template.Button_Sync(libLEMA.Template.buttons.btn_sound, false);
	}
	if (typeof this.userData.callback == "function") {
		console.log("libLEMA.Sound >> client callback");
		this.userData.callback.call(this, this.name);
	}
};

/** libLEMA.Sound.AudioEmitter_SetAndPlay
  * ------------------------------------------------------------
  **/

libLEMA.Sound.AudioEmitter_SetAndPlay = function (audio_emitter, callback) {
	libLEMA.Sound.audio_emitter = audio_emitter;
	libLEMA.Sound.audio_emitter.userData.callback =
		(typeof callback == "function" ? callback : null);
	libLEMA.Sound.audio_emitter.onEnded =
		libLEMA.Sound.on_Ended.bind(libLEMA.Sound.audio_emitter);
	if (audio_emitter.name.startsWith("snd_enunciado")) {
		libLEMA.Template.Button_Sync(libLEMA.Template.buttons.btn_sound, true);
	}
	//libLEMA.Sound.audio_emitter.play();
	libLEMA.Sound.AudioEmitter_Play();
};

libLEMA.Sound.AudioEmitter_Play = function () {
	if (libLEMA.Sound.audio_emitter.buffer) {
		libLEMA.Sound.audio_emitter.play();
	} else {
		// var delay = 10 * libLEMA.Const.DEFAULT_FRAME_TIME;
		// console.warn(
			// "libLEMA.Sound.AudioEmitter_Play",
			// ">> no buffer:",
			// libLEMA.Sound.audio_emitter.name,
			// "[retry in " + delay + "ms]"
		// );
		// setTimeout(libLEMA.Sound.AudioEmitter_Play, delay);
		console.warn(
			"libLEMA.Sound.AudioEmitter_Play",
			">> no buffer:",
			libLEMA.Sound.audio_emitter.name
		);
	}
};

/** libLEMA.Sound.AudioEmitter_StopAndReset
  * ------------------------------------------------------------
  **/

libLEMA.Sound.AudioEmitter_StopAndReset = function () {
	if (libLEMA.Sound.sequence.on) {
		libLEMA.Sound.AudioEmitter_EndSequence(true);
		console.log(
			"libLEMA.Sound",
			">> sequence canceled"
		);
	}
	if (libLEMA.Sound.audio_emitter) {
		if (libLEMA.Sound.audio_emitter.isPlaying) {
			libLEMA.Sound.audio_emitter.stop();
		}
		libLEMA.Sound.audio_emitter = null;
	}
	/** **/
	if (libLEMA.Sound.lst_videos.length > 0) {
		var idx, video_sound;
		for (idx = 0; idx < libLEMA.Sound.lst_videos.length; idx++) {
			video_sound = libLEMA.Sound.lst_videos[idx];
			if (video_sound.currentTime > 0 && video_sound.currentTime < video_sound.duration) {
				video_sound.pause();
				video_sound.currentTime = 0;
			}
		}
	}
};

/** ############################################################
  *	libLEMA.Const
  * ############################################################
  **/

libLEMA.Const = {
	DEFAULT_FRAME_RATE: 60,
	DEFAULT_FRAME_TIME: 1E3 / 60
};

/** libLEMA.Const.MakeEnum
  * ------------------------------------------------------------
  **/

libLEMA.Const.MakeEnum = function (prefix, lst_names) {
	for (var idx = 0, name; idx < lst_names.length; idx++) {
		name = (prefix + "_" + lst_names[idx]).toUpperCase();
		if (libLEMA.Const[name] === undefined) {
			libLEMA.Const[name] = idx;
		} else {
			console.error(
				"libLEMA.Const.MakeEnum",
				">> already defined:",
				name
			);
		}
	}
};

/** ############################################################
  *	libLEMA.Tools
  * ############################################################
  **/

libLEMA.Tools = {
	lst_intersections: null,
	move_to: {
		DEFAULT_STEPS: 30,
		MAX_STEPS: 100,
		DELAY: libLEMA.Const.DEFAULT_FRAME_TIME,
		moving: false,
		timer: null
	},
};

/** ------------------------------------------------------------
  *	libLEMA.Tools.HorizontalRuler
  *	Draw an horozontal ruller on the javascript console (debug aid)
  * ------------------------------------------------------------
  **/

libLEMA.Tools.HorizontalRuler = function () {
	//console.log("============================================================");
	console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
};

/** libLEMA.Tools.ShallowCopy
  * ------------------------------------------------------------
  *	Make a SHALLOW copy of all obj_src properties to obj_dst
  **/

libLEMA.Tools.ShallowCopy = function(obj_src, obj_dst, reset, add) {
	var k;
	obj_dst = obj_dst || {};
	/** if requested, delete all obj_dst properties **/
	if (reset) {
		for (k in obj_dst) delete(obj_dst[k]);
	}
	/** SHALLOW COPY all obj_src properties to obj_dst **/
	for (k in obj_src) obj_dst[k] = obj_src[k];
	/** if requested, add some properties to obj_dst **/
	if (typeof add == "object") {
		for (k in add) obj_dst[k] = add[k];
	}
	/** done **/
	return obj_dst;
};

/** libLEMA.Tools.ShuffleArray
  * ------------------------------------------------------------
  *	Randomize array element order in-place.
  *	Uses Fisher-Yates shuffle algorithm.
  **/

libLEMA.Tools.ShuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

/** libLEMA.Tools.MouseOverObject
  * ------------------------------------------------------------
  *	Test raycasting over an object
  *	Return: first intersected object | null
  **/

libLEMA.Tools.MouseOverObject = function (object, recursive) {
	if (libLEMA.Keyboard.on) {
		libLEMA.Mouse.UpdateNDC1();
		libLEMA.Template.raycaster.setFromCamera(
			libLEMA.Mouse.ndc,
			libLEMA.Template.camera
		);
	} else if (libLEMA.Kinect.on) {
		libLEMA.Template.raycaster.setFromCamera(
			libLEMA.Kinect.ndc,
			libLEMA.Template.camera
		);
	}
	libLEMA.Tools.lst_intersections =
		libLEMA.Template.raycaster.intersectObject(object, Boolean(recursive));
	if (libLEMA.Tools.lst_intersections.length > 0) {
		return libLEMA.Tools.lst_intersections[0].object;
	}
	return null;
};

/** libLEMA.Tools.MouseOverObjectList
  * ------------------------------------------------------------
  *	Test raycasting over a list of objects
  *	Return: first intersected object | null
  **/

libLEMA.Tools.MouseOverObjectList = function (lst_objects, recursive) {
	if (libLEMA.Keyboard.on) {
		libLEMA.Mouse.UpdateNDC1();
		libLEMA.Template.raycaster.setFromCamera(
			libLEMA.Mouse.ndc,
			libLEMA.Template.camera
		);
	} else if (libLEMA.Kinect.on) {
		libLEMA.Template.raycaster.setFromCamera(
			libLEMA.Kinect.ndc,
			libLEMA.Template.camera
		);
	}
	libLEMA.Tools.lst_intersections =
		libLEMA.Template.raycaster.intersectObjects(lst_objects, Boolean(recursive));
	if (libLEMA.Tools.lst_intersections.length > 0) {
		return libLEMA.Tools.lst_intersections[0].object;
	}
	return null;
};

/** libLEMA.Tools.MakePolygonMesh
  * ------------------------------------------------------------
  **/

libLEMA.Tools.MakePolygonMesh = function (nr_sides, theta_start, material) {
	theta_start = parseFloat((theta_start !== undefined ) ? theta_start : 0);
	var geometry = new THREE.CircleGeometry(1, nr_sides, theta_start);
	var polygon = new THREE.Mesh(geometry, material);
	polygon.name = "polygon_" + nr_sides;
	return polygon;
};

/** libLEMA.Tools.GetWorldPosition
  * ------------------------------------------------------------
  * Return: THREE.Vector3
  **/

libLEMA.Tools.GetWorldPosition = function (object) {
	if (!object || !object.position) return null;
	var p = new THREE.Vector3(
		object.position.x,
		object.position.y,
		object.position.z
	);
	while (object.parent && object.parent.type != "Scene") {
		object = object.parent;
		if (!object || !object.position) return null;
		p.x += object.position.x;
		p.y += object.position.y;
		p.z += object.position.z;
	}
	return p;
};

libLEMA.Tools.GetTextDimension = function (text3d, scale) {
	scale = (typeof scale == "undefined" ? true : Boolean(scale));
	libLEMA.AssertType("text3d", text3d, "Text3D");
	var geometry = text3d.geometry;
	geometry.computeBoundingBox();
    var width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    var height = geometry.boundingBox.max.y - geometry.boundingBox.min.y;
	if (scale) {
		return new THREE.Vector2(width * text3d.scale.x, height * text3d.scale.y);
	} else {
		return new THREE.Vector2(width, height);
	}
};

/** libLEMA.Tools.MoveObjectTo
  * ------------------------------------------------------------
  **/

libLEMA.Tools.MoveObjectTo = function (object, position, callback, n) {
	console.assert(!libLEMA.Tools.move_to.moving);
	console.info("libLEMA.Tools.MoveObjectTo:", object.name);
	libLEMA.Tools.move_to.object = object;
	libLEMA.Tools.move_to.position = {x: position.x, y: position.y};
	libLEMA.Tools.move_to.callback = callback;
	n = parseInt(n) || libLEMA.Tools.move_to.DEFAULT_STEPS;
	if (n <= libLEMA.Tools.move_to.MAX_STEPS) {
		// FIXED steps
		libLEMA.Tools.move_to.steps = n;
	} else {
		// FIXED time
		libLEMA.Tools.move_to.steps = Math.round(n / libLEMA.Tools.move_to.DELAY);
	}
	libLEMA.Tools.move_to.delta = libLEMA.Tools.MoveObjectTo_Delta2Target(
		object.position, position, libLEMA.Tools.move_to.steps
	);
	setTimeout(
		libLEMA.Tools.MoveObjectTo_Step,
		libLEMA.Tools.move_to.DELAY
	);
	libLEMA.Tools.move_to.moving = true;
};

/** 
  * ------------------------------------------------------------
  **/

libLEMA.Tools.MoveObjectTo_Delta2Target = function (point, target, steps) {
	return {
		x: (target.x - point.x) / steps,
		y: (target.y - point.y) / steps
	};
};

/** 
  * ------------------------------------------------------------
  **/

libLEMA.Tools.MoveObjectTo_Step = function () {
	libLEMA.Tools.move_to.steps -= 1;
	if (libLEMA.Tools.move_to.steps >= 0) {
		libLEMA.Tools.move_to.object.position.x +=
			libLEMA.Tools.move_to.delta.x;
		libLEMA.Tools.move_to.object.position.y +=
			libLEMA.Tools.move_to.delta.y;
		libLEMA.Tools.move_to.timer = setTimeout(
			libLEMA.Tools.MoveObjectTo_Step,
			libLEMA.Tools.move_to.DELAY
		);
	} else {
		var object = libLEMA.Tools.move_to.object;
		console.info("libLEMA.Tools.MoveObjectTo >> Done:", object.name);
		object.position.x =
			libLEMA.Tools.move_to.position.x;
		object.position.y =
			libLEMA.Tools.move_to.position.y;
		libLEMA.Tools.move_to.object = null;
		libLEMA.Tools.move_to.moving = false;
		if (typeof libLEMA.Tools.move_to.callback == "function") {
			libLEMA.Tools.move_to.callback(object);
		}
	}
};

/** ############################################################
  *	libLEMA.Math
  * ############################################################
  **/

libLEMA.Math = {
	TWO_PI: Math.PI * 2,
	PI_TIMES_2: Math.PI * 2,
	HALF_PI: Math.PI / 2,
	PI_OVER_2: Math.PI / 2,
	PI_OVER_3: Math.PI / 3,
	PI_OVER_4: Math.PI / 4,
	PI_OVER_6: Math.PI / 6,
	PI_OVER_180: Math.PI / 180,
	PI_UNDER_180: 180 / Math.PI
};

/** libLEMA.Math.Deg2Rad
  * ------------------------------------------------------------
  **/

libLEMA.Math.Deg2Rad = function(degrees) {
	return degrees * libLEMA.Math.PI_OVER_180;
};

/** libLEMA.Math.Rad2Deg
  * ------------------------------------------------------------
  **/

libLEMA.Math.Rad2Deg = function(radians) {
	return radians * libLEMA.Math.PI_UNDER_180;
};

/** libLEMA.Math.RandomInt
  * ------------------------------------------------------------
  *	Return: random integer in the interval [min, max]
  **/

libLEMA.Math.RandomInt = function (min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
};

/** ############################################################
  *	libLEMA.DragAndDrop
  * ############################################################
  **/

libLEMA.DragAndDrop = {
	object: null,
	dragging: false,
	moving: false,
	on_release: null,
	move_to: {
		DEFAULT_STEPS: 30,
		delay: libLEMA.Const.DEFAULT_FRAME_TIME,
		timer: null
	},
	update: {x: null, y: null},
	delta: {},
	MAX_STEPS: 100,
	adjust_z: 1
};

/** libLEMA.DragAndDrop.Set
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.Set = function (object, on_release, ignore) {
	if (libLEMA.DragAndDrop.dragging) {
		return false;
	} else if (typeof object != "object") {
		return false;
	} else if (typeof object.position != "object") {
		return false;
	} else if (typeof on_release != "undefined" && typeof on_release != "function") {
		return false;
	} else {
		console.info("libLEMA.DragAndDrop.Set:", object.name);
		libLEMA.DragAndDrop.object = object;
		libLEMA.DragAndDrop.on_release = on_release;
		libLEMA.DragAndDrop.delta.t = Date.now();
		libLEMA.DragAndDrop.delta.x = object.position.x;
		libLEMA.DragAndDrop.delta.y = object.position.y;
		// adjust z position: bring object forward
		libLEMA.DragAndDrop.object.position.z += libLEMA.DragAndDrop.adjust_z;
		
		ignore = ignore || {};
		libLEMA.DragAndDrop.update.x = !Boolean(ignore.x);
		libLEMA.DragAndDrop.update.y = !Boolean(ignore.y);
		
		libLEMA.Mouse.element.material = libLEMA.Template.materials.m_hand_drag;

		libLEMA.DragAndDrop.dragging = true;
	}
	return true;
};

/** libLEMA.DragAndDrop.Update
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.Update = function () {
	if (libLEMA.Mouse.just_released) {
		clearTimeout(libLEMA.DragAndDrop.move_to.timer);
		libLEMA.DragAndDrop.on_Release();
	} else {
		if (libLEMA.DragAndDrop.update.x) {
			libLEMA.DragAndDrop.object.position.x +=
				libLEMA.Mouse.delta.x * libLEMA.Activity.camera2canvas_ratio;
		}
		if (libLEMA.DragAndDrop.update.y) {
			libLEMA.DragAndDrop.object.position.y -=
				libLEMA.Mouse.delta.y * libLEMA.Activity.camera2canvas_ratio;
		}
	}
};

/** libLEMA.DragAndDrop.on_Release
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.on_Release = function () {
	libLEMA.DragAndDrop.dragging = false;
	libLEMA.DragAndDrop.delta.t = Date.now() - libLEMA.DragAndDrop.delta.t;
	libLEMA.DragAndDrop.delta.x =
		libLEMA.DragAndDrop.object.position.x - libLEMA.DragAndDrop.delta.x;
	libLEMA.DragAndDrop.delta.y =
		libLEMA.DragAndDrop.object.position.y - libLEMA.DragAndDrop.delta.y;
	// adjust z position: bring object backward to original position
	libLEMA.DragAndDrop.object.position.z -= libLEMA.DragAndDrop.adjust_z;
	console.info("libLEMA.DragAndDrop >> Release:", libLEMA.DragAndDrop.object.name);
	if (typeof libLEMA.DragAndDrop.on_release == "function") {
		libLEMA.DragAndDrop.on_release(libLEMA.DragAndDrop.object, libLEMA.DragAndDrop.delta);
	}
	libLEMA.DragAndDrop.object = null;
};

/** libLEMA.DragAndDrop.ForceDrop
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.ForceDrop = function (callback) {
	libLEMA.DragAndDrop.dragging = false;
	
	libLEMA.DragAndDrop.delta.t = Date.now() - libLEMA.DragAndDrop.delta.t;
	
	libLEMA.DragAndDrop.delta.x =
		libLEMA.DragAndDrop.object.position.x - libLEMA.DragAndDrop.delta.x;
	
	libLEMA.DragAndDrop.delta.y =
		libLEMA.DragAndDrop.object.position.y - libLEMA.DragAndDrop.delta.y;
	
	console.info("libLEMA.DragAndDrop >> ForceDrop:", libLEMA.DragAndDrop.object.name);
	if (typeof callback == "function") {
		callback(libLEMA.DragAndDrop.object, libLEMA.DragAndDrop.delta);
	}
	libLEMA.DragAndDrop.object = null;
	libLEMA.Mouse.element.material = libLEMA.Template.materials.m_hand_on;
};

/** libLEMA.DragAndDrop.MoveObjectTo
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.MoveObjectTo = function (object, position, callback, n) {
	console.assert(!libLEMA.DragAndDrop.moving);
	console.info("libLEMA.DragAndDrop.MoveObjectTo:", object.name);
	libLEMA.DragAndDrop.move_to.object = object;
	libLEMA.DragAndDrop.move_to.position = {x: position.x, y: position.y};
	libLEMA.DragAndDrop.move_to.callback = callback;
	var steps = null;
	n = parseInt(n) || libLEMA.DragAndDrop.move_to.DEFAULT_STEPS;
	if (n <= libLEMA.DragAndDrop.MAX_STEPS) {
		// FIXED steps
		steps = n;
	} else {
		// FIXED time
		steps = Math.round(n / libLEMA.DragAndDrop.move_to.delay);
	}
	libLEMA.DragAndDrop.move_to.steps = steps;
	libLEMA.DragAndDrop.move_to.delta =
		libLEMA.DragAndDrop.MoveObjectTo_Delta2Target(object.position, position, steps);
	setTimeout(
		libLEMA.DragAndDrop.MoveObjectTo_Step,
		libLEMA.DragAndDrop.move_to.delay
	);
	libLEMA.DragAndDrop.moving = true;
};

libLEMA.DragAndDrop.MoveTo = libLEMA.DragAndDrop.MoveObjectTo;

/** 
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.MoveObjectTo_Delta2Target = function (point, target, steps) {
	return {
		x: (target.x - point.x) / steps,
		y: (target.y - point.y) / steps
	};
};

/** 
  * ------------------------------------------------------------
  **/

libLEMA.DragAndDrop.MoveObjectTo_Step = function () {
	libLEMA.DragAndDrop.move_to.steps -= 1;
	if (libLEMA.DragAndDrop.move_to.steps >= 0) {
		libLEMA.DragAndDrop.move_to.object.position.x +=
			libLEMA.DragAndDrop.move_to.delta.x;
		libLEMA.DragAndDrop.move_to.object.position.y +=
			libLEMA.DragAndDrop.move_to.delta.y;
		libLEMA.DragAndDrop.move_to.timer = setTimeout(
			libLEMA.DragAndDrop.MoveObjectTo_Step,
			libLEMA.DragAndDrop.move_to.delay
		);
	} else {
		var object = libLEMA.DragAndDrop.move_to.object;
		console.info("libLEMA.DragAndDrop.MoveObjectTo >> Done:", object.name);
		object.position.x =
			libLEMA.DragAndDrop.move_to.position.x;
		object.position.y =
			libLEMA.DragAndDrop.move_to.position.y;
		libLEMA.DragAndDrop.move_to.object = null;
		libLEMA.DragAndDrop.moving = false;
		if (typeof libLEMA.DragAndDrop.move_to.callback == "function") {
			libLEMA.DragAndDrop.move_to.callback(object);
		}
	}
};

/** ############################################################
  *	libLEMA.Mouse
  * ############################################################
  **/

libLEMA.Mouse = {
	position: new Vector2(0, 0),
	screen: new Vector2(0, 0),
	delta: new Vector2(0, 0),
	ndc: new Vector2(0, 0),
	tmp: new Vector2(0, 0),
	pressed: false,
	target_pressed: null,
	just_pressed: false,
	just_released: false,
	element: null
};

/** libLEMA.Mouse.Initialize
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.Initialize = function (element_name) {
	if (!libLEMA.nunu_editor) {
		libLEMA.Mouse.ShowCursor(false);
		libLEMA.Template.canvas.onmouseout = function (evt) {
			libLEMA.Mouse.ShowHand(false);
			if (libLEMA.DragAndDrop.dragging) {
				libLEMA.DragAndDrop.on_Release();
			}
		};
		libLEMA.Template.canvas.onmouseover = function (evt) {
			libLEMA.Mouse.ShowHand(true);
		};
	}
	//libLEMA.Mouse.target = Mouse;
	element_name = element_name || "libLEMA_hand";
	libLEMA.Mouse.element = libLEMA.Activity.scene.getObjectByName(element_name);
	libLEMA.Template.Update_Position();
	libLEMA.Mouse.element.material = libLEMA.Template.materials.m_hand_point;
	libLEMA.Mouse.element.visible = true;
	libLEMA.Mouse.world = libLEMA.Mouse.screen;
};

/** 
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.Update = function () {
	if (libLEMA.Keyboard.on) {
		libLEMA.Keyboard.dx = libLEMA.Mouse.position.x;
		libLEMA.Keyboard.dy = libLEMA.Mouse.position.y;
		if (Keyboard.keyPressed(Keyboard.LEFT)) {
			if (libLEMA.Mouse.ndc.x > -0.97) {
				libLEMA.Mouse.position.x -= libLEMA.Keyboard.move_step;
			}
		} else if (Keyboard.keyPressed(Keyboard.RIGHT)) {
			if (libLEMA.Mouse.ndc.x < 0.93) {
				libLEMA.Mouse.position.x += libLEMA.Keyboard.move_step;
			}
		} else if (Keyboard.keyPressed(Keyboard.UP)) {
			if (libLEMA.Mouse.ndc.y < 1) {
				libLEMA.Mouse.position.y -= libLEMA.Keyboard.move_step;
			}
		} else if (Keyboard.keyPressed(Keyboard.DOWN)) {
			if (libLEMA.Mouse.ndc.y > -0.9) {
				libLEMA.Mouse.position.y += libLEMA.Keyboard.move_step;
			}
		}
		libLEMA.Mouse.delta.x = libLEMA.Mouse.position.x - libLEMA.Keyboard.dx;
		libLEMA.Mouse.delta.y = libLEMA.Mouse.position.y - libLEMA.Keyboard.dy;
		libLEMA.Mouse.target_pressed = libLEMA.Keyboard.pressed;
	} else if (libLEMA.Kinect.on) {
		libLEMA.Mouse.tmp.x = libLEMA.Mouse.position.x;
		libLEMA.Mouse.tmp.y = libLEMA.Mouse.position.y;
		libLEMA.Mouse.position.x = libLEMA.Kinect.position.x;
		libLEMA.Mouse.position.y = libLEMA.Kinect.position.y;
		// libLEMA.Mouse.delta.x = libLEMA.Kinect.delta.x;
		// libLEMA.Mouse.delta.y = libLEMA.Kinect.delta.y;
		libLEMA.Mouse.delta.x = libLEMA.Mouse.position.x - libLEMA.Mouse.tmp.x;
		libLEMA.Mouse.delta.y = libLEMA.Mouse.position.y - libLEMA.Mouse.tmp.y;
		libLEMA.Mouse.target_pressed = libLEMA.Kinect.pressed;
	} else {
		libLEMA.Mouse.position.x = Mouse.position.x;
		libLEMA.Mouse.position.y = Mouse.position.y;
		libLEMA.Mouse.delta.x = Mouse.delta.x;
		libLEMA.Mouse.delta.y = Mouse.delta.y;
		libLEMA.Mouse.target_pressed = Mouse.buttonPressed(Mouse.LEFT);
	}
	
	if (libLEMA.Mouse.target_pressed) {
		if (libLEMA.Mouse.pressed) {
			libLEMA.Mouse.just_pressed = false;
		} else {
			libLEMA.Mouse.pressed = true;
			libLEMA.Mouse.just_pressed = true;
			libLEMA.Mouse.element.material = libLEMA.Template.materials.m_hand_on;
			console.log("libLEMA.Mouse >> just pressed");
		}
	} else {
		if (libLEMA.Mouse.pressed) {
			libLEMA.Mouse.pressed = false;
			libLEMA.Mouse.just_pressed = false;
			libLEMA.Mouse.just_released = true;
			libLEMA.Mouse.element.material = libLEMA.Template.materials.m_hand_point;
			console.log("libLEMA.Mouse >> just released");
		} else {
			libLEMA.Mouse.just_released = false;
		}
	}
	
	libLEMA.Mouse.UpdateScreen();
	libLEMA.Mouse.UpdateHand();
};

/** 
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.UpdateScreen = function () { // TODO: screen -> world
	libLEMA.Mouse.screen.x =
		libLEMA.Mouse.position.x * libLEMA.Activity.camera2canvas_ratio - libLEMA.Template.screen.center.x;
	libLEMA.Mouse.screen.y =
		libLEMA.Template.screen.center.y - libLEMA.Mouse.position.y * libLEMA.Activity.camera2canvas_ratio;
};

/** libLEMA.Mouse.UpdateHand
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.UpdateHand = function () {
	libLEMA.Mouse.element.position.x =
		libLEMA.Mouse.screen.x + 0.2;
	libLEMA.Mouse.element.position.y =
		libLEMA.Mouse.screen.y - 0.5;
};
  
/** libLEMA.Mouse.ShowCursor
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.ShowCursor = function (mode) {
	if (typeof mode == "undefined") {
		mode = true;
	}
	libLEMA.Template.activity_program.canvas.style.cursor =
		(mode ? "default" : "none");
};
  
/** libLEMA.Mouse.ShowHand
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.ShowHand = function (mode) {
	if (typeof mode == "undefined") {
		mode = true;
	}
	libLEMA.Mouse.element.visible = mode;
};

/** libLEMA.Mouse.FakeKinect
  * ------------------------------------------------------------
  **/

libLEMA.Mouse.FakeKinect = function (mode) {
	mode = (mode === void 0 ? true : false);
	console.info("libLEMA.Mouse.FakeKinect >> ", mode);
	if (mode) {
		libLEMA.script.update = function () {
			libLEMA.Mouse.UpdateNDC2();
			libLEMA.Kinect.data = {
				posX: libLEMA.Mouse.ndc.x,
				posY: libLEMA.Mouse.ndc.y,
				closed: Mouse.buttonPressed(Mouse.LEFT)
			};
			libLEMA.Kinect.ProcessXYH();
			libLEMA.Update();
		};
		libLEMA.Kinect.on = true;
	} else {
		libLEMA.script.update = libLEMA.Update;
		libLEMA.Kinect.on = false;
	}
};

/** x, y = -1 .. +1 **/
libLEMA.Mouse.UpdateNDC1 = function () {
	libLEMA.Mouse.ndc.x = (libLEMA.Mouse.position.x / libLEMA.Activity.canvas.width) * 2 - 1;
	libLEMA.Mouse.ndc.y = 1 - 2 * (libLEMA.Mouse.position.y / libLEMA.Activity.canvas.height);
};

/** x, y = 0 .. +1 **/  
libLEMA.Mouse.UpdateNDC2 = function () {
	libLEMA.Mouse.ndc.x = Mouse.position.x / libLEMA.Activity.canvas.width;
	libLEMA.Mouse.ndc.y = Mouse.position.y / libLEMA.Activity.canvas.height;
};

/** ############################################################
  *	libLEMA.Kinect
  * ############################################################
  **/

libLEMA.Kinect = {
	on: false,
	localhost: false,
	socket: null,
	url: null,
	default_url: "ws://127.0.0.1:8181",
	temp: new Vector2(0, 0),
	ndc: new Vector2(0, 0), // normalized device coordinates: -1 .. +1
	position: new Vector2(0, 0),
	// delta: new Vector2(0, 0),
	just_pressed: false,
	pressed: false,
	retry: {
		steps: 10,
		step: 0,
		timer: null
	},
	callback: {
	},
	event: null /** store close && error events **/
};

/** libLEMA.Kinect.SetCallback
  * ------------------------------------------------------------
  * Custom callback handlers for: onopen | onclose | onerror
  **/

libLEMA.Kinect.SetCallback = function (handlers) {
	var h, k;
	for (k in handlers) {
		h = handlers[k];
		if (typeof h == "function") {
			console.log("libLEMA.Kinect.SetHandlers:", k);
			libLEMA.Kinect.callback[k] = h;
		} else {
			console.error("libLEMA.Kinect.SetHandlers:", k);
		}
	}
};


/** libLEMA.Kinect.Open
  * ------------------------------------------------------------
  **/

libLEMA.Kinect.Open = function (url) {
	if (libLEMA.Kinect.on) {
		console.error(
			"libLEMA.Kinect.Open",
			">> kinect is already on"
		);
		return;
	}
	
	if ( url == undefined ) {
		url = libLEMA.Kinect.default_url;
	}

	console.info("libLEMA.Kinect.Open:", url);
	libLEMA.Kinect.localhost =
		(url.indexOf("localhost") != -1) || (url.indexOf("127.0.0.1") != -1);
	try {
		libLEMA.Kinect.socket = new WebSocket(url);
	} catch (exception) {
		console.error("libLEMA.Kinect.Open >> shit happned...");
		console.log(exception);
		return;
	}

	libLEMA.Kinect.SetSocketHandlers();

	libLEMA.Kinect.url = url;
	libLEMA.Kinect.on = true;
};

libLEMA.Kinect.SetSocketHandlers = function () {
	libLEMA.Kinect.socket.onopen = libLEMA.Kinect.onSocketOpen;
	libLEMA.Kinect.socket.onclose = libLEMA.Kinect.onSocketClose;
	libLEMA.Kinect.socket.onmessage = libLEMA.Kinect.onSocketMessage;
	libLEMA.Kinect.socket.onerror = libLEMA.Kinect.onSocketError;
};

/** libLEMA.Kinect.Close
  * ------------------------------------------------------------
  **/

libLEMA.Kinect.Close = function () {
	if (!libLEMA.Kinect.on) {
		if (libLEMA.Kinect.retry.step > 0) {
			libLEMA.Kinect.Cancel();
		} else {
			console.error(
				"libLEMA.Kinect.Close",
				">> kinect is not on"
			);
		}
		return;
	}
	
	console.info("libLEMA.Kinect.Close");
	libLEMA.Kinect.socket.close(1000);
	libLEMA.Kinect.on = false;
};

/** libLEMA.Kinect.Send
  * ------------------------------------------------------------
  **/

libLEMA.Kinect.Send = function (msg) {
	if (!libLEMA.Kinect.on) {
		console.error(
			"libLEMA.Kinect.Send",
			">> kinect is not on"
		);
		return;
	}
	if (typeof msg == "undefined" || msg === null) {
		console.error(
			"libLEMA.Kinect.Send",
			">> 'message' is undefined or null"
		);
		return;
	}
	
	console.info("libLEMA.Kinect.Send");
	
	if (typeof msg != "string") {
		console.warn(
			"libLEMA.Kinect.Send",
			">> 'message' is not a string: used JSON.stringify"
		);
		msg = JSON.stringify(msg);
	}
	libLEMA.Kinect.socket.send(msg);
};

/** libLEMA.Kinect.Retry && Cancel
  * ------------------------------------------------------------
  **/

libLEMA.Kinect.Retry = function (start) {
	if (typeof start == "boolean" && start) {
		libLEMA.Kinect.retry.step = libLEMA.Kinect.retry.steps;
	}
	if (libLEMA.Kinect.retry.step > 0) {
		console.info("libLEMA.Kinect.Retry >> in", libLEMA.Kinect.retry.step, "s");
		libLEMA.Kinect.retry.step -= 1;
		libLEMA.Kinect.retry.timer = setTimeout(libLEMA.Kinect.Retry, 1E3);
	} else {
		console.info("libLEMA.Kinect.Retry >> now");
		libLEMA.Kinect.socket = new WebSocket(libLEMA.Kinect.url);
		libLEMA.Kinect.SetSocketHandlers();
		libLEMA.Kinect.on = true;
	}
};

libLEMA.Kinect.Cancel = function () {
	console.info("libLEMA.Kinect.Cancel");
	clearTimeout(libLEMA.Kinect.retry.timer);
	libLEMA.Kinect.retry.step = 0;
};

/** libLEMA.Mouse Socket Handlers
  * ------------------------------------------------------------
  **/

libLEMA.Kinect.ProcessXYH = function () {
	libLEMA.Kinect.ndc.x = libLEMA.Kinect.data.posX * 2 - 1;
	libLEMA.Kinect.ndc.y = 1 - libLEMA.Kinect.data.posY * 2;
	
	// libLEMA.Kinect.temp.x = libLEMA.Kinect.data.posX * libLEMA.Activity.canvas.width;
	// libLEMA.Kinect.temp.y = libLEMA.Kinect.data.posY * libLEMA.Activity.canvas.height;
	
	// libLEMA.Kinect.delta.x = libLEMA.Kinect.temp.x - libLEMA.Kinect.position.x;
	// libLEMA.Kinect.delta.y = libLEMA.Kinect.temp.y - libLEMA.Kinect.position.y;
	
	// libLEMA.Kinect.position.x = libLEMA.Kinect.temp.x;
	// libLEMA.Kinect.position.y = libLEMA.Kinect.temp.y;
	
	libLEMA.Kinect.position.x = libLEMA.Kinect.data.posX * libLEMA.Activity.canvas.width;
	libLEMA.Kinect.position.y = libLEMA.Kinect.data.posY * libLEMA.Activity.canvas.height;
	
	libLEMA.Kinect.just_pressed = libLEMA.Kinect.data.closed && !libLEMA.Kinect.pressed;
	libLEMA.Kinect.pressed = libLEMA.Kinect.data.closed;
};

libLEMA.Kinect.onSocketMessage = function (evt) {
	if (libLEMA.Kinect.localhost) {
		libLEMA.Kinect.data = JSON.parse(evt.data);
		console.log("onSocketMessage:", libLEMA.Kinect.data);
		libLEMA.Kinect.ProcessXYH();
	} else {
		console.info("libLEMA.Kinect.onSocketMessage:", evt.data);
	}
};

libLEMA.Kinect.onSocketOpen = function (evt) {
	console.info("libLEMA.Kinect.onSocketOpen >>", evt.currentTarget.url);
	if (libLEMA.Kinect.callback.onopen) {
		libLEMA.Kinect.callback.onopen(evt);
	}
};

libLEMA.Kinect.onSocketClose = function (evt) {
	console.info("libLEMA.Kinect.onSocketClose >>", evt.currentTarget.url);
	console.log("\tclean:", evt.wasClean);
	console.log("\tcode:", evt.code, (evt.code == 1000 ? "OK" : "unexpected..."));
	if (evt.code != 1000) {
		console.log("\tMDN >> https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent");
	}
	libLEMA.Kinect.event = evt;
	if (libLEMA.Kinect.on) {
		libLEMA.Kinect.on = false;
	}
	libLEMA.Kinect.socket = null;
	
	if (libLEMA.Kinect.callback.onclose) {
		libLEMA.Kinect.callback.onclose(evt);
	}
	
	if (!evt.wasClean) {
		libLEMA.Kinect.Retry(true);
	}
};

libLEMA.Kinect.onSocketError = function (evt) {
	console.error("libLEMA.Kinect.onSocketError >>", evt.type);
	console.log(evt);
	libLEMA.Kinect.event = evt;
	if (libLEMA.Kinect.callback.onerror) {
		libLEMA.Kinect.callback.onerror(evt);
	}
	
};

/** ############################################################
  *	libLEMA.Keyboard
  * ############################################################
  **/

libLEMA.Keyboard = {
	on: false,
	move_step: 1,
	step_up: 5E-2,
	key: null,
	key_just_pressed: null,
	dx: 0,
	dy: 0,
	pressed: false
};

libLEMA.Keyboard.Initialize = function () {
};

libLEMA.Keyboard.TestActivity = function () {
		if (Keyboard.keyJustPressed(Keyboard.LEFT)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.LEFT;
		} else if (Keyboard.keyJustPressed(Keyboard.RIGHT)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.RIGHT;
		} else if (Keyboard.keyJustPressed(Keyboard.UP)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.UP;
		} else if (Keyboard.keyJustPressed(Keyboard.DOWN)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.DOWN;
		} else if (Keyboard.keyJustPressed(Keyboard.ENTER)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.ENTER;
		} else if (Keyboard.keyJustPressed(Keyboard.SPACEBAR)) {
			libLEMA.Keyboard.key_just_pressed = Keyboard.SPACEBAR;
		} else {
			libLEMA.Keyboard.key_just_pressed = null;
		}
		
		if (libLEMA.Keyboard.key_just_pressed !== null) {
			libLEMA.Keyboard.key = libLEMA.Keyboard.key_just_pressed;
			if (!libLEMA.Keyboard.pressed) {
				if (libLEMA.Keyboard.key == Keyboard.ENTER || libLEMA.Keyboard.key == Keyboard.SPACEBAR) {
					libLEMA.Keyboard.pressed_key = libLEMA.Keyboard.key;
					libLEMA.Keyboard.pressed = true;
				}
			} else {
				if (libLEMA.Keyboard.pressed_key == Keyboard.SPACEBAR && libLEMA.Keyboard.key == Keyboard.SPACEBAR) {
					libLEMA.Keyboard.pressed_key = null;
					libLEMA.Keyboard.pressed = null;
				}
			}
			return true;
		}
		
		if (libLEMA.Keyboard.pressed_key == Keyboard.ENTER) {
			libLEMA.Keyboard.pressed_key = null;
			libLEMA.Keyboard.pressed = null;
		}
				
		return false;
};

/** ############################################################
  *	libLEMA.Calculator
  * ############################################################
  **/


libLEMA.Calculator = {
	lst_keys: [
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
		"+", "-", "x", ":",
		",", "=", "c", "r"
	],
	lst_clickable: [],
	key_hover: null,
	key_click: null,
	colors: {
		hover: null,
		click: null,
		ok: null,
		error: null
	},
	max_length: 8,
	decimals: 2,
	time_after_key_action: 333,
	answer: null,
	right: null,
	allow_operator: false,
	container: null,
	active: false,
	obj_action: null,
	width: null,
	height: null
};

libLEMA.Calculator.Initialize = function (show) {
	libLEMA.Calculator.container =
		libLEMA.Activity.program.getObjectByName("libLEMA_calculator");
	var idx, k, p;
	for (idx = 0; idx < libLEMA.Calculator.lst_keys.length; idx++) {
		k = libLEMA.Calculator.lst_keys[idx];
		k = libLEMA.Calculator.container.getObjectByName("key_" + k);
		p = k.getObjectByName("plane");
		p.userData.key = libLEMA.Calculator.lst_keys[idx];
		p.userData.material = p.material;
		libLEMA.Calculator.lst_clickable.push(p);
	}
	
	k = libLEMA.Calculator.container.getObjectByName("answer");
	p = k.getObjectByName("plane");
	libLEMA.Calculator.right = p.position.x + p.scale.x / 2;
	
	libLEMA.Calculator.answer = k.getObjectByName("text");
	
	libLEMA.Calculator.colors.hover = libLEMA.Template.materials.btn_bg_hover;
	libLEMA.Calculator.colors.click = libLEMA.Template.materials.btn_bg_on;
	libLEMA.Calculator.colors.error = libLEMA.Template.materials.clr_highlight;
	libLEMA.Calculator.colors.ok = libLEMA.Template.materials.clr_green;
	
	var nr_rows = 6, nr_cols = 4, spacing = 0.05, key_size = 1;
	libLEMA.Calculator.width = nr_cols * key_size + (nr_cols - 1) * spacing;
	libLEMA.Calculator.height = nr_rows * key_size + (nr_rows - 1) * spacing;
	
	libLEMA.Calculator.Reset();
	if (show) {
		libLEMA.Calculator.Show();
	}
};

libLEMA.Calculator.SetPositionLeftTop = function (x, y) {
	libLEMA.Calculator.container.position.x = x + 0.5;
	libLEMA.Calculator.container.position.y = y - 0.5;
};

libLEMA.Calculator.Show = function (mode) {
	if (typeof mode == "undefined") {
		mode = true;
	}
	libLEMA.Calculator.active = Boolean(mode);
	libLEMA.Calculator.container.visible = libLEMA.Calculator.active;
};

libLEMA.Calculator.onKeyHover = function (key) {
	if (key == libLEMA.Calculator.key_hover) {
		return;
	}
	libLEMA.Calculator.onKeyOut();
	libLEMA.Calculator.key_hover = key;
	if (key != libLEMA.Calculator.key_click) {
		libLEMA.Calculator.key_hover.material = libLEMA.Calculator.colors.hover;
	}
};

libLEMA.Calculator.onKeyOut = function (key) {
	if (libLEMA.Calculator.key_hover !== null) {
		libLEMA.Calculator.key_hover.material = libLEMA.Calculator.key_hover.userData.material;
		libLEMA.Calculator.key_hover = null;
	}
};

libLEMA.Calculator.onKeyAction = function (key) {
	if (!libLEMA.Calculator.container.visible) {
		return;
	}
	
	if (libLEMA.Calculator.key_click !== null) {
		return;
	}
	
	libLEMA.Calculator.key_click = key;
	var key_value = key.userData.key;
	var ok = true;
	
	if (key_value == "c") {
		libLEMA.Calculator.allow_operator = false;
		libLEMA.Calculator.Clear();
	} else if (key_value == "r") {
		libLEMA.Calculator.allow_operator = false;
		libLEMA.Calculator.Reset();
	} else if (key_value == "=") {
		libLEMA.Calculator.allow_operator = false;
		libLEMA.Calculator.Compute();
	} else {
		if (libLEMA.Calculator.answer.text.length == libLEMA.Calculator.max_length) {
			ok = false;
		} else {
			if ([",", "+", "-", ":", "x"].indexOf(key_value) != -1) {
				if (!libLEMA.Calculator.allow_operator) {
					ok = false;
				} else {
					libLEMA.Calculator.SetAnswerText(libLEMA.Calculator.answer.text + key_value);
				}
				libLEMA.Calculator.allow_operator = false;
			} else {
				libLEMA.Calculator.SetAnswerText(libLEMA.Calculator.answer.text + key_value);
				libLEMA.Calculator.allow_operator = ("0" <= key_value && key_value <= "9");
			}
		}
	}
	
	libLEMA.Calculator.key_click.material = (ok ? libLEMA.Calculator.colors.click : libLEMA.Calculator.colors.error);
	setTimeout(libLEMA.Calculator.onAfterKeyAction, libLEMA.Calculator.time_after_key_action);
};

libLEMA.Calculator.onAfterKeyAction = function () {
	if (libLEMA.Calculator.key_hover == libLEMA.Calculator.key_click) {
		libLEMA.Calculator.key_click.material = libLEMA.Calculator.colors.hover;
	} else {
		libLEMA.Calculator.key_click.material = libLEMA.Calculator.key_click.userData.material;
	}
	libLEMA.Calculator.key_click = null;
};

libLEMA.Calculator.SetAnswerText = function (txt) {
	libLEMA.Calculator.answer.setText(txt);
	var td = libLEMA.Tools.GetTextDimension(libLEMA.Calculator.answer, true);
	libLEMA.Calculator.answer.position.x = libLEMA.Calculator.right - td.x - 0.25;
	libLEMA.Calculator.answer.material = libLEMA.Calculator.colors.ok;
};

libLEMA.Calculator.Compute = function () {
	var result = libLEMA.Calculator.Evaluate();
	var ok = !isNaN(result);
	if (ok) {
		libLEMA.Calculator.SetAnswerText(result.replace(/\./, ","));
	}
	libLEMA.Calculator.allow_operator = ok;
	libLEMA.Calculator.answer.material = (ok ? libLEMA.Calculator.colors.ok : libLEMA.Calculator.colors.error);
	return result;
};

libLEMA.Calculator.Evaluate = function () {
	var evaluate = libLEMA.Calculator.answer.text;
	evaluate = evaluate.replace(/\,/g, ".");
	evaluate = evaluate.replace(/x/g, "*");
	evaluate = evaluate.replace(/:/g, "/");
	
	var result, ok = true;
	try {
		result = eval(evaluate);
		if (isNaN(result) || !isFinite(result) || typeof result == "undefined") {
			ok = false;
		}
	} catch (e) {
		ok = false;
	}
	if (ok) {
		result = result.toString();
		if (parseInt(result) != parseFloat(result)) {
			result = parseFloat(result).toFixed(libLEMA.Calculator.decimals);
			result = parseFloat(result).toString();
		}
	} else {
		result = parseInt("LEMA");
	}
	
	return result;
};

libLEMA.Calculator.GetValue = function () {
	return libLEMA.Calculator.Evaluate();
};

libLEMA.Calculator.Clear = function () {
	var txt = libLEMA.Calculator.answer.text;
	if (txt.length > 0) {
		//txt = txt.substring(0, txt.length - 1);
		txt = txt.slice(0, -1);
		libLEMA.Calculator.SetAnswerText(txt);
		if (txt.length > 0) {
			var k = txt[txt.length - 1];
			libLEMA.Calculator.allow_operator = ("0" <= k && k <= "9");
		}
	}
};

libLEMA.Calculator.Reset = function () {
	libLEMA.Calculator.answer.setText("");
};

libLEMA.Calculator.Update = function () {
	libLEMA.Calculator.obj_action =
		libLEMA.Tools.MouseOverObjectList(libLEMA.Calculator.lst_clickable);
	if (libLEMA.Calculator.obj_action) {
		if (libLEMA.Mouse.just_pressed) {
			libLEMA.Calculator.onKeyAction(libLEMA.Calculator.obj_action);
		} else {
			libLEMA.Calculator.onKeyHover(libLEMA.Calculator.obj_action);
		}
	} else {
		libLEMA.Calculator.onKeyOut();
	}
};

/** EOF **/