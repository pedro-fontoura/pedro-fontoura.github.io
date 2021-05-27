/** ------------------------------------------------------------
  * LEMA activity identification
  * ------------------------------------------------------------
  
    Filename:		
	Asana task:	
    
  * ------------------------------------------------------------
	
	History:
	
	- 
	
  
  * ------------------------------------------------------------
  * LEMA (C) Geometrix, Aveiro University
  * ------------------------------------------------------------
  **/

//var libLEMA_developer = "http://localhost/lema-dev/libs/libLEMA_v1.isp";

/** lemaApp globals
  * ============================================================
  **/

var lemaApp = {
	/** properties are defined by libLEMA before lemaAppInitialize **/
};

var cube;
var base_y;
var delta_r = {x: 0, y: 0, z: 0};

var info_e;
var info_txt, x, y, s;

var COLOR_ON = "DarkGreen";
var COLOR_OFF = "Black";

/** lemaApp Initialize
  * ============================================================
  **/

function lemaAppInitialize() {
	console.info("lemaAppInitialize");
	
	libLEMA.Template.SetTitle("Test kinect.");
	libLEMA.Template.lawn.visible = true;
	
	libLEMA.Template.buttons.btn_submit.container.visible = false;
	
	cube = scene.getObjectByName("cube");
	base_y = libLEMA.Template.lawn.position.y + libLEMA.Template.lawn.scale.y / 2;
	
	libLEMA.Kinect.SetCallback(
		{
			onopen: onKinectEvent,
			onclose: onKinectEvent,
			onerror: onKinectEvent
		}
	);
	
	/** make HTML info zone **/
	info_e = document.createElement("div");
	info_e.style.zIndex = 100;
	info_e.style.background = "rgba(255, 255, 255, 0.5)";
	info_e.style.padding = "5px";
	info_e.style.position = "absolute";
	info_e.style.bottom = "30px";
	info_e.style.right = "30px";
	info_e.style.color = "black";
	info_e.style.width = "110px";
	info_e.style.lineHeight = "18px";
	info_e.style.fontWeight = "bold";
	info_e.style.fontFamily = "monospace";
	document.body.appendChild(info_e);
	
	/** make HTML control zone **/
	var control_e = document.createElement("div");
	control_e.style.zIndex = 100;
	control_e.style.background = "rgba(255, 255, 255, 0.5)";
	control_e.style.padding = "5px";
	control_e.style.position = "absolute";
	control_e.style.bottom = "30px";
	control_e.style.left = "30px";
	control_e.style.color = "black";
	control_e.style.lineHeight = "18px";
	document.body.appendChild(control_e);
	
	/** textbox **/
	var e = document.createElement("input");
	e.id = "txt_url";
	e.type = "text";
	//e.value = "ws://echo.websocket.org";
	e.value = "ws://127.0.0.1:8181";
	control_e.appendChild(e);
	
	/** button: open **/
	e = document.createElement("button");
	e.id = "btn_open";
	e.innerHTML = "open";
	e.addEventListener("click", onCickButton);
	e.style.color = COLOR_OFF;
	control_e.appendChild(e);
	
	/** button: close **/
	e = document.createElement("button");
	e.id = "btn_close";
	e.innerHTML = "close";
	e.addEventListener("click", onCickButton);
	e.style.color = COLOR_ON;
	control_e.appendChild(e);
	
	/** button: cursor **/
	e = document.createElement("button");
	e.id = "btn_cursor";
	e.innerHTML = "cursor";
	e.addEventListener("click", ToggleCursor);
	e.style.marginLeft = "10px";
	e.style.color = COLOR_OFF;
	control_e.appendChild(e);
	
	/** reset **/
	ToggleCursor();
	lemaAppOnClickButtonRestart();
}

/** lemaApp Update (animation loop)
  * ============================================================
  **/

function lemaAppUpdate() {
	if (!libLEMA.Template.mouse_over_button) {
		
		/** user MAY be interacting with lemaApp objects **/
		if (libLEMA.Mouse.just_pressed) {
			/** user clicked something... (not a button) **/
			lemaApp.clicked = libLEMA.Tools.MouseOverObject(cube);
			//lemaApp.clicked = libLEMA.Tools.MouseOverObjectList(some_container.children);
			if (lemaApp.clicked) {
				/** user clicked a lemaApp object **/
				lemaAppOnClickObject(lemaApp.clicked);
			}
		}
		
	}
	
	if (!libLEMA.DragAndDrop.dragging && !libLEMA.DragAndDrop.moving) {
		cube.rotation.x += delta_r.x;
		cube.rotation.y += delta_r.y;
		cube.rotation.z += delta_r.z;
	}
	
	UpdateInfo();
}

function UpdateInfo() {
	if (libLEMA.Kinect.on) {
		x = libLEMA.Kinect.ndc.x;
		y = libLEMA.Kinect.ndc.y;
		s = "kinect";
	} else {
		x = (libLEMA.Mouse.position.x / libLEMA.Template.canvas.width) * 2 - 1;
		y = (-libLEMA.Mouse.position.y / libLEMA.Template.canvas.height) * 2 + 1;
		s = "mouse";
	}
	info_txt = "x: " + x.toFixed(3);
	info_txt += "<br>y: " + y.toFixed(3);
	info_txt += "<br>pressed: " + libLEMA.Mouse.target_pressed;
	info_txt += "<br>source: " + s;
	info_e.innerHTML = info_txt;

}

/** lemaApp OnRestart
  * ============================================================
  *		app_level: 1..5
  **/

function lemaAppOnRestart(app_level) {
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
	libLEMA.DragAndDrop.Set(object, onReleaseCube);
}

function onReleaseCube(obect, delta) {
	if (delta.y !== 0) {
		libLEMA.DragAndDrop.MoveObjectTo(cube, {x: cube.position.x, y: base_y});
		SetDeltaR();
	}
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
	cube.rotation.set(0.2, 0.2, 0);
	cube.position.set(0, base_y, 0);
	delta_r = {x: 0, y: 0, z: 0};
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

function ToggleCursor() {
	var status = libLEMA.Template.activity_program.canvas.style.cursor;
	status = (status == "default" ? "none" : "default");
	libLEMA.Template.activity_program.canvas.style.cursor = status;
	eById("btn_cursor").style.color = (status == "default" ? COLOR_ON : COLOR_OFF);
}

function onCickButton(evt) {
	var id = evt.target.id.split("_")[1];
	if (id == "open") {
		libLEMA.Kinect.Open(eById("txt_url").value);
	} else {
		libLEMA.Kinect.Close();
	}
}

function onKinectEvent(evt) {
	switch (evt.type) {
		case "open":
			libLEMA.Sound.PlayByName("beep-21");
			eById("btn_open").style.color = COLOR_ON;
			eById("btn_close").style.color = COLOR_OFF;
			break;
		case "close":
			libLEMA.Sound.PlayByName("beep-24");
			eById("btn_open").style.color = COLOR_OFF;
			eById("btn_close").style.color = COLOR_ON;
			break;
		default:
			libLEMA.Sound.PlayByName("beep-27");
			break;
	}
}

function SetDeltaR() {
	var k = 1E-3;
	delta_r.x = k * libLEMA.Math.RandomInt(-1, 1);
	delta_r.y = k * libLEMA.Math.RandomInt(-1, 1);
	delta_r.z = k * libLEMA.Math.RandomInt(-1, 1);
	console.log("SetDeltaR", delta_r);
}

function eById(id) {
	return document.getElementById(id);
}

/** ------------------------------------------------------------
  * Init / Update / Load / Process
  * ------------------------------------------------------------
  * Do NOT edit or write code past this point!
  *	You will go to hell if you do...
  * ------------------------------------------------------------
  **/

var libLEMA_official = 
	"https://raw.githubusercontent.com/MathAveiro/libLEMA_v1/master/libLEMA_v1.isp";

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
		console.log("\tFileSystem.readFile:", Date.now() - program.userData.time, "ms");
		var data2 = JSON.parse(data1);
		console.log("\tJSON.parse:", Date.now() - program.userData.time, "ms");
		var loader = new ObjectLoader();
		/** ObjectLoader.parse: json, onLoad  **/
		var libLEMA_program = loader.parse(data2);
		console.log("\tloader.parse:", Date.now() - program.userData.time, "ms");
		/** process libLEMA program elements **/
		libLEMA_ProcessProgram(libLEMA_program);
		console.log("\libLEMA_ProcessProgram:", Date.now() - program.userData.time, "ms");
		/** wait for libLEMA_script.initialize and libLEMA definition **/
		setTimeout(libLEMA_WaitProgramInitialize.bind(libLEMA_program), 1E3 / 60);
	}
};

/** nunuApp update **/
this.update = function() {
};

/** libLEMA_DefineURL **/
function libLEMA_DefineURL() {
	var window_location = window.location.toString();
	var running_editor = window_location.indexOf("/editor") != -1;
	var running_localhost = window_location.toString().indexOf("/localhost") != -1;
	var run_official = (!running_editor && !running_localhost);
	var file_url = null;
	var developer_ok = (typeof libLEMA_developer == "string" && libLEMA_developer.length > 0);
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
	}
	
	for (idx = 0; idx < n; idx++) {
		child = libLEMA_program.getObjectByName(lst_children_names[idx]);
		if (child.type == "OrthographicCamera") {
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
					on_resize: lemaAppOnResize.bind(self),
					on_restart: lemaAppOnRestart.bind(self)
				}
			}
		);
		/** init: this activity **/
		libLEMA.Activity.Initialize(lemaApp, lemaAppInitialize.bind(self));
		libLEMA.Activity.SetUpdate(self, lemaAppUpdate.bind(self));
	}
}

/** EOF **/