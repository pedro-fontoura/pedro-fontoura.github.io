"use strict";

//Base object to store activities
function Activity()
{
	//Metadata
	this.name = ""
	this.description = "";
	this.version = "";

	//Dificulty and public target
	this.dificulty = 0;
	this.target = "";

	//Category
	this.category = null;
	this.subcategory = null;

	//Validation status
	this.status = "ok";

	//URL and activity format
	this.format = "";
	this.file = "";
}


// =============================================================================

//Activity list
Activity.list = null;

Activity.LoadActivitiesList = function () {
	// load and parse activities json file
	var lst_all_activities = JSON.parse( FileSystem.readFile( "activities/activities_new.json" ) );
	// Sort activities by: category, subcategory, school
	sortArray( 
		lst_all_activities,
		function( a, b ) {
			if( a.category !== b.category ) {
				return a.category < b.category;
			}
			if ( a.subcategory !== b.subcategory ) {
				return a.subcategory < b.subcategory;
			}
			return a.school < b.school;
		}
	 );
	// Create Activity.list: sorted, verified, status == OK
	// verified: category exists, subcategory exists on category
	Activity.list = [];
	var activity, activity_idx = 0, idx;
	for ( idx = 0; idx < lst_all_activities.length; idx++ ) {
		activity = lst_all_activities[ idx ];
		if ( Activity.VerifyActivityInfo( activity ) && activity.status == "ok" ) {
			activity.idx = activity_idx;
			activity_idx += 1;
			Activity.list.push( activity );
		}
	}
};

Activity.LoadCategoriesAndSubacategories = function () {
	// Load categories ( and subacategories ) list: Activity.categories
	var lst_categories = JSON.parse( FileSystem.readFile( "activities/categories.json" ) );
	Activity.categories = [];
	for ( var idx = 0; idx < lst_categories.length; ++ idx ) {
		Activity.categories.push( lst_categories[ idx ] );
	}
};
// =============================================================================

Activity.Selection = {
	keys: [
		"count_nr",
		"current_idx",
		
		"lst_activity_idx",
		"lst_activity_status",
		
		"lst_lst_level",
		"lst_level_idx",
		
		"cache_idx"
	]
};

Activity.Selection.Info = function () {
	Lema.HorizontalRuler();
	console.log("count_nr:", Activity.Selection.GetCountNr() );
	console.log("current_idx:", Activity.Selection.GetCurrentIdx() );
	Lema.HorizontalRuler();
	
	function AppStartToText ( app_stat ) {
		var lst_stat_txt = ["init", "current", "success", "fail"];
		return lst_stat_txt[ app_stat ].toUpperCase();
	};
	
	var lst_activity_idx = Activity.Selection.GetListActivityIdx();
	var lst_activity_status = Activity.Selection.GetListActivityStatus();
	var lst_lst_level = Activity.Selection.GetListListLevel();
	var lst_level_idx = Activity.Selection.GetListLevelIdx();
	
	var idx, activity_idx, activity, lst_level, level_idx;
	for ( idx = 0; idx < lst_activity_idx.length; ++ idx ) {
		activity_idx = lst_activity_idx[ idx ];
		activity = Activity.list[ activity_idx ];
		lst_level = lst_lst_level[ idx ];
		level_idx = lst_level_idx[ idx ];
		console.log(
			idx,
			activity_idx,
			activity.file,
			AppStartToText( lst_activity_status[ idx ] ),
			lst_level,
			lst_level[ level_idx ]
		);
	}
	Lema.HorizontalRuler();
};


Activity.Selection.GetSequenceData = function () {
	var lst_activity_idx = Activity.Selection.GetListActivityIdx();
	var lst_lst_level = Activity.Selection.GetListListLevel();
	
	var lst = [];
	
	var idx, activity_idx, activity, lst_level, activity_nr;
	for ( idx = 0; idx < lst_activity_idx.length; ++ idx ) {
		activity_idx = lst_activity_idx[ idx ];
		activity = Activity.list[ activity_idx ];
		activity_nr = activity.file.split("_")[0];
		lst_level = lst_lst_level[ idx ];
		// console.log(idx, activity_nr, lst_level);
		lst.push( { nr: activity_nr, levels: lst_level } );
	}
	
	return lst;
};

Activity.Selection.MakeRandom = function ( lst_categories, count_nr, school_max ) {
	if ( school_max == undefined ) {
		school_max = Infinity;
	}
	
	console.log("Activity.Selection.MakeRandom:", lst_categories, count_nr, school_max );
	
	var selection_count = 0, selection_list = [];
	var n, activity, lst_activities = [], lst_candidates = [];
	
	/** filter activity list: category && school **/
	// console.log("filtering...");
	for ( n = 0; n < Activity.list.length; ++ n ) {
		activity = Activity.list[ n ];
		if ( lst_categories.indexOf( activity.category ) != -1 ) {
			if ( activity.school <= school_max ) {
				lst_candidates.push( activity );
				// console.log("\t", activity.category, activity.school, activity.file);
			}
		}
	}
	console.log("candidate activities count:", lst_candidates.length);
	console.assert( lst_candidates.length >= count_nr );
	
	/** select from candidate activities **/
	while ( lst_candidates.length > 0 && selection_count < count_nr ) {
		selection_count += 1;
		n = Math.randomInt( 0, lst_candidates.length - 1 );
		activity = lst_candidates[ n ];
		// console.log("\t", selection_count, activity.category, activity.school, activity.file);
		lst_activities.push( activity );
		lst_candidates.splice( n, 1 );
	}
	
	Activity.Selection.UpdateFromActivityList( lst_activities );
	return lst_activities.length;
};

Activity.Selection.UpdateFromActivityList = function ( lst_activity ) {
	Activity.Selection.Clear();
	
	var idx, n, activity, level_max, lst_level, lst_lst_level = [], lst_activity_idx = [];
	for ( idx = 0; idx < lst_activity.length; ++ idx ) {
		activity = lst_activity[ idx ];
		lst_activity_idx.push( activity.idx );
		level_max = parseInt( activity.levels.split("/")[0], 10 );
		if ( level_max == 0 ) {
			level_max = 1;
		}
		lst_level = [];
		for ( n = 1; n <= level_max; ++ n ) {
			lst_level.push( n );
		}
		lst_lst_level.push( lst_level );
	}
	Activity.Selection.SetListActivityIdx( lst_activity_idx );
	Activity.Selection.SetListListLevel( lst_lst_level );
	
	Activity.Selection.SetCountNr( lst_activity.length );
	Activity.Selection.SetCurrentIdx( 0 );
};

/*
	"count_nr",
	"current_idx",

	"lst_activity_idx",
	"lst_activity_status",

	"lst_lst_level",
	"lst_level_idx",

	"cache_idx"
*/
Activity.Selection.SetFromSequenceList = function ( sequence_list ) {
	console.log("-- Activity.Selection.SetFromSequenceList");
	var lst_level, lst_lst_level = [], lst_activity_idx = [];	
	var idx, sequence_item, activity_idx;
	
	for ( idx = 0; idx < sequence_list.length; ++ idx ) {
		sequence_item = sequence_list[ idx ];
		activity_idx = Activity.GetIdxByFileName( sequence_item.ficheiro );
		lst_activity_idx.push( activity_idx );
		
		lst_level = sequence_item.lst_levels.split(",");
		lst_lst_level.push( lst_level );
	}
	
	//** SET: lst_activity_idx, lst_activity_status
	Activity.Selection.SetListActivityIdx( lst_activity_idx );
	
	//** SET: lst_lst_level, lst_level_idx
	Activity.Selection.SetListListLevel( lst_lst_level );
	
	//** SET: count_nr, current_idx
	Activity.Selection.SetCountNr( sequence_list.length );
	//** set: by Lema.Goto.MultipleActivityScreen
	Activity.Selection.SetCurrentIdx( 0 );
	//** set: by Lema.Goto.MultipleActivityScreen
	// Activity.Selection.SetCacheIdx( 1 );
};

Activity.Selection.Clear = function () {
	var i, k;
	for ( i in Activity.Selection.keys ) {
		k = Activity.Selection.keys[ i ];
		Lema.ClientStorage.RemoveItem( k );
	}
};

Activity.Selection.UpdateToCard = function ( card, selection_idx ) {
	card.selected = true;
	card.level = [];
	// update levels
	var lst_lst_level = Activity.Selection.GetListListLevel();
	var lst_level = lst_lst_level[ selection_idx ];
	for ( var idx = 0; idx < lst_level.length; ++ idx ) {
		card.level.push( parseInt(lst_level[ idx ], 10) );
	}
	for ( var idx = 0; idx < card.max_level; ++ idx ) {
		card.levels[ idx ].is_on = ( lst_level.indexOf( String(idx + 1) ) != -1 );
	}
};

Activity.Selection.UpdateFromCard = function ( card, delta_count ) {
	var activity_idx = card.activity.idx;
	if ( delta_count == 0 ) {
		// only changed levels selected
		var selection_idx = Activity.Selection.QueryActivityIdx( activity_idx );
		var lst_lst_level = Activity.Selection.GetListListLevel();
		var lst_level = [], idx;
		for ( idx = 0; idx < card.level.length; ++ idx ) {
			lst_level.push( card.level[ idx ] );
		}
		lst_lst_level[ selection_idx ] = lst_level; //.join(":");
		Activity.Selection.SetListListLevel( lst_lst_level );
	} else if ( delta_count == 1 ) {
		// add this card to selection
		Activity.Selection.AddCard( card );
	} else {
		Activity.Selection.RemoveCard( card );
	}
};

Activity.Selection.AddCard = function ( card ) {
	// update: count_nr
	var count_nr = Activity.Selection.GetCountNr();
	Activity.Selection.SetCountNr( count_nr + 1 );
	// update: lst_activity_idx, lst_activity_status
	var lst_activity_idx = Activity.Selection.GetListActivityIdx();
	lst_activity_idx.push( card.activity.idx );
	Activity.Selection.SetListActivityIdx( lst_activity_idx );
	// update: lst_lst_level, lst_level_idx
	var lst_lst_level = Activity.Selection.GetListListLevel();
	var lst_level = [], idx;
	for ( idx = 0; idx < card.level.length; ++ idx ) {
		lst_level.push( card.level[ idx ] );
	}
	// lst_lst_level.push( lst_level.join(":") );
	lst_lst_level.push( lst_level );
	Activity.Selection.SetListListLevel( lst_lst_level );
};

Activity.Selection.RemoveCard = function ( card ) {
	// update: count_nr
	var count_nr = Activity.Selection.GetCountNr();
	if ( count_nr == 1 ) {
		Activity.Selection.Clear();
	} else {
		Activity.Selection.SetCountNr( count_nr - 1 );
		// update: lst_activity_idx, lst_activity_status
		var lst_activity_idx = Activity.Selection.GetListActivityIdx();
		var selection_idx = Activity.Selection.QueryActivityIdx( card.activity.idx );
		lst_activity_idx.splice( selection_idx, 1 );
		Activity.Selection.SetListActivityIdx( lst_activity_idx );
		// update: lst_lst_level, lst_level_idx
		var lst_lst_level = Activity.Selection.GetListListLevel();
		lst_lst_level.splice( selection_idx, 1 );
		Activity.Selection.SetListListLevel( lst_lst_level );
	}
};

Activity.Selection.QueryActivityIdx = function ( query_idx ) {
	var lst_ativity_idx = Activity.Selection.GetListActivityIdx();
	var idx, activity_idx;
	for ( idx = 0; idx < lst_ativity_idx.length; ++ idx ) {
		activity_idx = lst_ativity_idx[ idx ];
		if ( activity_idx == query_idx ) {
			return idx;
		}
	}
	// console.warn("Activity.Selection.QueryActivityIdx >> not found:", query_idx);
	return -1;
};

Activity.Selection.GetCurrentIdx = function () {
	var n = Lema.ClientStorage.GetItem("current_idx");
	if ( n == null ) {
		return 0;
	}
	return parseInt( n, 10 );
};
Activity.Selection.SetCurrentIdx = function (value) {
	Lema.ClientStorage.SetItem("current_idx", String(value));
};

Activity.Selection.GetCountNr = function () {
	var count = Lema.ClientStorage.GetItem("count_nr");
	if ( count == null ) {
		return 0;
	}
	return parseInt(count, 10);
};
Activity.Selection.SetCountNr = function (value) {
	Lema.ClientStorage.SetItem("count_nr", String(value));
};

Activity.Selection.GetListActivityIdx = function () {
	var lst_activity_idx = Lema.ClientStorage.GetItem("lst_activity_idx");
	if ( lst_activity_idx == null ) {
		return [];
	}
	return lst_activity_idx.split("_");
};
Activity.Selection.SetListActivityIdx = function (lst_ativity_idx) {
	/** selected ativity idx **/
	Lema.ClientStorage.SetItem("lst_activity_idx", lst_ativity_idx.join("_"));
	/** lst ativity status: APP_STAT_INIT **/
	var status = [];
	for (var idx = 0; idx < lst_ativity_idx.length; idx++) {
		status.push(Lema.Const.APP_STAT_INIT);
	}
	Lema.ClientStorage.SetItem("lst_activity_status", status.join("_"));
};

Activity.Selection.GetListListLevel = function () {
	var lst_lst_level = Lema.ClientStorage.GetItem("lst_lst_level");
	if ( lst_lst_level == null ) {
		lst_lst_level = [];
	} else {
		lst_lst_level = lst_lst_level.split("_");
		var idx, lst_level;
		for ( idx = 0; idx < lst_lst_level.length; idx++) {
			lst_level = lst_lst_level[ idx ];
			// console.log(lst_level);
			lst_level = lst_level.split(":");
			// console.log(lst_level);
			lst_lst_level[ idx ] = lst_level;
		}
	}
	// console.log("GetListListLevel", lst_lst_level);
	return lst_lst_level;
};
Activity.Selection.SetListListLevel = function (lst_lst) {
	for ( var k = 0; k < lst_lst.length; k++ ) {
		lst_lst[ k ] = lst_lst[ k ].join(":");
	}
	Lema.ClientStorage.SetItem("lst_lst_level", lst_lst.join("_"));
	/** lst level idx: init to 0 **/
	var level_idx = [], idx;
	for ( idx = 0; idx < lst_lst.length; idx++) {
		level_idx.push(0);
	}
	Lema.ClientStorage.SetItem("lst_level_idx", level_idx.join("_"));
};

Activity.Selection.GetListLevelIdx = function () {
	var lst = Lema.ClientStorage.GetItem("lst_level_idx");
	if ( lst == null ) {
		return [];
	}
	return lst.split("_");
};

Activity.Selection.SetListLevelIdx = function ( lst ) {
	Lema.ClientStorage.SetItem( "lst_level_idx", lst.join("_") );
};


Activity.Selection.SetLevelIdx = function ( selection_idx, level_idx ) {
	var lst_level_idx = Activity.Selection.GetListLevelIdx();
	lst_level_idx[ selection_idx ] = level_idx;
	Activity.Selection.SetListLevelIdx( lst_level_idx );
};

Activity.Selection.GetListActivityStatus = function () {
	var lst = Lema.ClientStorage.GetItem("lst_activity_status");
	if ( lst == null ) {
		return [];
	}
	return lst.split("_");
};

Activity.Selection.SetActivityStatus = function ( selection_idx, activity_status ) {
	var lst_activity_status = Activity.Selection.GetListActivityStatus();
	lst_activity_status[ selection_idx ] = activity_status;
	Lema.ClientStorage.SetItem("lst_activity_status", lst_activity_status.join("_"));
};

Activity.Selection.GetAnsweredCount = function () {
	var lst_activity_status = Lema.ClientStorage.GetItem("lst_activity_status").split("_");
	var cnt = 0, idx, status;
	for (idx = 0; idx < lst_activity_status.length; idx++) {
		status = parseInt( lst_activity_status[ idx ], 10 );
		if ( status === Lema.Const.APP_STAT_SUCCESS || status === Lema.Const.APP_STAT_FAIL ) {
			cnt += 1;
		}
	}
	return cnt;
};

Activity.Selection.GetNextUnansweredIdx = function ( current_idx ) {
	var lst_activity_status = Lema.ClientStorage.GetItem("lst_activity_status").split("_");
	var cnt = parseInt(Lema.ClientStorage.GetItem("count_nr"), 10);
	var idx = current_idx;
	var answered, idx_status;
	do {
		idx += 1;
		if (idx >= cnt) {
			idx = 0;
		}
		idx_status = parseInt( lst_activity_status[idx], 10 );
		answered = ( idx_status === Lema.Const.APP_STAT_SUCCESS || idx_status === Lema.Const.APP_STAT_FAIL );
	} while (answered);
	return idx;
};

Activity.Selection.GetCacheIdx = function () {
	var cache_idx = Lema.ClientStorage.GetItem( "cache_idx" );
	if ( cache_idx == null ) {
		return 0;
	}
	return parseInt(cache_idx, 10);
};
Activity.Selection.SetCacheIdx = function ( value ) {
	Lema.ClientStorage.SetItem( "cache_idx", String(value) );
};

Activity.Selection.Cache = function () {
	var count_nr = Activity.Selection.GetCountNr();
	var cache_idx = Activity.Selection.GetCacheIdx();
	if ( cache_idx == 0 ) {
		console.warn("cache_idx == 0");
		cache_idx = 1 + Activity.Selection.GetCurrentIdx();
	}
	Lema.HorizontalRuler();
	console.log( "Cache sequence >> cache_idx:", cache_idx, "/", count_nr );
	
	if ( cache_idx >= count_nr ) {
		console.log("Cache sequence >> Done");
	} else {
		Activity.Selection.SetCacheIdx( cache_idx  + 1 );
		if ( ! Activity.list ) {
			Activity.LoadCategoriesAndSubacategories();
			Activity.LoadActivitiesList();
		}
		
		var lst_activity_idx = Activity.Selection.GetListActivityIdx();
		var activity_idx = lst_activity_idx[ cache_idx ];
		
		var url = Lema.GetActivityURL( Activity.list[ activity_idx ] );
		var load_worker = new Worker( 'core/load-worker.js' );
		load_worker.onmessage = Activity.Selection.Cache;
		load_worker.postMessage( { url: url, progress: false } );
	}
	Lema.HorizontalRuler();
};

// =============================================================================

Activity.GetIdxByFileName = function ( file_name ) {
	var idx, activity;
	for ( idx = 0; idx < Activity.list.length; ++ idx ) {
		activity = Activity.list[ idx ];
		// console.log(idx, activity.file);
		if ( activity.file == file_name ) {
			console.log(idx, activity.file, activity.name);
			return idx;
		}
	}
	console.error("Activity.GetIdxByFileName >> Not found:", file_name);
	return -1;
};

Activity.GetCategoryById = function ( category_id ) {
	var i, category;
	for ( i = 0; i < Activity.categories.length; ++ i ) {
		category = Activity.categories[ i ];
		if ( category.id == category_id ) {
			return category;
		}
	}
	return "#" + category_id;
};

Activity.GetSubcategoryById = function ( category_id, subcategory_id ) {
	var i, j, category, subcategory;
	for ( i = 0; i < Activity.categories.length; ++ i ) {
		category = Activity.categories[ i ];
		if ( category.id == category_id ) {
			for ( j = 0; j < category.subcategories.length; ++ j ) {
				subcategory = category.subcategories[ j ];
				if ( subcategory.id == subcategory_id ) {
					return subcategory;
				}
			}
		}
	}
	return "#" + category_id + "/" + subcategory_id;
};

Activity.VerifyActivityInfo = function ( a ) {
	var idx, j, category, subcategory, status = 0;
	for ( idx = 0; idx < Activity.categories.length; ++ idx ) {
		category = Activity.categories[ idx ];
		if ( category.id == a.category ) {
			status += 1;
			for ( j = 0; j < category.subcategories.length; ++ j ) {
				subcategory = category.subcategories[ j ];
				if ( subcategory.id == a.subcategory ) {
					status += 1;
				}
			}
		}
	}
	console.assert( status == 2, a.file, a.category, "/", a.subcategory, "#", status );
	return status == 2;
};

//Serialize activity data to json
Activity.prototype.toJSON = function()
{
	var data = {};

	data.name = this.name;
	data.description = this.description;
	data.version = this.version;

	data.dificulty = this.dificulty;
	data.target = this.target;

	data.category = this.category;
	data.subcategory = this.subcategory;

	data.status = this.status;

	data.format = this.format;
	data.file = this.file;

	return data;
}

//Create activity from json data
Activity.fromJSON = function(json)
{
	var activity = new Activity();

	activity.name = (json.name !== undefined) ? json.name : "";
	activity.description = (json.description !== undefined) ? json.description : "";
	activity.version = (json.version !== undefined) ? json.version : "";

	activity.dificulty = (json.dificulty !== undefined) ? json.dificulty : "";
	activity.target = (json.target !== undefined) ? json.target : "";

	activity.category = (json.category !== undefined) ? json.category : "";
	activity.subcategory = (json.subcategory !== undefined) ? json.subcategory : "";

	activity.status = (json.status !== undefined) ? json.status : "ok";

	activity.format = (json.format !== undefined) ? json.format : "";
	activity.file = (json.file !== undefined) ? json.file : "";

	return activity;
}
