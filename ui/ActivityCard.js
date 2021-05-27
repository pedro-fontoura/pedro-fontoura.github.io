"use strict";

//Top bar constructor
function ActivityCard(parent, activity, id)
{
	Division.call(this, parent);
	
	this.activity = activity;
	
	var file_nr = activity.file.split("_")[0];
	
	this.element.title = [ activity.category, activity.subcategory, "#" + file_nr ].join(" | ");
	this.element.userData.id = id;
	this.element.userData.type = "card";
	this.setClickable(true);
	
	this.color_off = Lema.Colors.CARD_OFF;
	this.color_on = Lema.Colors.CARD_ON;
	this.color_text = Lema.Colors.CARD_TEXT;
	
	this.selected = false;
	// max implemented level
	this.max_level = parseInt( this.activity.levels.split("/")[0], 10 );
	if ( this.max_level == 0 ) {
		this.max_level = Lema.Const.LEVEL_MAX;
	}
	
	this.setColor(this.color_off);
	this.addBorder(1, this.color_off, 5);
	this.element.style.boxShadow = "0px 2px 5px " + Lema.Colors.CARD_SHADOW;

	var activity_file_nr = activity.file.split("_")[0];
	this.thumbnail = new LemaImage(this);
	this.thumbnail.setImage(Lema.imagePath + "atividade_" + activity_file_nr + ".jpg");

	this.title = new Text(this);
	this.title.setAlignment(Text.CENTER);
	this.title.setPositioningMode(Division.TOP_LEFT);
	this.title.setTextColor(this.color_text);
	this.title.setText("Atividade");
	this.title.element.style.alignContent = "flex-end";
	
	this.school = new Text(this);
	this.school.setAlignment(Text.CENTER);
	this.school.setPositioningMode(Division.TOP_RIGHT);
	// this.school.setTextColor(this.color_text);
	this.school.setTextColor("black");
	this.school.setText(activity.school + "&#x2218;");
	this.school.element.style.alignContent = "flex-end";
	this.school.element.style.background = this.color_off;
	this.school.element.style.borderRadius = "5px";
	
	this.level_zone = new Division(this);
	// this.level_zone.setColor(Lema.Colors.CARD_LEVEL_BG);
	this.level_zone.setPositioningMode(Division.TOP_LEFT);
	
	this.level = [];	// selected levels
	this.levels = [];	// level element (clickable)
	var lvl, n;
	for (n = Lema.Const.LEVEL_MIN; n <= Lema.Const.LEVEL_MAX; n++) {
		if ( n <= this.max_level ) {
			lvl = new Text(this.level_zone);
			lvl.element.id = "lvl";
			lvl.element.id_n = n;
			lvl.element.userData.id = n;
			lvl.element.userData.type = "card_level";
			lvl.setClickable(true);
			lvl.setPositioningMode(Division.TOP_LEFT);
			lvl.setAlignment(Text.CENTER);
			lvl.setPositioningMode(Division.TOP_LEFT);
			lvl.setTextColor(this.color_text);
			lvl.setText(n);
			
			// lvl.setAnchor(null, Lema.Colors.ANCHOR_BORDER_OFF, Lema.Colors.ANCHOR_HOVER);
			lvl.setButton(
				{background: "transparent", borderBottom: "solid 2px " + Lema.Colors.CARD_LEVEL_BG},
				{background: Lema.Colors.CARD_LEVEL_BG, borderBottom: "solid 1px " + this.color_on},
				{background: "white"}
			);
			// lvl.element.style.borderBottom = "solid 2px " + (this.level.indexOf(n) != -1 ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF);
			this.levels.push(lvl);
		}
	}
	
	this.setTitle(activity.name);
}

//Functions Prototype
ActivityCard.prototype = Object.create(Division.prototype);

ActivityCard.prototype.levelsSelectNone = function(update) {
	for (var n = 0; n < this.levels.length; n++) {
		this.levels[n].setButtonStatus( false );
	}
	while (this.level.length > 0) {
		this.level.pop();
	}
	if (update) {
		this.updateInterface();
	}
};

ActivityCard.prototype.levelsSelectAll = function(update) {
	this.levelsSelectNone();
	for (var n = 0; n < this.levels.length; n++) {
		this.levels[n].setButtonStatus( true );
	}
	for (var n = Lema.Const.LEVEL_MIN; n <= Lema.Const.LEVEL_MAX; n++) {
		if ( n <= this.max_level ) {
			this.level.push(n);
		}
	}
	if (update) {
		this.updateInterface();
	}
};

ActivityCard.prototype.levelsToggleOne = function(level_nr) {
	var idx = this.level.indexOf(level_nr);
	if (idx == -1) {
		this.level.push(level_nr);
	} else {
		this.level.splice(idx, 1);
	}
	this.level.sort();
};

//Adjust position: according to parrent scroll top
ActivityCard.prototype.adjustPosition = function() {
	this.element.userData.original_y = this.element.userData.y;
	this.element.userData.y = Math.round(this.element.userData.original_y - this.parent.scrollTop);
};

//Update Interface
ActivityCard.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	this.adjustPosition();
	
	/*
	if (this.element.userData.id == 0) {
		console.log("ActivityCard 0:", this.activity.name, this.element.userData);
	}
	*/
	
	this.setBorderColor();

	var padding = this.size.y * 2/100;
	var h1 = this.size.y * 0.68;
	var h1p = h1 - 2 * padding;
	var h2 = (this.size.y - h1) * 0.33;
	var h3 = (this.size.y - h1 - h2)
	var h2p = h2 - 1 * padding;
	var h3p = h3 - 1 * padding;
	var w1 = this.size.x;
	var w1p = this.size.x - 2 * padding;
	
	this.thumbnail.position.set(padding, padding);
	this.thumbnail.size.set(w1p, h1p);
	this.thumbnail.updateInterface();
	this.thumbnail.element.style.background = Lema.Colors.CARD_THUMB_BG;
	
	this.level_zone.position.set(padding, h1);
	this.level_zone.size.set(w1p, h2p);
	this.level_zone.updateInterface();
	
	var spacing = 2;
	var n, lvl, w = (w1p / Lema.Const.LEVEL_NR) - spacing;
	var px = spacing / 2;
	for (n = 0; n < this.levels.length; n++) {
		lvl = this.levels[n];
		lvl.size.set(w, h2p * 0.9);
		lvl.setTextSize(lvl.size.y * 0.75);
		lvl.position.set(px, 0);
		px += w + spacing;
		// lvl.element.style.borderBottom = "solid 2px " + (this.level.indexOf(n + 1) != -1 ? Lema.Colors.ANCHOR_BORDER_ON : Lema.Colors.ANCHOR_BORDER_OFF);
		lvl.setButtonStatus( lvl.is_on );
		if ( n >= this.max_level ) {
			lvl.visible = false;
		}
		lvl.updateInterface();
	}

	this.title.position.set(padding, h1 + h2);
	this.title.size.set(w1p, h3p);
	this.title.setTextSize(h3p * 0.45);
	this.title.updateInterface();
	
	this.school.position.set(0, 0);
	this.school.size.set(h1p * 0.27, h1p * 0.17);
	this.school.setTextSize(this.school.size.y * 0.66);
	this.school.updateInterface();
}

//Set button text
ActivityCard.prototype.setTitle = function(text)
{
	this.title.setText(text);
}

ActivityCard.prototype.addBorder = function(size, color, border_radius)
{
	this.element.style.borderStyle = "solid";
	this.element.style.borderWidth = size + "px";
	this.element.style.borderColor = (color !== undefined) ? color : this.color_off;
	if (border_radius) {
		this.element.style.borderRadius = border_radius + "px";
	}
}

ActivityCard.prototype.setBorderColor = function()
{
	this.element.style.borderColor = (this.selected) ? this.color_on : this.color_off;
	this.title.element.style.color = (this.selected) ? this.color_on : this.color_text;
}
