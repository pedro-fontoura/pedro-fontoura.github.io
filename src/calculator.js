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

var libLEMA_developer = "http://localhost/lema-dev/libs/libLEMA_v1.nsp";

/** lemaApp globals
  * ============================================================
  **/

var lemaApp = {
	/** properties are defined by libLEMA before lemaAppInitialize **/
};

var calculator = {
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
	container: null
};

calculator.Initialize = function () {
	calculator.container = program.getObjectByName("calculator");
	var idx, k, p;
	for (idx = 0; idx < calculator.lst_keys.length; idx++) {
		k = calculator.lst_keys[idx];
		k = calculator.container.getObjectByName("key_" + k);
		p = k.getObjectByName("plane");
		p.userData.key = calculator.lst_keys[idx];
		p.userData.material = p.material;
		calculator.lst_clickable.push(p);
	}
	
	k = calculator.container.getObjectByName("answer");
	p = k.getObjectByName("plane");
	calculator.right = p.position.x + p.scale.x / 2;
	
	calculator.answer = k.getObjectByName("text");
	
	calculator.colors.hover = program.getMaterialByName("clr_highlight");
	calculator.colors.click = program.getMaterialByName("clr_1");
	calculator.colors.error = program.getMaterialByName("clr_2");
	calculator.colors.ok = program.getMaterialByName("clr_3");
	
	calculator.Reset();
};

calculator.Show = function (mode) {
	if (typeof mode == "undefined") {
		mode = true;
	}
	calculator.container.visible = Boolean(mode);
};

calculator.onKeyHover = function (key) {
	if (key == calculator.key_hover) {
		return;
	}
	calculator.onKeyOut();
	calculator.key_hover = key;
	if (key != calculator.key_click) {
		calculator.key_hover.material = calculator.colors.hover;
	}
};

calculator.onKeyOut = function (key) {
	if (calculator.key_hover !== null) {
		calculator.key_hover.material = calculator.key_hover.userData.material;
		calculator.key_hover = null;
	}
};

calculator.onKeyAction = function (key) {
	if (!calculator.container.visible) {
		return;
	}
	
	if (calculator.key_click !== null) {
		return;
	}
	
	calculator.key_click = key;
	var key_value = key.userData.key;
	var ok = true;
	
	if (key_value == "c") {
		calculator.allow_operator = false;
		calculator.Clear();
	} else if (key_value == "r") {
		calculator.allow_operator = false;
		calculator.Reset();
	} else if (key_value == "=") {
		calculator.allow_operator = false;
		calculator.Compute();
	} else {
		if (calculator.answer.text.length == calculator.max_length) {
			ok = false;
		} else {
			if ([",", "+", "-", ":", "x"].indexOf(key_value) != -1) {
				if (!calculator.allow_operator) {
					ok = false;
				} else {
					calculator.SetAnswerText(calculator.answer.text + key_value);
				}
				calculator.allow_operator = false;
			} else {
				calculator.SetAnswerText(calculator.answer.text + key_value);
				calculator.allow_operator = ("0" <= key_value && key_value <= "9");
			}
		}
	}
	
	console.log("calculator.allow_operator", calculator.allow_operator);
	
	calculator.key_click.material = (ok ? calculator.colors.click : calculator.colors.error);
	setTimeout(calculator.onAfterKeyAction, calculator.time_after_key_action);
};

calculator.onAfterKeyAction = function () {
	if (calculator.key_hover == calculator.key_click) {
		calculator.key_click.material = calculator.colors.hover;
	} else {
		calculator.key_click.material = calculator.key_click.userData.material;
	}
	calculator.key_click = null;
};

calculator.SetAnswerText = function (txt) {
	calculator.answer.setText(txt);
	var td = libLEMA.Tools.GetTextDimension(calculator.answer, true);
	calculator.answer.position.x = calculator.right - td.x - 0.25;
	calculator.answer.material = calculator.colors.ok;
};

calculator.Compute = function () {
	var result = calculator.Evaluate();
	var ok = !isNaN(result);
	if (ok) {
		calculator.SetAnswerText(result.replace(/\./, ","));
	}
	calculator.allow_operator = ok;
	calculator.answer.material = (ok ? calculator.colors.ok : calculator.colors.error);
	return result;
};

calculator.Evaluate = function () {
	var evaluate = calculator.answer.text;
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
			result = parseFloat(result).toFixed(calculator.decimals);
			result = parseFloat(result).toString();
		}
	} else {
		result = parseInt("LEMA");
	}
	
	return result;
};

calculator.GetValue = function () {
	return calculator.Evaluate();
};

calculator.Clear = function () {
	var txt = calculator.answer.text;
	if (txt.length > 0) {
		//txt = txt.substring(0, txt.length - 1);
		txt = txt.slice(0, -1);
		calculator.SetAnswerText(txt);
		if (txt.length > 0) {
			var k = txt[txt.length - 1];
			calculator.allow_operator = ("0" <= k && k <= "9");
		}
	}
};

calculator.Reset = function () {
	calculator.answer.setText("");
};

/** lemaApp Initialize
  * ============================================================
  **/

function lemaAppInitialize() {
	console.info("lemaAppInitialize");
	libLEMA.Template.GetObjectByName("lawn").visible = false;
	
	/** CALCULATOR initialize **/
	calculator.Initialize();
	window.calculator = calculator;
	
	/** prepare activity elements according to level **/
	lemaAppOnRestart(lemaApp.level);
}

/** lemaApp Update (animation loop)
  * ============================================================
  **/

function lemaAppUpdate() {
	if (!libLEMA.Template.mouse_over_button) {
		lemaApp.clicked = libLEMA.Tools.MouseOverObjectList(calculator.lst_clickable);
		if (lemaApp.clicked) {
			if (libLEMA.Mouse.just_pressed) {
				calculator.onKeyAction(lemaApp.clicked);
			} else {
				calculator.onKeyHover(lemaApp.clicked);
			}
		} else {
			calculator.onKeyOut();
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
	libLEMA.Template.SetTitle("Calculadora");
	
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

var libLEMA_official = 
	"https://raw.githubusercontent.com/MathAveiro/libLEMA_v1/master/libLEMA_v1.nsp";

/** nunuApp initialize **/
this.initialize = function() {
	console.info("activity_script.initialize");
	scene.visible = false;
	program.userData.time = Date.now();
	var libLEMA_url = libLEMA_DefineURL();
	if (libLEMA_url !== null) {
		/** load/parse/process libLEMA file **/
		console.log("\libLEMA URL:", libLEMA_url);
		/** FileSystem.readFileArrayBuffer: fname, sync, onLoad, onProgress **/
		var data1 = FileSystem.readFileArrayBuffer(libLEMA_url, true);
		console.log("\tFileSystem.readFileArrayBuffer:", Date.now() - program.userData.time, "ms");
		var pson = new dcodeIO.PSON.StaticPair();
		var data2 = pson.decode(data1);
		console.log("\tPSON.decode:", Date.now() - program.userData.time, "ms");
		var loader = new ObjectLoader();
		/** ObjectLoader.parse: json, onLoad  **/
		var libLEMA_program = loader.parse(data2);
		console.log("\tloader.parse:", Date.now() - program.userData.time, "ms");
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
			lemaAppUpdate.bind(self)
		);
	}
}

/** EOF **/