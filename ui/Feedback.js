"use strict";

//Feedback constructor
function Feedback(parent)
{
	this.MEDALHAS = false;
	
	Division.call(this, parent);

	//Next activity and repeat acitvity 
	this.onSuccess = null;
	this.onRepeat = null;
	this.onUp = null;
	this.onDown = null;
	this.onKeep = null;

	//Set invisible by default
	this.visible = false;
	
	//Nunu app pointer
	this.app = null;

	//Element atributes
	this.element.style.backgroundColor = Lema.Colors.VEIL_BG;
	this.element.style.opacity = Lema.Colors.VEIL_OPACITY;
	this.element.style.zIndex = "100";

	//Box
	this.box = new Division(this.parent);
	this.box.element.style.zIndex = "200";
	this.box.setColor(Lema.Colors.DIALOG_BG);
	this.box.element.style.borderRadius = "10px";

	//Animation
	this.image = new LemaImage(this.box);
	//this.image.setImage("");
	
	//Video
	this.video = new Video(this.box);

	//Text
	this.text = new Text(this.box);
	this.text.setTextColor(Lema.Colors.FEEDBACK_TXT);

	//Message
	this.message = new Text(this.box);
	this.message.setTextColor(Lema.Colors.FEEDBACK_MSG);

	var id = "_";
	//Confirm button
	if ( true || Lema.User.is_student ) {
		id = "continue";
	}
	this.button = new Button(this.box, id, true);
	this.button.name = "confirm";
	this.button.setText("---");
	Lema.Sound.RegisterButton( "finish" );

	//Repeat button
	if ( true || Lema.User.is_student ) {
		id = "repeat";
	}this.button_repeat = new Button(this.box, id, true);
	this.button_repeat.name = "repeat";
	this.button_repeat.setText("Repetir");
	
	//UP
	if ( true || Lema.User.is_student ) {
		id = "level_up";
	}
	this.button_up = new Button(this.box, id, true);
	this.button_up.name = "up";
	this.button_up.setText("Subir o nível");
	
	//DOWN
	if ( true || Lema.User.is_student ) {
		id = "level_down";
	}
	this.button_down = new Button(this.box, id, true);
	this.button_down.name = "down";
	this.button_down.setText("Descer o nível");

	//KEEP
	if ( true || Lema.User.is_student ) {
		id = "level_keep";
	}
	
	this.button_keep = new Button(this.box, id, true);
	this.button_keep.name = "keep";
	this.button_keep.setText("Manter o nível");

	//MENU
	if ( true || Lema.User.is_student ) {
		id = "menu";
	}
	
	this.button_menu = new Button(this.box, id, true);
	this.button_menu.name = "menu";
	this.button_menu.setText("Menu");

	//Solution button
	/*
	this.button_solution = new Button(this.box);
	this.button_solution.name = "eye";
	this.button_solution.setText("Resolução");
	*/
	
	/** **/
	this.buttons = [];
	this.buttons.push(this.button);
	this.buttons.push(this.button_up);
	this.buttons.push(this.button_keep);
	this.buttons.push(this.button_down);
	this.buttons.push(this.button_repeat);
	this.buttons.push(this.button_menu);
	
	var idx, btn;
	for (idx = 0; idx < this.buttons.length; idx++) {
		btn = this.buttons[idx];
		btn.visible = false;
		btn.setPositioningMode(Division.BOTTOM_RIGHT);
		btn.setColor( Lema.Const.Feedback.BTN_BG_NORMAL, Lema.Const.Feedback.BTN_BG_OVER );
		btn.text.setTextColor( Lema.Const.Feedback.BTN_FG_NORMAL );
		btn.setTextScale( Lema.Const.Feedback.BTN_TEXT_SCALE );
		btn.setIconScale( Lema.Const.Feedback.BTN_ICON_SCALE );
		btn.setIcon(Lema.iconPath + "btn_" + btn.name + ".png" );
		btn.element.onmouseover = this.onmouseoverButton.bind(btn);
		btn.element.onmouseleave = this.onmouseleaveButton.bind(btn);
		btn.icon.VSPACE = 4;
	}
}

Feedback.prototype = Object.create(Division.prototype);

Feedback.prototype.onmouseoverButton = function() {
	this.text.setTextColor( Lema.Const.Feedback.BTN_FG_OVER );
};

Feedback.prototype.onmouseleaveButton = function() {
	this.text.setTextColor( Lema.Const.Feedback.BTN_FG_NORMAL );
};

//Show dialog window
Feedback.prototype.show = function(feedback)
{	
	if(feedback !== undefined)
	{
		console.log("feedback data:", feedback);
		var self = this;
		
		var attempts_n = Math.min( feedback.attempts, Lema.Const.ATTEMPTS_MAX );
		
		//Feeback message
		this.message.setText( feedback.message !== undefined ? feedback.message : "" );

		//LemaImage/animation
		this.image.visible = false;
		this.image.updateInterface();
		this.video.visible = false;
		this.video.updateInterface();
		
		if(feedback.result === "SUCCESS") {
			this.video.setVideo(
				Lema.videoPath + "win_" + attempts_n + ".mp4",
				attempts_n != 1
			);
			this.video.visible = true;
			this.video.n = attempts_n;
			this.video.restart();
			if ( this.MEDALHAS ) {
				var n = Math.min( feedback.attempts, Lema.Const.ATTEMPTS_MAX + 1 );
				this.image.setImage(Lema.imagePath + "prize-" + n + ".png");
				this.image.visible = true;
			}
		} else {
			if (feedback.result == "END") {
				this.image.setImage(Lema.imagePath + "default_win.gif");
			} else { // Lost, Skipped
				this.image.setImage(Lema.imagePath + "default_lost.gif");
			}
			this.image.visible = true;
		}
		
		if ( this.image.visible ) {
			this.image.element.style.cursor = "pointer";
			this.image.setOnClick(
				function () {
					Lema.screen.feedback.image.setImage( Lema.screen.feedback.image.img.src );
				}
			);
		}

		//Set feedback text
		if(feedback.result === "SUCCESS") {
			var txt = Lema.Const.Feedback["SUCCESS_" + attempts_n];
			this.text.setText(txt);
		}
		else if(feedback.result === "FAIL") {
			var txt = Lema.Const.Feedback["FAIL_" + attempts_n];
			this.text.setText(txt);
		}
		else if(feedback.result === "SKIP") {
			var txt = Lema.Const.Feedback["FAIL_" + attempts_n];
			this.text.setText(txt);
		}
		else if(feedback.result === "END") {
			this.text.setText(Lema.Const.Feedback.END_1);
		}
		else {
			this.text.setText("Problema com dados");
			this.message.setText(JSON.stringify(feedback));
			this.image.setImage("data/banana.gif");
			this.element.style.backgroundColor = "#FFC534";
		}
		
		this.button_repeat.visible = true;

		//Set button text and icon
		if(feedback.result === "FAIL")
		{
			this.button.visible = false;
			this.button_up.visible = false;
			this.button_keep.visible = false;
			this.button_down.visible = false;
			
		}
		else if(feedback.result === "SKIP")
		{
			this.button.visible = true;
			if ( feedback.end_sequence ) {
				this.button.setText( "Terminar" );
				this.button.id = "finish";
				this.button.setIcon(Lema.iconPath + "btn_finish.png" );
			} else {
				this.button.setText( "Continuar" );
				this.button.id = "continue";
				this.button.setIcon(Lema.iconPath + "btn_next.png" );
			}
			this.button_up.visible = false;
			this.button_keep.visible = true;
			this.button_down.visible = (Lema.app_level_idx > 0);

			//If there is a solution available show solution button
			if(feedback.solution === true)
			{
				this.button_solution.visible = true;
				this.button_solution.setOnClick(function()
				{
					self.app.sendData("solution");
					self.hide();
				});
			}
		}
		else // Win | End
		{
			if(feedback.result === "SUCCESS")
			{
				this.button.visible = true;
				if ( feedback.end_sequence ) {
					this.button.setText( "Terminar" );
					this.button.id = "finish";
					this.button.setIcon(Lema.iconPath + "btn_finish.png" );
				} else {
					this.button.setText( "Continuar" );
					this.button.id = "continue";
					this.button.setIcon(Lema.iconPath + "btn_next.png" );
				}
				this.button_repeat.visible = false;
				this.button_up.visible = (Lema.app_level_idx < Lema.app_lst_levels.length - 1);
				this.button_keep.visible = true;
				this.button_down.visible = false;
			}
			else // End
			{
				this.button.visible = false;
				this.button_repeat.visible = false;
				this.button_up.visible = false;
				this.button_keep.visible = false;
				this.button_down.visible = false;
			}

		}

		//Ignore mode
		if(feedback.ignore === true)
		{
			console.warn("I G N O R E");
			this.button_solution.visible = false;
			this.button_repeat.visible = false;

			this.button.setText("Continuar");
			this.button.setIcon("data/icons/confirm_black.png");
			this.button.text.setTextColor("#000000");

			this.button.setOnClick(function()
			{
				self.hide();
			});
		}
	}
	
	/** click handlers **/
	
	this.button_menu.visible = true;
	if (this.button_menu.visible) {
		this.button_menu.setOnClick(
			function() {
				self.hide();
				if(self.onMenu !== null) {
					self.onMenu();
				}
			}
		);
	}
	
	if (this.button.visible) {
		this.button.setOnClick(
			function() {
				self.hide();
				if(self.onSuccess !== null) {
					self.onSuccess();
				}
			}
		);
	}
	
	if (this.button_repeat.visible) {
		this.button_repeat.setOnClick(
			function() {
				self.hide();
				if(self.onRepeat !== null) {
					self.onRepeat();
				}
			}
		);
	}
	
	if (this.button_up.visible) {
		this.button_up.setOnClick(
			function() {
				self.hide();
				if(self.onUp !== null) {
					self.onUp();
				}
			}
		);
	}
	
	if (this.button_down.visible) {
		this.button_down.setOnClick(
			function() {
				self.hide();
				if(self.onDown !== null) {
					self.onDown();
				}
			}
		);
	}
	
	if (this.button_keep.visible) {
		this.button_keep.setOnClick(
			function() {
				self.hide();
				if(self.onKeep !== null) {
					self.onKeep();
				}
			}
		);
	}
	
	/** **/
	
	this.visible = true;
	this.updateInterface();
}

//Attach app to feedback box
Feedback.prototype.setApp = function(app)
{
	this.app = app;
}

//Hide feedback
Feedback.prototype.hide = function()
{
	this.visible = false;
	this.updateInterface();
}

//Update interface
Feedback.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);
	
	var idx, btn
	var nr_buttons = this.buttons.length, nr_visible_buttons = 0;
	for (idx = 0; idx < nr_buttons; idx++) {
		btn = this.buttons[idx];
		btn.visible = this.visible && btn.visible;
		if (btn.visible) {
			nr_visible_buttons += 1;
		}
	}

	this.box.visible = this.visible;
	if (nr_visible_buttons <= -2017) {
		this.box.size.set(this.size.x - this.size.y * 0.45, this.size.y * 0.85);
	} else {
		var w = Math.min( this.size.x - this.size.y * 0.15, 1024 );
		this.box.size.set(w, this.size.y * 0.85);
	}
	this.box.position.set((this.size.x - this.box.size.x)/2, (this.size.y - this.box.size.y)/2);
	this.box.element.style.borderRadius = (this.size.y * 0.02) + "px";
	this.box.updateInterface();

	/** VIDEO **/
	var aspect, w, h;
	if ( this.video.n == 1 ) {
		aspect = 400 / 550;
		w = this.box.size.y * 0.8;
		h = w * aspect;
	} else {
		aspect = 500 / 1000;
		h = this.box.size.y * 0.74;
		w = h / aspect;
	}
	
	this.video.visible = this.video.visible && this.visible;
	this.video.size.set(w, h);
	this.video.position.set(this.box.size.x * 0.5 - w / 2, this.box.size.y * 0.2);
	this.video.updateInterface();

	/** IMAGE **/
	if (!this.visible) {
		this.image.visible = false;
	}
	if ( this.video.visible ) {
		if ( this.MEDALHAS ) {
			this.image.size.set(this.box.size.y * 0.25, this.box.size.y * 0.25);
			this.image.position.set(
				this.box.size.x - this.image.size.x * 1.20,
				this.image.size.y * 0.20
			);
			this.video.element.style.zIndex = 0;
			this.image.element.style.zIndex = 1;
			this.text.element.style.zIndex = 2;
		}
	} else {
		this.image.size.set(this.box.size.y * 0.4, this.box.size.y * 0.4);
		this.image.position.set(this.box.size.x * 0.5 - this.box.size.y * 0.2, this.box.size.y * 0.35);
	}
	this.image.updateInterface();

	/** text **/
	this.text.visible = this.visible;
	this.text.size.set(this.box.size.x, this.box.size.y * 0.25);
	this.text.position.set(0, 0);
	this.text.setTextSize(this.box.size.y * 0.10);
	this.text.updateInterface();

	/** message **/
	this.message.visible = this.visible;
	this.message.size.set(this.box.size.x, this.box.size.y * 0.5);
	this.message.position.set(0, 0);
	this.message.setTextSize(this.box.size.y * 0.07);
	this.message.updateInterface();
	
	/** buttons **/
	var padding = this.box.size.y * 0.04;
	var x = padding;
	var h = this.box.size.y * 0.10;
	var w = ((this.box.size.x - padding) / nr_buttons) - padding;
	if (nr_visible_buttons <= 2) {
		w *= 1.5;
		x = (this.box.size.x - nr_visible_buttons * w) / 2;
	} else {
		x += (nr_buttons - nr_visible_buttons) * ((w + padding) / 2);
	}
	
	for (idx = 0; idx < nr_buttons; idx++) {
		btn = this.buttons[idx];
		btn.size.set(w, h);
		btn.position.set(x, padding);
		if (btn.visible) {
			x += w + padding;
		}
		btn.updateInterface();
	}

	/*
	this.button.visible = this.visible && this.button.visible;
	this.button.size.set(this.box.size.y * 0.5, this.box.size.y * 0.12);
	this.button.position.set(this.box.size.y * 0.05, this.box.size.y * 0.05);
	this.button.addBorder(this.box.size.y * 0.01, "#000000");
	this.button.updateInterface();

	this.button_repeat.visible = this.button_repeat.visible && this.visible;
	this.button_repeat.size.copy(this.button.size);
	this.button_repeat.position.set((this.box.size.x - this.button.size.x) / 2, this.button.position.y);
	this.button_repeat.addBorder(this.box.size.y * 0.01, "#000000");
	this.button_repeat.updateInterface();

	this.button_solution.visible = this.button_solution.visible && this.visible;
	this.button_solution.size.set(this.box.size.y * 0.5, this.box.size.y * 0.12);
	this.button_solution.position.set(this.box.size.y * 0.05, this.box.size.y * 0.05);
	this.button_solution.addBorder(this.box.size.y * 0.01, "#000000");
	this.button_solution.updateInterface();
	*/
}