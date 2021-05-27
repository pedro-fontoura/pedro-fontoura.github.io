/**

SoundManager
	Manage sounds with Web Audio API
	Pedro Fontoura

	V.1 - 27.apr.2014
 
**/

"use strict";

var SoundManager = {
	verbose: false,
	audio_context: null,
	audio_buffers: {},
	loading: null,
	load_time: null,
	callback: null,
	load_list: {
	},
	playing: {
		lst_labels: [],
		lst_sources: [],
		lst_el: []
	},
	initialize: true,
	sequence: {
		on: false
	}
};

SoundManager.PlaySequence = function ( lst_labels, callback ) {
	if ( SoundManager.sequence.on ) {
		console.warn("SoundManager.PlaySequence >> already playing a sequence");
		return;
	}
	SoundManager.sequence.on = true;
	SoundManager.sequence.callback = callback;
	SoundManager.sequence.lst_labels = [];
	var idx, label;
	for ( idx = 0; idx < lst_labels.length; ++ idx ) {
		label = lst_labels[ idx ];
		SoundManager.sequence.lst_labels.push( label );
	}
	console.log("SoundManager.PlaySequence:", "BEGIN");
	SoundManager.PlaySequence_Item();
};

SoundManager.PlaySequence_Item = function () {
	if ( SoundManager.sequence.lst_labels.length > 0 ) {
		var label = SoundManager.sequence.lst_labels.shift();
		console.log("SoundManager.PlaySequence:", label);
		SoundManager.Play( label, SoundManager.PlaySequence_Item );
	} else { //** Sequence ended
		console.log("SoundManager.PlaySequence:", "END");
		SoundManager.sequence.on = false;
		if ( typeof SoundManager.sequence.callback == "function" ) {
			SoundManager.sequence.callback();
		}
	}
};

SoundManager.Initialize = function (parameters) {
	if ( SoundManager.initialize ) {
		parameters = parameters || {};
		for (var p in parameters) {
			SoundManager[p] = parameters[p];
		}
		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			SoundManager.audio_context = new AudioContext();
			return true;
		} catch(e) {
			console.error(
				"SoundManager.Initialize >> "
				+ "Web Audio API is not supported in this browser"
			);
			return false;
		}
		SoundManager.initialize = false;
	}
};

SoundManager.LoadAndDecodeList = function (lst, path, callback) {
	if (this.loading) {
		console.warn("SoundManager.LoadAndDecodeList: already loading");
		return false;
	}
	SoundManager.load_list.lst = lst;
	SoundManager.load_list.path = path;
	SoundManager.load_list.callback = callback;
	SoundManager.load_list.idx = 0;
	SoundManager.LoadAndDecodeListElement();
	return SoundManager.load_list.lst.length;
};

SoundManager.LoadAndDecodeListElement = function () {
	if (SoundManager.load_list.idx < SoundManager.load_list.lst.length) {
		var element = SoundManager.load_list.lst[SoundManager.load_list.idx];
		SoundManager.load_list.idx += 1;
		if (SoundManager.verbose) {
			console.log(
				"SoundManager.LoadAndDecodeListElement:",
				SoundManager.load_list.idx,
				"/",
				SoundManager.load_list.lst.length,
				element[0],
				element[1]
			);
		}
		SoundManager.LoadAndDecodeFile(
			element[0],
			SoundManager.load_list.path + element[1],
			SoundManager.LoadAndDecodeListElement
		);
	} else {
		SoundManager.load_list.lst = null;
		SoundManager.load_list.idx = null;
		if (typeof SoundManager.load_list.callback == "function") {
			var callback = SoundManager.load_list.callback;
			SoundManager.load_list.callback = null;
			callback();
		}
	}
};

SoundManager.LoadAndDecodeFile = function (label, url, callback) {
	if (this.loading) {
		console.warn("SoundManager.LoadAndDecodeFile: already loading");
		return false;
	}
	if (SoundManager.verbose) {
		console.log("SoundManager >> loading:", url, label);
	}
	SoundManager.loading = label;
	SoundManager.load_time = Date.now();
	SoundManager.callback = callback;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer'; // binary data
	xhr.addEventListener("load", SoundManager.onLoadFile);
	xhr.addEventListener("error", SoundManager.onError);
	if (SoundManager.verbose) {
		xhr.addEventListener("progress", SoundManager.UpdateProgress);
	}
	xhr.send();
	return true;
};

SoundManager.UpdateProgress = function (evt) {
	if (evt.lengthComputable) {
		var percent = 100 * evt.loaded / evt.total;
		//console.log("SoundManager >> loading", percent.toFixed(2), "%");
	} 
};

SoundManager.onLoadFile = function () {
	if (SoundManager.verbose) {
		SoundManager.load_time = Date.now() - SoundManager.load_time;
		console.log("SoundManager >> LOADED", SoundManager.loading, SoundManager.load_time / 1E3, "s");
		console.log("SoundManager >> decoding:", SoundManager.loading);
	}
	SoundManager.audio_context.decodeAudioData(
		this.response,
		SoundManager.onDecodeAudioBuffer,
		SoundManager.onError
	)
};

SoundManager.onDecodeAudioBuffer = function (buffer) {
	var label = SoundManager.loading;
	if (SoundManager.verbose) {
		console.log("SoundManager >> ready:", SoundManager.loading);
	}
	SoundManager.audio_buffers[SoundManager.loading] = buffer;
	SoundManager.loading = null;
	if (typeof SoundManager.callback == "function") {
		SoundManager.callback(label);
	}
};

SoundManager.onError = function (e) {
	console.error("SoundManager.onError >> ", e);
};

SoundManager.Play = function (label, callback) {
	if (SoundManager.verbose) {
		console.log("SoundManager >> play:", label);
	}
	if (SoundManager.playing.lst_labels.length) {
		SoundManager.Stop(label); // stop if playing
	}
	var source = SoundManager.audio_context.createBufferSource();
	
	if (SoundManager.audio_buffers[label] instanceof AudioBuffer) {
		source.buffer = SoundManager.audio_buffers[label];
		source.connect(SoundManager.audio_context.destination);
		var f = function(e) {
			SoundManager.onEndedSound(label, null);
			if (typeof callback == "function") {
				callback(label, e.target);
			}
		};
		source.addEventListener("ended", f);
		source.start(0);
		SoundManager.playing.lst_labels.push(label);
		SoundManager.playing.lst_sources.push(source);
		var idx = SoundManager.playing.lst_el.push(f);
		return (idx - 1);
	} else {
		console.error("SoundManager.Play >> no AudioBuffer:", label);
		return -1;
	}
};

SoundManager.IsPlaying = function () {
	return ( SoundManager.playing.lst_labels.length > 0 );
};

SoundManager.StopAll = function () {
	var count = SoundManager.playing.lst_labels.length;
	while (SoundManager.playing.lst_labels.length) {
		SoundManager.Stop(SoundManager.playing.lst_labels[0], 0);
	}
	return count;
};

SoundManager.Stop = function (label, idx) {
	if (typeof idx != "number") {
		idx = SoundManager.playing.lst_labels.indexOf(label);
	}
	if (idx != -1) {
		var source = SoundManager.playing.lst_sources[idx];
		source.removeEventListener("ended", SoundManager.playing.lst_el[idx]);
		source.stop();
		SoundManager.onEndedSound(label, idx);
	}
	return idx;
};

SoundManager.onEndedSound = function (label, idx) {
	if (typeof idx != "number") {
		idx = SoundManager.playing.lst_labels.indexOf(label);
	}
	SoundManager.playing.lst_sources.splice(idx, 1);
	SoundManager.playing.lst_labels.splice(idx, 1);
	SoundManager.playing.lst_el.splice(idx, 1);
	return idx;
};

/* EOF */