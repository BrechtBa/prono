




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
			});
			$(document).trigger('usersViewUpdate');
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
			$(document).trigger('matchesModelGet');
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
			});
		});
	},
	post: function(that,data){
		app.service.api.post('teams',data,function(result,geturl){
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
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.add_model('matches',{
	get: function(that){
		app.service.api.get('matches/',function(result){
			$.each(result,function(index,match){
				that[match.id] = {};
				that[match.id]['id'] = match.id;
				that[match.id]['team1'] = app.model.teams[match.team1];
				that[match.id]['score1'] = match.score1;
				that[match.id]['penalty1'] = match.penalty1;
				that[match.id]['team2'] = app.model.teams[match.team2];
				that[match.id]['score2'] = match.score2;
				that[match.id]['penalty2'] = match.penalty2;
				that[match.id]['date'] = match.date;
			});
			$(document).trigger('matchesViewUpdate');
			$(document).trigger('groupstageModelGet');
		});
	},
	put: function(that,id,data){
		app.service.api.put('matches/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				that[result.id]['id'] = result.id;
				that[result.id]['team1'] = app.model.teams[result.team1];
				that[result.id]['score1'] = result.score1;
				that[result.id]['penalty1'] = result.penalty1;
				that[result.id]['team2'] = app.model.teams[result.team2];
				that[result.id]['score2'] = result.score2;
				that[result.id]['penalty2'] = result.penalty2;
				that[result.id]['date'] = result.date;

				$(document).trigger('matchesViewUpdate');
			});
		});
	},
	post: function(that,data){
		console.log(data)
		app.service.api.post('matches/',data,function(result,geturl){
			console.log(result)
			app.service.api.get(geturl,function(result){
				that[result.id] = {};
				that[result.id]['id'] = result.id;
				that[result.id]['team1'] = app.model.teams[result.team1];
				that[result.id]['score1'] = result.score1;
				that[result.id]['penalty1'] = result.penalty1;
				that[result.id]['team2'] = app.model.teams[result.team2];
				that[result.id]['score2'] = result.score1;
				that[result.id]['penalty2'] = result.penalty2;
				that[result.id]['date'] = result.date;
					
				$(document).trigger('matchesViewUpdate');
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
		that['score1'] = data['score1'];
		that['score2'] = data['score2'];
		that['penalty1'] = data['penalty1'];
		that['penalty2'] = data['penalty2'];
		that['date'] = data['date'];
		
		$(document).trigger('editmatchViewUpdate');
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
		//app.groupstage.data[1] = {id:1, name:'A', matches:{1:app.matches.data[1], 2:app.matches.data[2]}};
		//app.groupstage.data[2] = {id:2, name:'B', matches:{3:app.matches.data[3], 4:app.matches.data[4]}};

		$(document).trigger('updateGroupstageView');
	},
	put: function(that,id,data){
		app.service.api.put('groups',data,function(result){
			//that[id] = {id:data.id, name:data.name};
			$(document).trigger('updateGroupstageView');
		});
	},
	post: function(that,data){
	},
	del: function(that,id){
	}
});