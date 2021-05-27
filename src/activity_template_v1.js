/** ------------------------------------------------------------
  * LEMA (C) Geometrix, Aveiro University
  * ------------------------------------------------------------
  **/

/** lemaApp globals
  * ============================================================
  **/

var lemaApp = {
	/** properties are defined by libLEMA before lemaAppInitialize **/
};


/** lemaApp Initialize
  * ============================================================
  **/

function lemaAppInitialize() {
	console.info("lemaAppInitialize");
	libLEMA.Template.GetObjectByName("lawn").visible = true;
	
	/** prepare activity elements according to level **/
	lemaAppOnRestart(lemaApp.level);
}

/** lemaApp Update (animation loop)
  * ============================================================
  **/

function lemaAppUpdate() {
	if (!libLEMA.Template.mouse_over_button) {
		/** user MAY be interacting with lemaApp objects **/
		if (libLEMA.Mouse.just_pressed) {
			/** user clicked something... (not a button) **/
			//lemaApp.clicked = libLEMA.Tools.MouseOverObject(some_object);
			//lemaApp.clicked = libLEMA.Tools.MouseOverObjectList(some_container.children);
			if (lemaApp.clicked) {
				/** user clicked a lemaApp object **/
				lemaAppOnClickObject(lemaApp.clicked);
			}
		}
	}
}

/** lemaApp OnRestart
  * ============================================================
  *		lvl == lemaApp.level: 1..5
  **/

function lemaAppOnRestart(lvl) {
	console.assert(lvl === lemaApp.level);
	console.info("lemaAppOnRestart: level", lemaApp.level);
	libLEMA.Template.SetTitle("Atividade modelo: nível " + lemaApp.level);
	
	//var minimum_width = ...
	//libLEMA.Activity.SetMinimumWidth(minimum_width);
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
	console.log("clicked:", object.name);
	//libLEMA.DragAndDrop.Set(object, function(obj, delta){console.log(obj, delta)});
}

/** lemaApp OnClickButtonSound
  * ============================================================
  **/

function lemaAppOnClickButtonSound() {
	//libLEMA.Sound.TogglePlayByName("snd_enunciado");
}

/** lemaApp OnClickButtonHint
  * ============================================================
  **/

function lemaAppOnClickButtonHint() {
	if (lemaApp.hint.container.visible) {
		//libLEMA.Sound.PlayByName("snd_hint");
	} else {
		//libLEMA.Sound.StopIfPlayingByName("snd_hint");
	}
}

/** lemaApp OnClickButtonRestart
  * ============================================================
  **/

function lemaAppOnClickButtonRestart() {
}

/** lemaApp OnClickButtonUndo
  * ============================================================
  **/

function lemaAppOnClickButtonUndo() {
}

/** lemaApp OnClickButtonSubmit
  * ============================================================
  **/

function lemaAppOnClickButtonSubmit() {
	var lemaApp_data = {
		// specific activity stuff...
	};
	libLEMA.Activity.SubmitResult(
		lemaAppValidateActivity(), // success|fail
		lemaApp_data
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

var libLEMA_official = 
	"https://geometrix.cidma-ua.org/lema/libLEMA/libLEMA_v1.nsp";

/** nunuApp initialize **/
this.initialize = function() {
	console.info("lemaApp.initialize");
	scene.visible = false;
	program.userData.time = Date.now();
	var libLEMA_program = null;
	if ( typeof Lema == "function" ) {
		libLEMA_program = libLEMA_GetProgramFromLemaPlatform();
	} else {
		libLEMA_program = libLEMA_GetProgramFromRepository();
	}
	if ( libLEMA_program == null ) {
		console.error("lemaApp.initialize: libLEMA_program is null");
	} else {
		//console.assert( libLEMA_program instanceof Program, "constructor:", libLEMA_program.constructor );
		console.assert( libLEMA_program.name == "libLEMA_program", "name:", libLEMA_program.name );
		/** process libLEMA program elements **/
		libLEMA_ProcessProgram(libLEMA_program);
		console.log("\tlibLEMA_ProcessProgram:", Date.now() - program.userData.time, "ms");
		/** wait for libLEMA_script.initialize and libLEMA definition **/
		setTimeout(libLEMA_WaitProgramInitialize.bind(libLEMA_program), 1E3 / 60);
	}
};

/** nunuApp update **/
this.update = function() {
};

/** libLEMA_GetProgramFromLemaPlatform **/
function libLEMA_GetProgramFromLemaPlatform() {
	console.info("libLEMA_GetProgramFromLemaPlatform");
	if ( typeof Lema != "function" ) {
		console.error("libLEMA_GetProgramFromLemaPlatform: Lema is not a function");
	} else if ( typeof Lema.libLEMA != "object" ) {
		console.error("libLEMA_GetProgramFromLemaPlatform: Lema.libLEMA is not an object");
	} else if ( Lema.libLEMA.program == null ) {
		console.error("libLEMA_GetProgramFromLemaPlatform: Lema.libLEMA.program is null");
	} else {
		return Lema.libLEMA.program;
	}
	return null;
}

/** libLEMA_GetProgramFromRepository **/
function libLEMA_GetProgramFromRepository() {
	console.info("libLEMA_GetProgramFromRepository");
	var libLEMA_url = libLEMA_DefineURL();
	if (libLEMA_url !== null) {
		console.log("\libLEMA URL:", libLEMA_url);
		/** load/parse/process libLEMA file **/
		var data1 = FileSystem.readFileArrayBuffer(libLEMA_url, true);
		console.log("\tFileSystem.readFileArrayBuffer:", Date.now() - program.userData.time, "ms");
		var pson = new dcodeIO.PSON.StaticPair();
		var data2 = pson.decode(data1);
		console.log("\tPSON.decode:", Date.now() - program.userData.time, "ms");
		var loader = new ObjectLoader();
		var libLEMA_program = loader.parse(data2);
		console.log("\tloader.parse:", Date.now() - program.userData.time, "ms");
		return libLEMA_program;
	} else {
		console.error("libLEMA_GetProgramFromRepository: libLEMA_url is null");
	}
}

/** libLEMA_DefineURL **/
function libLEMA_DefineURL() {
	var window_location = window.location.toString();
	var running_editor = window_location.indexOf("/editor") != -1;
	var running_localhost = window_location.indexOf("/localhost") != -1;
	var run_official = (!running_editor && !running_localhost);
	var developer_ok = (typeof libLEMA_developer == "string");
	var file_url = null;
	if (run_official || !developer_ok) {
		file_url = libLEMA_official;
		/** lemaApp MAY BE running on LEMA platform **/
		if (typeof Lema != "function") {
			console.warn("LEMA platform not found");
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
	
	while (scene.cameras.length > 0) {
		scene.removeCamera(scene.cameras[0]);
	}
	
	for (idx = 0; idx < n; idx++) {
		child = libLEMA_scene.children[idx];
		lst_children_names.push(child.name);
		console.log("child.name", child.name);
	}
	
	for (idx = 0; idx < n; idx++) {
		child = libLEMA_program.getObjectByName(lst_children_names[idx]);
		if (child.type == "OrthographicCamera") {
			scene.addCamera(child);
		} else {
			scene.add(child);
		}
		if (child.type != "Script") {
			console.log("initialize:", child.name);
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
					btn_undo: lemaAppOnClickButtonUndo.bind(self),
					btn_submit: lemaAppOnClickButtonSubmit.bind(self)
				},
				onHandle: {
					on_resize: lemaAppOnResize.bind(self),
					on_restart: lemaAppOnRestart.bind(self)
				}
			}
		);
		/** init: this activity **/
		libLEMA.Activity.Initialize(
			lemaApp,
			lemaAppInitialize.bind(self),
			self,
			lemaAppUpdate.bind(self),
			"starfish"
		);
	}
}

/** EOF **/