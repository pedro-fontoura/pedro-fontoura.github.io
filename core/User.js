"use strict";

//Object to store user data
function User()
{
	this.id = THREE.Math.generateUUID();

	this.name = "username";
	this.email = "";
	this.birthdate = new Date();
	this.gender = User.MALE;

	this.timestamp = 0;
}

//Gender
User.MALE = 0;
User.FEMALE = 1;