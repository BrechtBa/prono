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
app.view.functions.parseTeam1Abr = function(matchid){
	if(typeof app.model.matches[matchid].team1 == "undefined"){
		return app.model.matches[matchid].defaultteam1;
	}
	else{
		return app.model.matches[matchid].team1.abr;
	}
}
app.view.functions.parseTeam2Abr = function(matchid){
	if(typeof app.model.matches[matchid].team2 == "undefined"){
		return app.model.matches[matchid].defaultteam2;
	}
	else{
		return app.model.matches[matchid].team2.abr;
	}
}

app.view.functions.parseTeamIcon = function(teamid){
	if(app.model.teams[teamid].icon == ''){
		if(app.model.teams[teamid].iso_icon == ''){
			return 'images/flags/_blank.png';
		}
		else{
			return 'images/flags/'+app.model.teams[teamid].iso_icon+'.png';
		}
	}
	else{
		return app.model.teams[teamid].icon;
	}
}
app.view.functions.parseTeam1Icon = function(matchid){
	if(typeof app.model.matches[matchid].team1 == "undefined"){
		return "images/flags/_blank.png";
	}
	else{
		return app.view.functions.parseTeamIcon(app.model.matches[matchid].team1.id);
	}
}
app.view.functions.parseTeam2Icon = function(matchid){
	if(typeof app.model.matches[matchid].team2 == "undefined"){
		return "images/flags/_blank.png";
	}
	else{
		return app.view.functions.parseTeamIcon(app.model.matches[matchid].team2.id);
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





////////////////////////////////////////////////////////////////////////////////
// View functionality                                                         //
///////////////////////////////////////////////////////////////////////////////
// JQuery wrapper
$(document).ready(function(){
	$(document).on('click tap','.stage',function(event){
		event.preventDefault();
		var parent = $(event.target).parents('.knockoutstage');

		parent.find('.stage').addClass('collapsed');

		var classlist = $(this).attr('class').split(/\s+/);

		if(classlist.indexOf('roundof16')>0){
			parent.find('.roundof16').removeClass('collapsed');
		}

		if(classlist.indexOf('quarterfinal')>0){
			parent.find('.quarterfinal').removeClass('collapsed');
		}
		if(classlist.indexOf('semifinal')>0 || classlist.indexOf('semifinal-right')>0){
			parent.find('.semifinal').removeClass('collapsed');
			parent.find('.semifinal-right').removeClass('collapsed');
		}	
		if(classlist.indexOf('final')>0){
			parent.find('.final').removeClass('collapsed');
		}
	});
});

















