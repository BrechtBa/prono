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
		'parseDate': function(arg){
			var date = new Date(arg*1000);
			var year = date.getFullYear();
			var month = "0" + (date.getMonth()+1);
			var day = "0" + date.getDate();
			var hours = "0" + date.getHours();
			var minutes = "0" + date.getMinutes();
			return day.substr(-2) + '-' + month.substr(-2) + '-' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2)
		},
		'parseTeam1Name': function(id){
			if(typeof app.model.matches[id].team1 == "undefined"){
				return app.model.matches[id].defaultteam1;
			}
			else{
				return app.model.matches[id].team1.name;
			}
		},
		'parseTeam2Name': function(id){
			if(typeof app.model.matches[id].team2 == "undefined"){
				return app.model.matches[id].defaultteam2;
			}
			else{
				return app.model.matches[id].team2.name;
			}
		}
	});
	app.view.matches.update();
	
	app.add_view('editmatch',$('[data-view="editmatch"]'),{
		'parseDate': function(arg){
			var date = new Date(arg*1000);
			var year = date.getFullYear();
			var month = "0" + (date.getMonth()+1);
			var day = "0" + date.getDate();
			var hours = "0" + date.getHours();
			var minutes = "0" + date.getMinutes();
			return day.substr(-2) + '-' + month.substr(-2) + '-' + year + ' ' + hours.substr(-2) + ':' + minutes.substr(-2)
		}
	});
	app.view.editmatch.update();
	
	app.add_view('editmatchscore',$('[data-view="editmatchscore"]'),{
	});
	app.view.editmatchscore.update();
	

////////////////////////////////////////////////////////////////////////////////
// Groupstage                                                                 //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('groupstage',$('[data-view="groupstage"]'),{
	});
	app.view.groupstage.update();
	
////////////////////////////////////////////////////////////////////////////////
// Knockoutstage                                                              //
////////////////////////////////////////////////////////////////////////////////
	app.add_view('roundof16left',$('[data-view="roundof16left"]'),{
	});
	app.view.roundof16left.update();
	//app.add_view('roundof16right',$('[data-view="roundof16right"]'),{
	//});
	//app.view.roundof16right.update();
	
});
