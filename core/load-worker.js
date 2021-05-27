/** ------------------------------------------------------------

  Web Worker: Load a file using a XMLHttpRequest
  
  Message data:
	{ 
		url :: string
		progress :: boolean
	}

  * ------------------------------------------------------------
  **/

"use strict";

// var window = {};

// try {
	// importScripts( "../libs/nunu.min_201709132313.js" );
// } catch ( e ) {
// }

var LoadWorker = {
	time: null,
	xhr: null,
	url: null,
	progress: true
};

LoadWorker.onMessage = function ( evt ) {
	if ( evt.data.url ) {
		LoadWorker.url = evt.data.url;
		if ( typeof evt.data.progress == "boolean" ) {
			LoadWorker.progress = evt.data.progress;
		}
		console.log("| LoadWorker.url:", LoadWorker.url);
		LoadWorker.xhr = new XMLHttpRequest();
		LoadWorker.xhr.addEventListener( "load", LoadWorker.onLoad );
		if ( LoadWorker.progress ) {
			LoadWorker.xhr.addEventListener( "progress", LoadWorker.onProgress );
		}
		LoadWorker.xhr.open( "GET", LoadWorker.url );
		LoadWorker.xhr.responseType = "arraybuffer";
		LoadWorker.time = Date.now();
		LoadWorker.xhr.send();
	} else {
		console.error("| LoadWorker.onMessage >> Say what?");
	}
};

LoadWorker.onLoad = function ( evt ) {
	LoadWorker.time = Date.now() - LoadWorker.time;
	LoadWorker.arraybuffer = LoadWorker.xhr.response;
	
	var time_seconds = LoadWorker.time / 1E3;
	var length_kb = LoadWorker.arraybuffer.byteLength / 1024;
	var rate_kbps = Math.round( length_kb / time_seconds );
	console.log("| LoadWorker.onLoad:", Math.round( length_kb ), "KB", "/", LoadWorker.time, "ms", "=", rate_kbps, "KB/s");
	
	if ( 1 ) {
		postMessage( LoadWorker.arraybuffer, [LoadWorker.arraybuffer] );	
	} else {
		var pson_static_pair = new dcodeIO.PSON.StaticPair;
		var time = Date.now();
		var data = pson_static_pair.decode(LoadWorker.arraybuffer);
		console.log("\tPSON.decode:", Date.now() - time);
		var object_loader = new ObjectLoader;
		var program = object_loader.parse( data );
		console.log("\tloader.parse:", Date.now() - time);
		postMessage( program );
	}

	close();
};

LoadWorker.onProgress = function ( evt ) {
	if ( evt.lengthComputable ) {
		var percent = Math.ceil( evt.loaded / evt.total * 100 );
		console.log("| LoadWorker.onProgress:", percent );
		postMessage( { percent: percent } );
	}
};

onmessage = LoadWorker.onMessage;

// EOF