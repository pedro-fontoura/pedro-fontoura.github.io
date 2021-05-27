"use strict";

window.addEventListener("load", Initialize);

var table;
var order_by = "category";
var sort_fn = null;

function Initialize () {
	var list_buttons = document.getElementsByTagName("button"), idx, button;
	for (idx = 0; idx < list_buttons.length; idx++) {
		button = list_buttons[idx];
		button.addEventListener("click", onClickOrderButton);
	}
	table = document.getElementById("list");
	// sort by...
	var sort = window.location.href.split("=")[1];
	if (typeof sort != "string" || sort.length === 0) {
		sort = order_by;
	}
	document.getElementById("btn_" + sort).style.background = "orange";
	switch (sort) {
		case "category" :
			sort_fn = function(a, b) {
				if ( a.category !== b.category ) {
					return a.category < b.category;
				}
				return a.subcategory < b.subcategory;
			}
			break;
		case "name" :
			sort_fn = MakeOrderBy("name");
			break;
		case "file" :
			sort_fn = MakeOrderBy("file");
			break;
		case "status" :
			sort_fn = MakeOrderBy("status");
			break;
		case "school" :
			sort_fn = MakeOrderBy("school");
			break;
		case "levels" :
			sort_fn = MakeOrderBy("levels");
			break;
		case "task" :
			sort_fn = MakeOrderBy("task");
			break;
		case "programmer" :
			sort_fn = MakeOrderBy("programmer");
			break;
	}
	
	//Activities list
	var lst_all_activities = JSON.parse(FileSystem.readFile("activities/activities_new.json"));

	//Sort activities by category
	sortArray(lst_all_activities, sort_fn);
	
	//console.log("-- BEGIN: Activity.list");
	for (var idx = 0, a; idx < lst_all_activities.length; idx++) {
		a = lst_all_activities[idx];
		a.idx = idx;
		//console.log(idx, a.status, a.file, ">>", a.name);
		CreateListRow(idx, a);
	}
	//console.log("-- END: Activity.list");
}

function CreateListRow(n, activity) {
	var row, cell, row_nr = 0, cell_nr = 0, e;
	var asana = "https://app.asana.com/0/280987082824545/";
	row = table.insertRow(-1);
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = n;
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = activity.category;
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = "<span class='subcategory' style='color:"+activity.color+"'>" + activity.subcategory + "</span>";
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = "<b>" + activity.name + "</b>";
	
	cell = row.insertCell(cell_nr++);
	e = activity.file;
	cell.innerHTML = "<a href='run/?file=" + e + "' target='_blank'>" + e + "</a>";
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = (
		activity.status == "ok" ? "<span class='status_ok'>&#x2714;</span>" : activity.status
	);	
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = activity.levels;
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = activity.school;
	
	cell = row.insertCell(cell_nr++);
	if (activity.task && activity.task !== "") {
		e = asana + activity.task;
		cell.innerHTML = "<a href='" + e + "' target='_blank'>" + "Asana" + "</a>";
	} else {
		cell.innerHTML = "&nbsp;";
	}
	
	cell = row.insertCell(cell_nr++);
	cell.innerHTML = activity.programmer;
}

//Sort array
function sortArray(array, lessThan)
{
	if(lessThan === undefined)
	{
		lessThan = function(a, b)
		{
			return a < b;
		};
	}

	for(var i = 0; i < array.length; i++)
	{
		for(var j = i; j < array.length; j++)
		{
			if(lessThan(array[j], array[i]))
			{
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
		}
	}
}

function MakeOrderBy(label) {
	return function (a, b) {
		return a[label] < b[label];
	}
}

function onClickOrderButton(evt) {
	var label = evt.target.id.split("_")[1];
	self-location.replace("activities.html?order=" + label);
}