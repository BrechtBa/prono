




////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.add_model('users',{
	get: function(that){
		app.service.api.get('users/',function(result){
			$.each(result,function(index,user){
				that[user.id] = {};
				that[user.id]['id'] = user.id;
				that[user.id]['username'] = user.username;
				that[user.id]['points'] = user.points;
			});
			$(document).trigger('usersViewUpdate');
			$(document).trigger('rankingViewUpdate');
		});
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	delete: function(that,id){
		app.service.api.delete('users/'+id,function(result){
			delete that[id];
			$(document).trigger('usersViewUpdate');
		});
	}
});




////////////////////////////////////////////////////////////////////////////////
// Teams                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.add_model('teams',{
	get: function(that){
		app.service.api.get('teams/',function(result){
			$.each(result,function(index,team){
				that[team.id] = {};
				that[team.id]['id'] = team.id;
				that[team.id]['name'] = team.name;
				that[team.id]['abr'] = team.abr;
				that[team.id]['icon'] = team.icon;
			});
			$(document).trigger('teamsViewUpdate');
			$(document).trigger('groupsModelGet');
		});
	},
	put: function(that,id,data){
		app.service.api.put('teams/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				that[result.id]['id'] = result.id;
				that[result.id]['name'] = result.name;
				that[result.id]['abr'] = result.abr;
				that[result.id]['icon'] = result.icon;
				
				$(document).trigger('teamsViewUpdate');
				$(document).trigger('matchesViewUpdate');
			});
		});
	},
	post: function(that,data){
		app.service.api.post('teams/',data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				that[result.id] = {};
				that[result.id]['id'] = result.id;
				that[result.id]['name'] = result.name;
				that[result.id]['abr'] = result.abr;
				that[result.id]['icon'] = result.icon;
				
				$(document).trigger('teamsViewUpdate');
			});
		});
	},
	delete: function(that,id){
		app.service.api.delete('teams/'+id,function(result){
			delete that[id];
			$(document).trigger('teamsViewUpdate');
			$(document).trigger('matchesViewUpdate');
		});
	}
});

////////////////////////////////////////////////////////////////////////////////
// Edit team                                                                   //
////////////////////////////////////////////////////////////////////////////////
app.add_model('editteam',{
	get(that){
	},
	put(that,id,data){
		that['id'] = data['id'];
		that['name'] = data['name'];
		that['abr'] = data['abr'];
		that['icon'] = data['icon'];
		
		$(document).trigger('editteamViewUpdate');
	},
	post(that,data){
	},
	delete(that,id){
	}
});




////////////////////////////////////////////////////////////////////////////////
// Groups                                                                     //
////////////////////////////////////////////////////////////////////////////////
app.add_model('groups',{
	get: function(that){
		app.service.api.get('groups/',function(result){
			$.each(result,function(index,group){
				that[group.id] = {};
				that[group.id]['id'] = group.id;
				that[group.id]['name'] = group.name;
				that[group.id]['team1'] = app.model.teams[group.team1];
				that[group.id]['team2'] = app.model.teams[group.team2];
			});
			$(document).trigger('matchesModelGet');
			$(document).trigger('groupsViewUpdate');
		});
	},
	put: function(that,id,data){
		console.log(data);
		app.service.api.put('groups/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(group){
				that[group.id]['id'] = group.id;
				that[group.id]['name'] = group.name;
				that[group.id]['team1'] = app.model.teams[group.team1];
				that[group.id]['team2'] = app.model.teams[group.team2];

				$(document).trigger('groupsViewUpdate');
				$(document).trigger('matchesViewUpdate');
			});
		});
	},
	post: function(that,data){
		console.log(data)
		app.service.api.post('groups/',data,function(result,geturl){
			console.log(result)
			app.service.api.get(geturl,function(group){
				that[group.id] = {};
				that[group.id]['id'] = group.id;
				that[group.id]['name'] = group.name;
				that[group.id]['team1'] = app.model.teams[group.team1];
				that[group.id]['team2'] = app.model.teams[group.team2];
	
				$(document).trigger('groupsViewUpdate');;
			});
		});
	},
	delete: function(that,id){
		app.service.api.delete('groups/'+id,function(result){
			delete that[id];
			$(document).trigger('groupsViewUpdate');
			$(document).trigger('matchesViewUpdate');
		});
	}
});
////////////////////////////////////////////////////////////////////////////////
// Edit group                                                                 //
////////////////////////////////////////////////////////////////////////////////
app.add_model('editgroup',{
	get(that){
	},
	put(that,id,data){
		that['id'] = data['id'];
		that['name'] = data.name;
		that['team1'] = app.model.teams[data.team1];
		that['team2'] = app.model.teams[data.team2];
		
		$(document).trigger('editgroupViewUpdate');
	},
	post(that,data){
	},
	delete(that,id){
	}
});




////////////////////////////////////////////////////////////////////////////////
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.add_model('matches',{
	get: function(that){
		app.service.api.get('matches/',function(result){
			$.each(result,function(index,match){
				that[match.id] = {};
				that[match.id]['id'] = match.id;
				that[match.id]['team1'] = app.model.teams[match.team1];
				that[match.id]['team2'] = app.model.teams[match.team2];
				that[match.id]['defaultteam1'] = match.defaultteam1;
				that[match.id]['defaultteam2'] = match.defaultteam2;
				that[match.id]['score1'] = match.score1;
				that[match.id]['score2'] = match.score2;
				that[match.id]['penalty1'] = match.penalty1;
				that[match.id]['penalty2'] = match.penalty2;
				that[match.id]['date'] = match.date;
				that[match.id]['stage'] = match.stage;
				that[match.id]['group'] = app.model.groups[match.group];
				that[match.id]['position'] = match.position;
			});
			$(document).trigger('groupstageModelGet');
			$(document).trigger('knockoutstageModelGet');
			$(document).trigger('userbetsModelGet');

			$(document).trigger('matchesViewUpdate');
			$(document).trigger('groupstageViewUpdate');
			$(document).trigger('roundof16leftViewUpdate');
			$(document).trigger('roundof16rightViewUpdate');
			$(document).trigger('quarterfinalViewUpdate');
			$(document).trigger('semifinalViewUpdate');
			$(document).trigger('finalViewUpdate');
		});
	},
	put: function(that,id,data){
		app.service.api.put('matches/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(match){
				that[match.id]['id'] = match.id;
				that[match.id]['team1'] = app.model.teams[match.team1];
				that[match.id]['team2'] = app.model.teams[match.team2];
				that[match.id]['defaultteam1'] = match.defaultteam1;
				that[match.id]['defaultteam2'] = match.defaultteam2;
				that[match.id]['score1'] = match.score1;
				that[match.id]['score2'] = match.score2;
				that[match.id]['penalty1'] = match.penalty1;
				that[match.id]['penalty2'] = match.penalty2;
				that[match.id]['date'] = match.date;
				that[match.id]['stage'] = match.stage;
				that[match.id]['group'] = app.model.groups[match.group];
				that[match.id]['position'] = match.position;

				$(document).trigger('matchesViewUpdate');
				$(document).trigger('groupstageViewUpdate');
				$(document).trigger('roundof16leftViewUpdate');
				$(document).trigger('roundof16rightViewUpdate');
				$(document).trigger('quarterfinalViewUpdate');
				$(document).trigger('semifinalViewUpdate');
				$(document).trigger('finalViewUpdate');
			});
		});
	},
	post: function(that,data){
		app.service.api.post('matches/',data,function(result,geturl){
			app.service.api.get(geturl,function(match){
				that[match.id] = {};
				that[match.id]['id'] = match.id;
				that[match.id]['team1'] = app.model.teams[match.team1];
				that[match.id]['team2'] = app.model.teams[match.team2];
				that[match.id]['defaultteam1'] = match.defaultteam1;
				that[match.id]['defaultteam2'] = match.defaultteam2;
				that[match.id]['score1'] = match.score1;
				that[match.id]['score2'] = match.score2;
				that[match.id]['penalty1'] = match.penalty1;
				that[match.id]['penalty2'] = match.penalty2;
				that[match.id]['date'] = match.date;
				that[match.id]['stage'] = match.stage;
				that[match.id]['group'] = app.model.groups[match.group];
				that[match.id]['position'] = match.position;;
	
				$(document).trigger('matchesViewUpdate');
				$(document).trigger('groupstageViewUpdate');
				$(document).trigger('roundof16leftViewUpdate');
				$(document).trigger('roundof16rightViewUpdate');
				$(document).trigger('quarterfinalViewUpdate');
				$(document).trigger('semifinalViewUpdate');
				$(document).trigger('finalViewUpdate');
			});
		});
	},
	delete: function(that,id){
		app.service.api.delete('matches/'+id,function(result){
			delete that[id];
			$(document).trigger('matchesViewUpdate');
		});
	}
});
////////////////////////////////////////////////////////////////////////////////
// Edit match                                                                 //
////////////////////////////////////////////////////////////////////////////////
app.add_model('editmatch',{
	get(that){
	},
	put(that,id,data){
		that['id'] = data['id'];
		that['team1'] = app.model.teams[data['team1']];
		that['team2'] = app.model.teams[data['team2']];
		that['defaultteam1'] = data['defaultteam1'];
		that['defaultteam2'] = data['defaultteam2'];
		that['score1'] = data['score1'];
		that['score2'] = data['score2'];
		that['penalty1'] = data['penalty1'];
		that['penalty2'] = data['penalty2'];
		that['stage'] = data['stage'];
		that['group'] = data['group'];
		that['position'] = data['position'];
		that['date'] = data['date'];
		
		$(document).trigger('editmatchViewUpdate');
		$(document).trigger('editmatchscoreViewUpdate');
	},
	post(that,data){
	},
	delete(that,id){
	}
});



////////////////////////////////////////////////////////////////////////////////
// Groupstage                                                                 //
////////////////////////////////////////////////////////////////////////////////
app.add_model('groupstage',{
	get: function(that){
		app.service.api.get('groups/',function(result){
			$.each(result,function(index,group){
				that[group.id] = {};
				that[group.id]['id'] = group.id;
				that[group.id]['name'] = group.name;
				that[group.id]['team1'] = app.model.teams[group.team1];
				that[group.id]['team2'] = app.model.teams[group.team2];
				that[group.id]['matches'] = {};
				$.each(app.model.matches,function(index,match){
					if(match.stage==1 && match.group.id == group.id){
						that[group.id]['matches'][match.id] = match;
					}
				});
			});
			$(document).trigger('groupstageViewUpdate');
		});
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});


////////////////////////////////////////////////////////////////////////////////
// Round of 16                                                                //
////////////////////////////////////////////////////////////////////////////////
app.add_model('roundof16left',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==2 && match.position <= 4){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('roundof16leftViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});
app.add_model('roundof16right',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==2 && match.position > 4){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('roundof16rightViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});


////////////////////////////////////////////////////////////////////////////////
// Quarter final                                                              //
////////////////////////////////////////////////////////////////////////////////
app.add_model('quarterfinalleft',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==3 && match.position <= 2){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('quarterfinalleftViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});
app.add_model('quarterfinalright',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==3 && match.position > 2){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('quarterfinalrightViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});


////////////////////////////////////////////////////////////////////////////////
// Semi final                                                                 //
////////////////////////////////////////////////////////////////////////////////
app.add_model('semifinalleft',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==4 && match.position <= 1){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('semifinalleftViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});
app.add_model('semifinalright',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==4 && match.position > 1){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('semifinalrightViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});


////////////////////////////////////////////////////////////////////////////////
// final                                                                //
////////////////////////////////////////////////////////////////////////////////
app.add_model('final',{
	get: function(that){
		that['matches'] = that['matches'] || {};
		$.each(app.model.matches,function(index,match){
			if(match.stage==5 && match.position <= 4){
				that['matches'][match.id] = match;
			}
		});
		$(document).trigger('finalViewUpdate');
	},
	put: function(that,id,data){
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});




////////////////////////////////////////////////////////////////////////////////
// bets score                                                                 //
////////////////////////////////////////////////////////////////////////////////
app.add_model('userbetsscore',{
	get: function(that){
		app.service.api.get('bets_score/user_id/'+app.service.user.id,function(result){
			$.each(result,function(index,bet){
				that[bet.match_id] = that[bet.match_id] || {};
				that[bet.match_id]['id'] = bet.id;
				that[bet.match_id]['match'] = app.model.matches[bet.match_id];
				that[bet.match_id]['score1'] = bet.score1;
				that[bet.match_id]['score2'] = bet.score2;
			});
			$(document).trigger('userbetsscoregroupstageViewUpdate');
			$(document).trigger('userbetsscoreroundof16leftViewUpdate');
			$(document).trigger('userbetsscoreroundof16rightViewUpdate');
			$(document).trigger('userbetsscorequarterfinalleftViewUpdate');
			$(document).trigger('userbetsscorequarterfinalrightViewUpdate');
			$(document).trigger('userbetsscoresemifinalleftViewUpdate');
			$(document).trigger('userbetsscoresemifinalrightViewUpdate');
			$(document).trigger('userbetsscorefinalViewUpdate');
;
		});
	},
	put: function(that,id,data){
		app.service.api.put('bets_score/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(bet){
				that[bet.match_id]['id'] = bet.id;
				that[bet.match_id]['match'] = app.model.matches[bet.match_id];
				that[bet.match_id]['score1'] = bet.score1;
				that[bet.match_id]['score2'] = bet.score2;
			});
			$(document).trigger('userbetsscoregroupstageViewUpdate');
			$(document).trigger('userbetsscoreroundof16leftViewUpdate');
			$(document).trigger('userbetsscoreroundof16rightViewUpdate');
			$(document).trigger('userbetsscorequarterfinalleftViewUpdate');
			$(document).trigger('userbetsscorequarterfinalrightViewUpdate');
			$(document).trigger('userbetsscoresemifinalleftViewUpdate');
			$(document).trigger('userbetsscoresemifinalrightViewUpdate');
			$(document).trigger('userbetsscorefinalViewUpdate');
		});
	},
	post: function(that,data){
		app.service.api.post('bets_score/',data,function(result,geturl){
			app.service.api.get(geturl,function(bet){
				that[bet.match_id] = that[bet.id] || {};
				that[bet.match_id]['id'] = bet.id;
				that[bet.match_id]['match'] = app.model.matches[bet.match_id];
				that[bet.match_id]['score1'] = bet.score1;
				that[bet.match_id]['score2'] = bet.score2;ty2;
			});
			$(document).trigger('userbetsscoregroupstageViewUpdate');
			$(document).trigger('userbetsscoreroundof16leftViewUpdate');
			$(document).trigger('userbetsscoreroundof16rightViewUpdate');
			$(document).trigger('userbetsscorequarterfinalleftViewUpdate');
			$(document).trigger('userbetsscorequarterfinalrightViewUpdate');
			$(document).trigger('userbetsscoresemifinalleftViewUpdate');
			$(document).trigger('userbetsscoresemifinalrightViewUpdate');
			$(document).trigger('userbetsscorefinalViewUpdate');
		});
	},
	delete: function(that,match_id){
		id = that[match_id].id;
		app.service.api.delete('bets_score/'+id,function(result){
			delete that[match_id];
			$(document).trigger('userbetsscoregroupstageViewUpdate');
			$(document).trigger('userbetsscoreroundof16leftViewUpdate');
			$(document).trigger('userbetsscoreroundof16rightViewUpdate');
			$(document).trigger('userbetsscorequarterfinalleftViewUpdate');
			$(document).trigger('userbetsscorequarterfinalrightViewUpdate');
			$(document).trigger('userbetsscoresemifinalleftViewUpdate');
			$(document).trigger('userbetsscoresemifinalrightViewUpdate');
			$(document).trigger('userbetsscorefinalViewUpdate');
		});
	}
});
