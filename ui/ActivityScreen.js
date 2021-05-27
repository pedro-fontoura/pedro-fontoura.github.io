"use strict";

//ActivityScreen screen constructor
function ActivityScreen(parent)
{
	Division.call(this, parent);

	//Topbar
	this.top_bar = new TopBar(this);
	
	//Canvas
	this.canvas = new Canvas(this);

	//Dialog
	this.dialog = new Dialog(this);

	//Feedback
	this.feedback = new Feedback();

	//Nunu app
	this.app = new NunuApp(this.canvas.canvas);

	//Attach app to feedback
	this.feedback.setApp(this.app); // ??

	var id;
	//Back
	id = ( Lema.User.is_student ) ? ( "menu" ) : ( "_" );
	this.back_button = new Button(this, id);
	this.back_button.setIcon( Lema.iconPath + "btn_menu.png" );
	this.back_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.back_button.setPositioningMode(Division.BOTTOM_LEFT);
	this.back_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.back_button.setText("Menu");
	this.back_button.setColor(Lema.Colors.TOPBAR_BG, Lema.Colors.BTN_HOVER);
	this.back_button.visible = false;
	
	// Submit
	id = ( Lema.User.is_student ) ? ( "done" ) : ( "_" );
	this.submit_button = new Button(this, id);
	this.submit_button.setIcon( Lema.iconPath + "btn_submit.png" );
	this.submit_button.setIconScale( Lema.Const.BTN_ICON_SCALE );
	this.submit_button.setPositioningMode(Division.BOTTOM_RIGHT);
	this.submit_button.setTextScale( Lema.Const.BTN_TEXT_SCALE );
	this.submit_button.setText("Feito");
	this.submit_button.setColor(Lema.Colors.BTN_SUBMIT, Lema.Colors.BTN_HOVER);
	this.submit_button.visible = false;
	
	//
	if ( Lema.User.is_student ) {
		Lema.Sound.RegisterDialogue( "back_to_menu" );
		Lema.Sound.RegisterButton( "yes" );
		Lema.Sound.RegisterButton( "no" );
	}
}

ActivityScreen.prototype = Object.create(Division.prototype);

//Set back button active state
ActivityScreen.prototype.setBackButton = function(value)
{
	var app = this.app;

	this.back_button.visible = value;
	this.back_button.updateInterface();
	
	this.back_button.setOnClick(
		// DIALOG: back (from app) to menu?
		function() {
			libLEMA.Template.ActivityPause();
			app.pause();
			Lema.screen.dialog.show(
				Lema.Const.Dialog.TXT_BACK_TO_MENU,
				function()  { // YES
					app.exit();
					Activity.Selection.Clear();
					Lema.Goto.URL( "index.html" );
				},
				true,
				function() { // NO
					libLEMA.Template.ActivityResume();
					app.resume();
				}
			);
			if ( Lema.User.is_student ) {
				Lema.SoundManager.Play( "dlg_back_to_menu" );
			}
		}
	);
};

//Set submit button active state
ActivityScreen.prototype.setSubmitButton = function(value, fn)
{
	this.submit_button.visible = value;
	this.submit_button.updateInterface();
	this.submit_button.setOnClick( fn );
};

//Load activity from file
// ActivityScreen.prototype.loadActivity = function(activity)
// {
	// this.app.loadProgram(Lema.activityPath + activity.file);

	// var feedback = this.feedback;
	// this.app.setOnDataReceived(function(data)
	// {
		// //Show dialog with data
		// feedback.show(data);
		// feedback.size.set(window.innerWidth, window.innerHeight);
		// feedback.updateInterface();
	// });

	// this.app.run();
// }

//Update interface elements
ActivityScreen.prototype.updateInterface = function()
{
	Division.prototype.updateInterface.call(this);

	//Top bar
	this.top_bar.size.set(this.size.x, this.size.y * Lema.Const.Layout.TOP_BAR_HEIGHT);
	this.top_bar.updateInterface();

	//Canvas 
	var w = this.size.x;
	var h = this.size.y * (1 - Lema.Const.Layout.TOP_BAR_HEIGHT);
	this.canvas.size.set(w, h);
	this.canvas.position.set(0, this.size.y * Lema.Const.Layout.TOP_BAR_HEIGHT);
	this.canvas.updateInterface();
	
	//Feedback box
	this.feedback.size.set(window.innerWidth, window.innerHeight);
	this.feedback.updateInterface();

	//Resize nunu program
	this.app.resize();

	//Dialog
	this.dialog.size.copy(this.size);
	this.dialog.updateInterface();
	
	//Back
	var h = (this.size.y - this.top_bar.size.y) * (1 - 0.90);
	var pp = 0.15;
	var p = h * pp;
	h = h * (1 - 2 * pp);
	
	this.back_button.size.set(h * 4, h);
	this.back_button.position.set(p, p);
	this.back_button.updateInterface();
	
	// Submit
	
	this.submit_button.size.set(h * 4, h);
	this.submit_button.position.set(p, p);
	this.submit_button.updateInterface();
}
