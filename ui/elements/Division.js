"use strict";

//Division constructor
function Division(parent)
{
	//Element parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else if(parent instanceof Division)
	{
		this.parent = parent.element;
	}
	else
	{
		this.parent = parent;
	}
	
	//Base element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	this.parent.appendChild(this.element);
	
	//Element atributes
	this.mode = Division.TOP_LEFT;
	this.visible = true;
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	
	this.userData = {};
	
	//Absolute position
	this.element.userData = {
		mode: this.mode,
		x: null,
		y: null
	};
}

//Division position pivot
Division.TOP_LEFT = 0;
Division.TOP_RIGHT = 1;
Division.BOTTOM_LEFT = 2;
Division.BOTTOM_RIGHT = 3;

//==
Division.prototype.setClickable = function(mode) {
	console.assert(this.element.userData);
	if (typeof mode == "undefined") {
		mode = true;
	}
	this.element.userData.clickable = mode;
	this.element.style.cursor = ( mode ? "pointer" : "default" );
};

//==
Division.prototype.setExternalAnchor = function( url, bg_normal, bg_hover ) {
	this.setAnchor( url, bg_normal, bg_hover, null, null, true );
};

Division.prototype.setAnchor = function(url, bg_normal, bg_hover, border_normal, border_hover, extern)
{
	this.element.style.pointerEvents = "auto";
	this.element.style.cursor = "pointer";
	if (typeof url == "string") {
		this.element.addEventListener(
			"click",
			function () { Lema.Goto.URL(url, extern) }
		);
	} else if (typeof url == "function") {
		this.element.addEventListener(
			"click",
			url
		);
	}
	
	if (bg_normal) {
		// var border_n = (border_normal ? border_normal : "transparent");
		this.element.addEventListener(
			"mouseout",
			function (evt) {
				evt.target.style.backgroundColor = bg_normal;
				// evt.target.style.borderBottom = "solid 2px " + border_n;
				// console.log("mouseout", border_n);
			}
		);
	}
	if (bg_hover) {
		// var border_h = (border_hover ? border_hover : "transparent");
		this.element.addEventListener(
			"mouseover",
			function (evt) {
				evt.target.style.backgroundColor = bg_hover;
				// evt.target.style.borderBottom = "solid 2px " + border_h;
				console.log("mouseover", evt instanceof Event, evt.type);
			}
		);
	}
};

//==
Division.prototype.setButton = function( lst_style_off, lst_style_on, lst_style_hover ) {
	this.button_mode = {
		lst_style_off: lst_style_off,
		lst_style_on: lst_style_on,
		lst_style_hover: lst_style_hover,
		is_on: false
	};
	this.element.obj = this;
	this.element.style.pointerEvents = "auto";
	this.element.style.cursor = "pointer";
	this.element.addEventListener(
		"mouseover", this.setButtonStatus.bind( this )
	);
	this.element.addEventListener(
		"mouseout", this.setButtonStatus.bind( this )
	);
	this.setButtonStatus();
};

Division.prototype.setButtonStatus = function( e ) {
	var mouse = 0;
	if ( e instanceof Event ) {
		mouse = ( e.type == "mouseover" ? 1 : -1 );
	}
	var lst_style, style_key;
	if ( mouse == 1 ) {
		lst_style = this.button_mode.lst_style_hover;
	} else { // mouse == 0 || mouse == -1
		if ( mouse == 0 && e != undefined ) {
			this.is_on = e;
		}
		lst_style = ( this.is_on ? this.button_mode.lst_style_on : this.button_mode.lst_style_off );
	}
	// apply style
	for ( style_key in lst_style ) {
		this.element.style[ style_key ] = lst_style[ style_key ];
	}
};

//Set division callback function
Division.prototype.setOnClick = function(callback)
{
	this.element.onclick = callback;
}

//Set positioning mode
Division.prototype.setPositioningMode = function(mode)
{
	this.mode = mode;
	this.element.userData.mode = mode;
}

//Set element color
Division.prototype.setColor = function(color)
{
	this.element.style.backgroundColor = color;
	this.color = color;
}

//Remove element
Division.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update division Size
Division.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Base element position
	if(this.mode === Division.TOP_LEFT || this.mode === Division.TOP_RIGHT)
	{
		this.element.style.top = this.position.y + "px";
		this.element.style.bottom = "";
	}
	else
	{
		this.element.style.bottom = this.position.y + "px";
		this.element.style.top = "";
	}

	if(this.mode === Division.TOP_LEFT || this.mode === Division.BOTTOM_LEFT)
	{
		this.element.style.left = this.position.x + "px";
		this.element.style.right = "";
	}
	else if(this.mode === Division.TOP_RIGHT || this.mode === Division.BOTTOM_RIGHT)
	{
		this.element.style.right = this.position.x + "px";
		this.element.style.left = "";
	}

	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	else if(this.fit_parent_y) {
		this.size.y = this.parent.offsetHeight; 
	}
	else if(this.fit_parent_x) {
		//console.log(this.parent.offsetWidth);
		this.size.x = this.parent.offsetWidth;
	}
	
	//Update element size
	if (this.size.x) {
		this.element.style.width = this.size.x + "px";
	} else {
		this.element.style.width = "";
	}
	this.element.style.height = this.size.y + "px";
	
	// set absolute position
	if (this.element.style.left) {
		this.element.userData.x = this.position.x;
	} else {
		this.element.userData.x = this.element.parentElement.offsetWidth - this.position.x - this.size.x;
	}
	if (this.element.style.top) {
		this.element.userData.y = this.position.y;
	} else {
		this.element.userData.y = this.element.parentElement.offsetHeight - this.position.y - this.size.y;
	}
	
	/*
	if (this.element.id == "card_0") {
		console.log(this.element.id, this.element.userData.x, this.element.userData.y);
	}
	*/
	
	var p = this.element.parentElement, l, t;
	if (p != document.body) {
		/*
		if (p.style.left) {
			l = parseInt(p.style.left);
		} else {
			l = p.parentElement.offsetWidth - parseInt(p.style.right) - parseInt(p.style.width);
		}
		if (p.style.top) {
			t = parseInt(p.style.top);
		} else {
			t = p.parentElement.offsetHeight - parseInt(p.style.bottom) - parseInt(p.style.height);
		}
		if (this.element.id == "card_0") {
			//console.log(p, p.userData);
		}
		*/
		l = p.userData.x;
		t = p.userData.y;
		
		this.element.userData.x += l;
		this.element.userData.y += t;
		p = p.parentElement;
	}
	
	if (this.element.id == "card_0") {
		//console.log("\t", this.element.userData.x, this.element.userData.y);
	}
	
	this.element.userData.x = Math.round(this.element.userData.x);
	this.element.userData.y = Math.round(this.element.userData.y);
	
	if (this.scroll) {
		var size = Math.round(this.size.y / 25);
		this.scroll.up.style.fontSize = size + "px";
		this.scroll.up.style.width = size + "px";
		this.scroll.up.style.height = size + "px";
		this.scroll.down.style.fontSize = size + "px";
		this.scroll.down.style.width = size + "px";
		this.scroll.down.style.height = size + "px";
	}
}