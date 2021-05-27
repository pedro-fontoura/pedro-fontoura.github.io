"use strict";

//FirstLaunch constructor
function FirstLaunch(parent)
{
	Division.call(this, parent);

	//Top bar
	this.top = new Division(this);
	this.top.setColor("#5b87c5");

	//Lema
	this.lema = new LemaImage(this.top);
	this.lema.setImage("data/lema.png");

	//Log in
	this.login = new TextButton(this);
	this.login.setTextScale(0.5);
	this.login.setColor("#5b87c5", "#7c7c7c");
	this.login.setText("Entrar");

	//New user
	this.new = new TextButton(this);
	this.new.setTextScale(0.5);
	this.new.setColor("#6aa542", "#7c7c7c");
	this.new.setText("Novo Utilizador");

	//Skip
	this.skip = new Text(this);
	this.skip.setTextColor("#7c7c7c");
	this.skip.setText("Prosseguir sem criar utilizador");
}

//Functions Prototype
FirstLaunch.prototype = Object.create(Division.prototype);

//Update interface elements
FirstLaunch.prototype.updateInterface = function()
{
	this.size.set(window.innerWidth, window.innerHeight);

	Division.prototype.updateInterface.call(this);

	//Top Bar
	this.top.size.set(this.size.x, this.size.y * 0.25);
	this.top.updateInterface();

	//Name
	this.lema.size.set(this.top.size.y * 2.4, this.top.size.y * 0.8);
	this.lema.position.set((this.top.size.x - this.lema.size.x) * 0.5, this.top.size.y * 0.1);
	this.lema.updateInterface();

	//Login
	this.login.size.set(this.size.y*0.5, this.size.y * 0.1);
	this.login.position.set((this.size.x - this.login.size.x) * 0.5, this.size.y * 0.4);
	this.login.updateInterface();

	//New user
	this.new.size.set(this.size.y*0.5, this.size.y * 0.1);
	this.new.position.set((this.size.x - this.new.size.x) * 0.5, this.size.y * 0.53);
	this.new.updateInterface();

	//Skip
	this.skip.size.set(this.size.x, this.size.y * 0.1);
	this.skip.setTextSize(this.size.y * 0.035);
	this.skip.position.set(0, this.size.y * 0.62)
	this.skip.updateInterface();

}
