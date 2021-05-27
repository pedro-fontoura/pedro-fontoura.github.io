"use strict";

//Text constructor
function Text(parent)
{
	Division.call(this, parent);

	//Element atributes
	this.element.style.display = "flex";
	this.element.style.flexDirection = "column";
	this.element.style.justifyContent = "center";
	this.element.style.textAlign = "center";
	this.element.style.pointerEvents = "none";
	this.element.style.color = "#FFFFFF";
	this.element.style.fontFamily = Lema.FontFamily;
	this.element.style.fontSize = "25px";
}

//Text alignment
Text.CENTER = 0;
Text.LEFT = 1;
Text.RIGHT = 2;

//Functions Prototype
Text.prototype = Object.create(Division.prototype);

//Set multi line
Text.prototype.setMultiLine = function(line)
{
	this.element.style.wordWrap = (line === true) ? "break-word" : "normal";
}

//Set Text
Text.prototype.setText = function(text)
{
	this.element.innerHTML = text;
}

//Set Text Size
Text.prototype.setTextSize = function(size)
{
	this.element.style.fontSize = size + "px";
}

//Set Text Color
Text.prototype.setTextColor = function(color)
{
	this.element.style.color = color;
}

//Set text alignment
Text.prototype.setAlignment = function(align)
{
	if(align === Text.CENTER)
	{
		this.element.style.textAlign = "center";
	}
	else if(align === Text.LEFT)
	{
		this.element.style.textAlign = "left";
	}
	else if(align === Text.RIGHT)
	{
		this.element.style.textAlign = "right";
	}
}
