"use strict";

//InputText constructor
function LemaInputField( parent, type, name, placeholder, parameters )
{
	Division.call(this, parent);

	// Attributes
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";

	// Input field
	if ( type == "select" ) {
		this.input = document.createElement("select");
	} else {
		this.input = document.createElement("input");
		this.input.type = type;
	}
	this.input.name = name;
	this.input.id = [ "input", name ].join( "_" );
	this.input.placeholder = placeholder;
	this.input.style.border = "solid 1px #999";
	this.input.style.color = "#000";
	
	if ( type == "select" ) {
		var option_idx, option;
		for ( var option_idx in parameters.options ) {
			option = document.createElement("option");
			option.value = option_idx; //parameters.options[ option_idx ];
			option.innerHTML = parameters.options[ option_idx ];
			this.input.appendChild( option );
		}
	} else {
		for ( var key in parameters ) {
			this.input[ key ] = parameters[ key ];
		}
	}
	
	if ( this.input.type == "number" ) {
		this.input.style.textAlign = "center";
	} else {
		this.input.style.paddingLeft = "5px";
		this.input.style.paddingRight = "5px";
	}
	
	this.element.appendChild(this.input);

}

//Functions Prototype
LemaInputField.prototype = Object.create(Division.prototype);


//Set Text Size
LemaInputField.prototype.setTextSize = function(size)
{
	this.input.style.fontSize = size + "px";
}

//Update Interface
LemaInputField.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	
	this.input.style.width = (this.size.x * 0.99 - 2 * 10) + "px";
	this.input.style.height = (this.size.y - 4) + "px";
};
