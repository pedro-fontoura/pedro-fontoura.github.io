/** ------------------------------------------------------------
  * LEMA activity identification
  * ------------------------------------------------------------
  
    Title:			
    Filename:		
    Github issue:	
    
  * ------------------------------------------------------------
	
	History:
	
	- 
	
  
  * ------------------------------------------------------------
  * LEMA (C) Geometrix, Aveiro University
  * ------------------------------------------------------------
  **/

var libLEMA_official = 
	"https://raw.githubusercontent.com/MathAveiro/libLEMA_v1/master/libLEMA_v1.isp";

var libLEMA_developer = 
	//"https://raw.githubusercontent.com/MathAveiro/libLEMA_v1/master/libLEMA_v1.isp";
	"http://localhost/lema-dev/libs/libLEMA_v1.isp";

/** lemaApp globals
  * ============================================================
  **/

var lemaApp = {
	clicked: null,	// reference to a clicked object, if any
	level: 0,		// activity level set by LEMA platform
	hint: null		// reference to libLEMA.Template.activity_hint
};

var plane = null, container = null;

/** lemaApp Initialize
  * ============================================================
  **/

function lemaAppInitialize() {
	console.info("lemaAppInitialize");
	libLEMA.Template.SetTitle("Atividade modelo.");
	libLEMA.Template.GetObjectByName("lawn").visible = true;
	
	lemaApp.hint = libLEMA.Template.activity_hint;
	lemaApp.level = libLEMA.Activity.GetLevel();
	
	SetDAD();
	
	plane = scene.getObjectByName("plane");
	console.log(plane);
}

function SetDAD() {
	libLEMA.DragAndDrop = {
		object: null,
		on_release: null,
		dragging: false,
		moving: false,
		move_to: {
			DEFAULT_STEPS: 30,
			delay: libLEMA.Const.DEFAULT_FRAME_TIME
		}
	};

	libLEMA.DragAndDrop.Set = function (object, on_release) {
		// assert object && object.position
		// assert on_release
		libLEMA.DragAndDrop.object = object;
		libLEMA.DragAndDrop.on_release = on_release;
		libLEMA.DragAndDrop.dragging = true;
	};

	libLEMA.DragAndDrop.Update = function () {
		if (libLEMA.DragAndDrop.dragging) {
			if (Mouse.buttonJustReleased(Mouse.LEFT)) {
				libLEMA.DragAndDrop.on_release(libLEMA.DragAndDrop.object);
				
				libLEMA.DragAndDrop.object = null;
				libLEMA.DragAndDrop.dragging = false;
			} else {
				libLEMA.DragAndDrop.object.position.x +=
					Mouse.delta.x * libLEMA.Activity.camera2canvas_ratio;
				libLEMA.DragAndDrop.object.position.y -=
					Mouse.delta.y * libLEMA.Activity.camera2canvas_ratio;
			}
		}
	};
	
	
	libLEMA.DragAndDrop.MoveTo = function (object, position, callback, n) {
		libLEMA.DragAndDrop.move_to.object = object;
		libLEMA.DragAndDrop.move_to.position = {x: position.x, y: position.y};
		libLEMA.DragAndDrop.move_to.callback = callback;
		var steps = null;
		n = parseInt(n) || libLEMA.DragAndDrop.move_to.DEFAULT_STEPS;
		if (n < 100) {
			// FIXED steps
			steps = n;
		} else {
			// FIXED time
			steps = Math.round(n / libLEMA.DragAndDrop.move_to.delay);
		}
		libLEMA.DragAndDrop.move_to.steps = steps;
		libLEMA.DragAndDrop.move_to.delta = {
			x: (position.x - object.position.x) / steps,
			y: (position.y - object.position.y) / steps
		};
		setTimeout(
			libLEMA.DragAndDrop.MoveTo_Step,
			libLEMA.DragAndDrop.move_to.delay
		);
		libLEMA.DragAndDrop.moving = true;
	};
	
	libLEMA.DragAndDrop.MoveTo_Step = function () {
		libLEMA.DragAndDrop.move_to.steps -= 1;
		if (libLEMA.DragAndDrop.move_to.steps >= 0) {
			libLEMA.DragAndDrop.move_to.object.position.x +=
				libLEMA.DragAndDrop.move_to.delta.x;
			libLEMA.DragAndDrop.move_to.object.position.y +=
				libLEMA.DragAndDrop.move_to.delta.y;
			setTimeout(
				libLEMA.DragAndDrop.MoveTo_Step,
				libLEMA.DragAndDrop.move_to.delay
			);
		} else {
			libLEMA.DragAndDrop.move_to.object.position.x =
				libLEMA.DragAndDrop.move_to.position.x;
			libLEMA.DragAndDrop.move_to.object.position.y =
				libLEMA.DragAndDrop.move_to.position.y;
			if (typeof libLEMA.DragAndDrop.move_to.callback == "function") {
				libLEMA.DragAndDrop.move_to.callback(
					libLEMA.DragAndDrop.move_to.object
				);
			}
			libLEMA.DragAndDrop.move_to.object = null;
			libLEMA.DragAndDrop.moving = false;
		}
	};
}


/** lemaApp Update (animation loop)
  * ============================================================
  **/

function lemaAppUpdate() {
	if (!libLEMA.Template.mouse_over_button) {
		/** user MAY be interacting with lemaApp objects **/
		if (Mouse.buttonJustPressed(Mouse.LEFT)) {
			/** user clicked something... (not a button) **/
			lemaApp.clicked = libLEMA.Tools.MouseOverObject(plane);
			//lemaApp.clicked = libLEMA.Tools.MouseOverObjectList([plane]);
			if (lemaApp.clicked) {
				/** user clicked a lemaApp object **/
				lemaAppOnClickObject(lemaApp.clicked);
			}
		}
	}
	/** some other stuff here: like moving objects, drag-n-drop, ... **/
	libLEMA.DragAndDrop.Update();
}

/** lemaApp OnResize
  * ============================================================
  **/

function lemaAppOnResize() {
}

/** lemaApp OnClickObject
  * ============================================================
  **/

function lemaAppOnClickObject(object) {
	console.log("lemaAppOnClickObject:", object.name);
	object.material = libLEMA.Template.materials.clr_highlight;
	libLEMA.DragAndDrop.Set(object, onRelease);
}

function onRelease(object) {
	console.log("onRelease:", object.name, object.position);
	object.material = libLEMA.Template.materials.clr_white;
	libLEMA.DragAndDrop.MoveTo(
		object,
		{x: Math.round(object.position.x), y: Math.round(object.position.y)},
		function (obj) {
			obj.material = libLEMA.Template.materials.clr_black;
		}
	);
}

/** lemaApp OnClickButtonSound
  * ============================================================
  **/

function lemaAppOnClickButtonSound() {
	//libLEMA.Sound.PlayByName("snd_enunciado");
}

/** lemaApp OnClickButtonHint
  * ============================================================
  **/

function lemaAppOnClickButtonHint() {
	if (lemaApp.hint.container.visible) {
		libLEMA.Sound.PlayByName("snd_hint");
	} else {
		libLEMA.Sound.StopIfPlayingByName("snd_hint");
	}
}

/** lemaApp OnClickButtonRestart
  * ============================================================
  **/

function lemaAppOnClickButtonRestart() {
}

/** lemaApp OnClickButtonSubmit
  * ============================================================
  **/

function lemaAppOnClickButtonSubmit() {
	var output = {
		// specific activity stuff...
	};
	libLEMA.Activity.SubmitResult(
		lemaAppValidateActivity(), // success|fail
		output
	);
}

/** lemaApp ValidateActivity
  * ============================================================
  *	Return: true|false 
  **/

function lemaAppValidateActivity() {
	var success = libLEMA.Math.RandomInt(0, 1); // 50% success rate
	return Boolean(success);
}

/** ------------------------------------------------------------
  * Activity specific functions
  * ------------------------------------------------------------
  **/
 
 

 
 

/** ------------------------------------------------------------
  * Init / Update / Load / Process
  * ------------------------------------------------------------
  * Do NOT edit or write code past this point!
  *	You will go to hell if you do...
  * ------------------------------------------------------------
  **/

/** nunuApp initialize **/
this.initialize = function() {
	console.info("activity_script.initialize");
	scene.visible = false;
	program.userData.time = Date.now();
	var libLEMA_url = libLEMA_DefineURL();
	if (libLEMA_url !== null) {
		/** load/parse/process libLEMA.isp file **/
		console.log("\libLEMA URL:", libLEMA_url);
		/** FileSystem.readFile: fname, sync, onLoad, onProgress **/
		var data1 = FileSystem.readFile(libLEMA_url, true);
		console.log("\tFileSystem.readFile:", Date.now() - program.userData.time);
		var data2 = JSON.parse(data1);
		console.log("\tJSON.parse:", Date.now() - program.userData.time);
		var loader = new ObjectLoader();
		/** ObjectLoader.parse: json, onLoad  **/
		var libLEMA_program = loader.parse(data2);
		console.log("\tloader.parse:", Date.now() - program.userData.time);
		/** process libLEMA program elements **/
		libLEMA_ProcessProgram(libLEMA_program);
		console.log("\libLEMA_ProcessProgram:", Date.now() - program.userData.time);
		/** wait for libLEMA_script.initialize and libLEMA definition **/
		setTimeout(libLEMA_WaitProgramInitialize.bind(libLEMA_program), 1E3 / 60);
	}
};

/** nunuApp update **/
this.update = function() {
	if (typeof libLEMA == "object" && libLEMA.Template.ready) {
		if (!libLEMA.Template.paused) {
			lemaAppUpdate();
		}
	}
};

/** libLEMA_DefineURL **/
function libLEMA_DefineURL() {
	var window_location = window.location.toString();
	var running_editor = window_location.indexOf("/editor") != -1;
	var running_localhost = window_location.toString().indexOf("/localhost") != -1;
	var run_official = (!running_editor && !running_localhost);
	var file_url = null;
	if (run_official) {
		file_url = libLEMA_official;
		/** lemaApp running on LEMA platform **/
		if (typeof Lema != "function") {
			console.error("Unexpected typeof Lema:", typeof Lema);
		}
	} else {
		file_url = libLEMA_developer;
	}
	return file_url;
}

/** libLEMA_ProcessProgram **/
function libLEMA_ProcessProgram(libLEMA_program) {
	var idx, child, lst_children_names = [];
	var libLEMA_scene = libLEMA_program.getObjectByName("libLEMA_scene");
	var n = libLEMA_scene.children.length;
	
	for (idx = 0; idx < n; idx++) {
		child = libLEMA_scene.children[idx];
		lst_children_names.push(child.name);
	}
	
	for (idx = 0; idx < n; idx++) {
		child = libLEMA_program.getObjectByName(lst_children_names[idx]);
		if (child.type == "OrthographicCamera") {
			while (scene.cameras.length > 0) {
				scene.removeCamera(scene.cameras[0]);
			}
			scene.addCamera(child);
		} else {
			scene.add(child);
		}
		if (child.type != "Script") {
			child.initialize();
		}
	}
}

/** libLEMA_WaitProgramInitialize **/
function libLEMA_WaitProgramInitialize() {
	if (typeof libLEMA == "undefined") {
		setTimeout(libLEMA_WaitProgramInitialize.bind(this), 1E3 / 60);
	} else {
		/** libLEMA is now available, init **/
		libLEMA.Initialize();
		/** init: libLEMA.Template **/
		libLEMA.Template.Initialize(
			{
				activity_program: program,
				libLEMA_program: this,
				onClickButtonHandle: {
					btn_sound: lemaAppOnClickButtonSound.bind(self),
					btn_hint: lemaAppOnClickButtonHint.bind(self),
					btn_restart: lemaAppOnClickButtonRestart.bind(self),
					btn_submit: lemaAppOnClickButtonSubmit.bind(self)
				},
				onHandle: {
					on_resize: lemaAppOnResize.bind(self)
				}
			}
		);
		/** init: libLEMA.Sound, requires 'activity_program' **/
		libLEMA.Sound.Initialize();
		libLEMA.Sound.LoadAll();
		console.log("Load && Init:", Date.now() - program.userData.time);
		/** init: this activity **/
		libLEMA.Tools.HorizontalRuler();
		libLEMA.Activity.Initialize();
		lemaAppInitialize();
		libLEMA.Activity.Ready();
	}
}

/** EOF **/