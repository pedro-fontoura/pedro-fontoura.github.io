"use strict";

//Video constructor
function Video(parent)
{
	Division.call(this, parent);

	//Attributes
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";

	//Video
	this.video = document.createElement("video");
	this.video.style.pointerEvents = "none";
	this.video.style.position = "absolute";
	this.element.appendChild(this.video);

	//Aditional atributes
	this.keep_aspect_ratio = true;
	this.scale = new THREE.Vector2(1,1);
	this.tapume = null;
	this.userData = {};
	this.video.userData = {};
}

//Functions Prototype
Video.prototype = Object.create(Division.prototype);

//Set video onclick callback function
Video.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
}

//Set Video
Video.prototype.setVideo = function(video_src, tapume)
{
	if ( this.video != null ) {
		this.element.removeChild( this.video );
		this.video = document.createElement("video");
		this.video.style.pointerEvents = "none";
		this.video.style.position = "absolute";
		this.video.userData = {};
	}
	console.assert( video_src.endsWith(".mp4"), video_src );
	var src = document.createElement("source");
	src.src = video_src;
	src.type = "video/mp4";
	this.video.appendChild(src);
	this.element.appendChild(this.video);
	if ( tapume ) {
		this.tapume = new Division( this.element );
		this.tapume.setPositioningMode( Division.BOTTOM_LEFT );
		this.tapume.setColor( "white" );
		this.tapume.element.zIndex = 10;
	}
	//this.video.autoplay = true;
}

//restart
Video.prototype.restart = function() {
	this.video.currentTime = 0;
	this.video.play();
};

//Update Interface
Video.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	
	//Set visibility
	if(this.visible)
	{
		this.video.style.visibility = "visible";
	}
	else
	{
		this.video.style.visibility = "hidden";
	}

	if(!this.keep_aspect_ratio)
	{
		this.video.width = (this.size.x * this.scale.x);
		this.video.height = (this.size.y * this.scale.y);
	}
	if ( this.tapume ) {
		this.tapume.size.set( this.size.x, this.size.y * 0.19 );
		this.tapume.position.set( 0, 0 );
		this.tapume.visible = this.visible;
		this.tapume.updateInterface();
	}

	//Update atributes
	this.video.style.maxWidth = (this.size.x * this.scale.x) + "px";
	this.video.style.maxHeight = (this.size.y * this.scale.y) + "px";
	this.video.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";
	this.video.style.top = ((this.size.y - (this.size.y * this.scale.y))/2) + "px";
}
