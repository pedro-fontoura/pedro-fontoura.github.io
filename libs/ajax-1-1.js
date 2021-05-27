// JS class for handling XHR
// Author:	Pedro Fontoura | lado-de-la.nocturno.org
// Date:	Mar 2014

/*
History

v1.1 (set.2014)
- "object busy" detection: requests are queued
- added "default" and "by request" parameters
- added JSON
- if "JSON parse error", "failure handler" is called

v1.0 (mar.2014)
- uses a single XMLHTTP object
- no "object busy" detection on request

*/


/*
REF: "MDN: custom objects, prototype functions"
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript#Custom_objects

REF: "W3C: XMLHttpRequest Level 2, W3C Working Draft 17 January 2012"
	 http://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/
     http://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/#event-handlers

		Event handlers
		   client.onloadstart
		   client.onprogress
		   client.onabort
		   client.onerror
		   client.onload
		   client.ontimeout
		   client.onloadend
		   client.onreadystatechange
*/
function AJAX (parameters) {
	// properties
	this.parameters = {
		method: "POST",
		server: "",
		path: "",
		file: "",
		values: "",
		data: null,
		json: false,
		success: null,
		failure: null
	}
	this.request_count = 0;
	this.xmlhttp = null;
	this.headers = [];
	/* init */
	if (! this.ProcessParameters(parameters)) return false;
	return (this.NewObjectXMLHTTP() == true);
}

AJAX.prototype.NewObjectXMLHTTP = function () {
	if (window.XMLHttpRequest) {
		this.xmlhttp = new XMLHttpRequest();
	} else {
		if (window.ActiveXObject) {
			try { this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP") }
			catch (e) {
				try { this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP") }
				catch (e) { }
			}
		}
	}
	if (!this.xmlhttp) {
		console.error("AJAX >> could NOT get XMLHttpRequest object");
		return;
	}
	this.xmlhttp.busy = false;
	this.xmlhttp.request_count = 0;
	this.xmlhttp.queue = [];
	this.xmlhttp.args = {};
	this.xmlhttp.parent = this;
	
	this.xmlhttp.onprogress = function (x) {
		//console.log("progress:", x.loaded, x.total);
	}
	
	this.xmlhttp.onreadystatechange = function () {
		/* REF: http://www.w3.org/TR/2012/WD-XMLHttpRequest-20120117/#states */
		//var states = ["UNSENT", "OPENED", "HEADERS_RECEIVED", "LOADING", "DONE"];
		//console.log("AJAX " + this.args.id + " : state >> " + this.readyState + " >> " + states[this.readyState]);
		if (this.readyState != this.DONE) return;
	}
	
	this.xmlhttp.onload = function () {
		if (this.status != 200) {
			console.error("AJAX " + this.args.id + " : status >> " + this.status + " : " + this.statusText);
			if (this.args.failure) this.args.failure(this.status, this.statusText);
		} else { // HTML status: 200 OK
			//console.log("AJAX " + this.args.id + " : text >> " + this.responseText);
			if (this.args.success) {
				var response = this.responseText, error = null;
				if (this.args.json) {
					try {
						response = JSON.parse(this.responseText)
					} catch (e) {	
						error = e;
					}
				}
				if (!error) {
					this.args.success(response);
				} else if (this.args.failure) {
					this.args.failure(error.name, error.message);
				}
			}
		}
		// any queued requests?
		if (this.queue.length == 0) {
			this.busy = false;
		} else {
			this.parent.MakeRequestXMLHTTP();
		}
	}
}

AJAX.prototype.MakeRequestXMLHTTP = function () {
	this.xmlhttp.busy = true;
	for (var k in this.xmlhttp.queue[0]) {
		this.xmlhttp.args[k] = this.xmlhttp.queue[0][k];
	}
	this.xmlhttp.queue.shift();
	var url = this.xmlhttp.args.server + this.xmlhttp.args.path + this.xmlhttp.args.file;
	//console.log("AJAX " + this.xmlhttp.args.id + " >> " + this.xmlhttp.args.method + " >> " + url);
	if (this.xmlhttp.args.method == "POST") {
		/* ========== POST ========== */
		this.xmlhttp.open("POST", url, true);
		for (var k in this.headers) {
			this.xmlhttp.setRequestHeader(this.headers[k].name, this.headers[k].value);
		}
		if (typeof this.xmlhttp.args.values == "string") {
			this.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		try { this.xmlhttp.send(this.xmlhttp.args.values) }
		catch (e) {
			console.error("AJAX " + this.xmlhttp.args.id + " >> " + e.name + " >> " + e.message);
			return false;
		}
	} else if (this.xmlhttp.args.method == "GET") {
		/* ========== GET ========== */
		url += "?" + this.xmlhttp.args.values;
		this.xmlhttp.open("GET", url, true);
		try { this.xmlhttp.send(null) }
		catch (e) {
			console.error("AJAX " + this.xmlhttp.args.id + " >> " + e.name + " >> " + e.message);
			return false;
		}
	} else {
		console.error("AJAX " + this.xmlhttp.args.id + " >> method: " + this.xmlhttp.args.method + "?");
		return false;
	}
	return true;
}

AJAX.prototype.xhr = function(parameters) {
	var args = this.CopyParameters(parameters);
	if (args == null) return -1;
	this.QueueRequest(args);
	if (this.xmlhttp.busy)  {
		//console.log("AJAX " + this.request_count + " >> queued...");
		return 0;
	}
	this.MakeRequestXMLHTTP();
	return 1;
}

AJAX.prototype.ProcessParameters = function (parameters) {
	if (! parameters) return true;
	if (typeof parameters != "object") {
		console.error("AJAX >> bad parameters");
		return false;
	}
	for (var k in parameters) {
		if (typeof this.parameters[k] != "undefined") {
			this.parameters[k] = parameters[k];
		} else {
			console.error("AJAX >> unknown parameter: " + k);
		}
	}
	return true;
}

AJAX.prototype.CopyParameters = function (parameters) {
	if (parameters && typeof parameters != "object") {
		console.error("AJAX >> bad parameters");
		return null;
	}
	for (var k in parameters) {
		if (typeof this.parameters[k] == "undefined") {
			console.error("AJAX >> unknown parameter: " + k);
			return null;
		}
	}
	var args = {};
	for (var k in this.parameters) {
		if (typeof parameters[k] != "undefined") {
			args[k] = parameters[k];
		} else {
			args[k] = this.parameters[k];
		}
	}
	return args;
}

AJAX.prototype.QueueRequest = function (parameters) {
	var args = {};
	for (var k in parameters) args[k] = parameters[k];
	args.id = ++this.request_count;
	args.method = args.method.toUpperCase();
	this.xmlhttp.queue.push(args);
}
