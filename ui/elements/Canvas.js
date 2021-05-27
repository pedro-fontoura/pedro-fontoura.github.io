"use strict";

//Canvas constructor
function Canvas(parent)
{
	Division.call(this, parent);

	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.left = "0px";
	this.canvas.style.top = "0px";
	this.element.appendChild(this.canvas);
}

//Functions Prototype
Canvas.prototype = Object.create(Division.prototype);

//Update interface
Canvas.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	if(this.visible)
	{
		this.canvas.style.visibility = "visible";
	}
	else
	{
		this.canvas.style.visibility = "hidden";
	}
	
	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";
}