"use strict";

//LemaImage constructor
function LemaImage(parent)
{
	Division.call(this, parent);

	//Attributes
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";

	//LemaImage
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.element.appendChild(this.img);

	//Aditional atributes
	this.keep_aspect_ratio = true;
	this.scale = new THREE.Vector2(1,1);
}

//Functions Prototype
LemaImage.prototype = Object.create(Division.prototype);

//Set image onclick callback function
LemaImage.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
}

//Set LemaImage
LemaImage.prototype.setImage = function(image)
{
	this.img.src = image;
}

//Update Interface
LemaImage.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Set visibility
	if(this.visible)
	{
		this.img.style.visibility = "visible";
	}
	else
	{
		this.img.style.visibility = "hidden";
	}

	if(!this.keep_aspect_ratio)
	{
		this.img.width = (this.size.x * this.scale.x);
		this.img.height = (this.size.y * this.scale.y);
	}

	//Update atributes
	this.img.style.maxWidth = (this.size.x * this.scale.x) + "px";
	this.img.style.maxHeight = (this.size.y * this.scale.y) + "px";
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.scale.y))/2) + "px";
}
