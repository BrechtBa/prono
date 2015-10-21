//
// 
// view.js is part of prono
// @author: Brecht Baeten
// @license: GNU GENERAL PUBLIC LICENSE
// 
//





////////////////////////////////////////////////////////////////////////////////
// View functions                                                             //
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
app.view.functions.parseTeam1Icon = function(matchid){
	if(typeof app.model.matches[matchid].team1 == "undefined"){
		return "images/flags/XXX.png";
	}
	else{
		return app.model.matches[matchid].team1.icon;
	}
}
app.view.functions.parseTeam2Icon = function(matchid){
	if(typeof app.model.matches[matchid].team2 == "undefined"){
		return "images/flags/XXX.png";
	}
	else{
		return app.model.matches[matchid].team2.icon;
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
app.view.functions.parseBetScore1 = function(matchid){
	if(typeof app.model.userbetsscore[matchid] == "undefined"){
		return "";
	}
	else{
		if(typeof app.model.userbetsscore[matchid].score1 == "undefined" || app.model.userbetsscore[matchid].score1 <0 ){
			return "";
		}
		else{
			return app.model.userbetsscore[matchid].score1;
		}
	}
}
app.view.functions.parseBetScore2 = function(matchid){
	if(typeof app.model.userbetsscore[matchid] == "undefined"){
		return "";
	}
	else{
		if(typeof app.model.userbetsscore[matchid].score2 == "undefined" || app.model.userbetsscore[matchid].score2 <0 ){
			return "";
		}
		else{
			return app.model.userbetsscore[matchid].score2;
		}
	}
}








/*
// JQuery wrapper
$(document).ready(function(){
	
////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////	
	app.add_view('users',$('[data-view="users"]'),{
	});
	
	app.add_view('ranking',$('[data-view="ranking"]'),{
	});

////////////////////////////////////////////////////////////////////////////////
// Teams                                                                      //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('teams',$('[data-view="teams"]'),{
	});
	
	app.add_view('editteam',$('[data-view="editteam"]'),{
	});

////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('groups',$('[data-view="groups"]'),{
	});
	
	app.add_view('editgroup',$('[data-view="editgroup"]'),{
	});


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
	
	app.add_view('editmatch',$('[data-view="editmatch"]'),{
		'parseDate': app.view.functions.parseDate
	});
	
	app.add_view('editmatchscore',$('[data-view="editmatchscore"]'),{
	});

	

////////////////////////////////////////////////////////////////////////////////
// Results                                                                    //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('groupstage',$('[data-view="groupstage"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});

	app.add_view('roundof16left',$('[data-view="roundof16left"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.add_view('roundof16right',$('[data-view="roundof16right"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});

	app.add_view('quarterfinalleft',$('[data-view="quarterfinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.add_view('quarterfinalright',$('[data-view="quarterfinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});

	app.add_view('semifinalleft',$('[data-view="semifinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});
	app.add_view('semifinalright',$('[data-view="semifinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});

	app.add_view('final',$('[data-view="final"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseScore': app.view.functions.parseScore,
		'parsePenaltiesTaken': app.view.functions.parsePenaltiesTaken
	});


////////////////////////////////////////////////////////////////////////////////
// User Bets                                                                  //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('userbetsscoregroupstage',$('[data-view="userbetsscoregroupstage"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

	app.add_view('userbetsscoreroundof16left',$('[data-view="userbetsscoreroundof16left"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});
	app.add_view('userbetsscoreroundof16right',$('[data-view="userbetsscoreroundof16right"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

	app.add_view('userbetsscorequarterfinalleft',$('[data-view="userbetsscorequarterfinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});
	app.add_view('userbetsscorequarterfinalright',$('[data-view="userbetsscorequarterfinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

	app.add_view('userbetsscoresemifinalleft',$('[data-view="userbetsscoresemifinalleft"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});
	app.add_view('userbetsscoresemifinalright',$('[data-view="userbetsscoresemifinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

	app.add_view('userbetsscorefinalright',$('[data-view="userbetsscorefinalright"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

	app.add_view('editbetscore',$('[data-view="editbetscore"]'),{
		'parseTeam1Name': app.view.functions.parseTeam1Name,
		'parseTeam2Name': app.view.functions.parseTeam2Name,
		'parseBetScore1': app.view.functions.parseBetScore1,
		'parseBetScore2': app.view.functions.parseBetScore2
	});

});


*/
















