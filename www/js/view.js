//
// 
// view.js is part of prono
// @author: Brecht Baeten
// @license: GNU GENERAL PUBLIC LICENSE
// 
//


// JQuery wrapper
$(document).ready(function(){
	
////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////	
	app.add_view('users',$('[data-view="users"]'),{});
	app.view.users.update();
	
	app.add_view('ranking',$('[data-view="ranking"]'),{});
	app.view.ranking.update();
	

////////////////////////////////////////////////////////////////////////////////
// Teams                                                                      //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('teams',$('[data-view="teams"]'),{});
	app.view.teams.update();
	
	app.add_view('editteam',$('[data-view="editteam"]'),{
	});
	app.view.editteam.update();

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('groups',$('[data-view="groups"]'),{});
	app.view.groups.update();
	
	app.add_view('editgroup',$('[data-view="editgroup"]'),{
	});
	app.view.editgroup.update();

////////////////////////////////////////////////////////////////////////////////
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('matches',$('[data-view="matches"]'),{
		'parseDate': app.view.functions.parseDate,
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.matches.update();
	
	app.add_view('editmatch',$('[data-view="editmatch"]'),{
		'parseDate': app.view.functions.parseDate
	});
	app.view.editmatch.update();
	
	app.add_view('editmatchscore',$('[data-view="editmatchscore"]'),{
	});
	app.view.editmatchscore.update();
	

////////////////////////////////////////////////////////////////////////////////
// Groupstage                                                                 //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('groupstage',$('[data-view="groupstage"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.groupstage.update();
	

////////////////////////////////////////////////////////////////////////////////
// Knockoutstage                                                              //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('roundof16left',$('[data-view="roundof16left"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.roundof16left.update();
	app.add_view('roundof16right',$('[data-view="roundof16right"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.roundof16right.update();

	app.add_view('quarterfinalleft',$('[data-view="quarterfinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.quarterfinalleft.update();
	app.add_view('quarterfinalright',$('[data-view="quarterfinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.quarterfinalright.update();

	app.add_view('semifinalleft',$('[data-view="semifinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.semifinalleft.update();
	app.add_view('semifinalright',$('[data-view="semifinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.semifinalright.update();

	app.add_view('final',$('[data-view="final"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.view.final.update();

	
});



////////////////////////////////////////////////////////////////////////////////
// General functions                                                          //
////////////////////////////////////////////////////////////////////////////////
app.view.functions = {};
app.view.functions.parseDate = function(unixtime){
	var date = new Date(unixtime*1000);
	var year = date.getFullYear();
	var month = "0" + (date.getMonth()+1);
	var day = "0" + date.getDate();
	var hours = "0" + date.getHours();
	var minutes = "0" + date.getMinutes();
	return day.substr(-2) + '-' + month.substr(-2) + '-' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2)
}
app.view.functions.parseTeam1Name = function(matchid){
	if(typeof app.model.matches[matchid].team1 == "undefined"){
		return app.model.matches[matchid].defaultteam1;
	}
	else{
		return app.model.matches[matchid].team1.name;
	}
}
app.view.functions.parseTeam2Name = function(matchid){
	if(typeof app.model.matches[matchid].team2 == "undefined"){
		return app.model.matches[matchid].defaultteam2;
	}
	else{
		return app.model.matches[matchid].team2.name;
	}
}
app.view.functions.parseScore = function(score){
	if(score < 0){
		return "";
	}
	else{
		return score;
	}
}
app.view.functions.parsePenaltiesTaken = function(matchid){
	if(app.model.matches[matchid].penalty1 < 0 || app.model.matches[matchid].penalty2 < 0){
		return "hidden";
	}
	else{
		return "";
	}
}










