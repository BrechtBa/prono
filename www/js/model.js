




////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.users = new app.classes.model({
	get: function(){
		app.service.api.get('users/',function(result){
			$.each(result,function(index,user){
				app.users.data[user.id] = {
					id:user.id,
					username:user.username
				};
			});
			$(document).trigger('updateUsersView');
		});
	},
	put: function(data){
	},
	post: function(data){
	},
	del: function(id){
		app.service.api.del('users/'+id,function(result){
			delete app.users.data[id];
			$(document).trigger('updateUsersView');
		});
	},
});




////////////////////////////////////////////////////////////////////////////////
// Teams                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.teams = new app.classes.model({
	get: function(){
		app.service.api.get('teams/',function(result){
			$.each(result,function(index,team){
				app.teams.data[team.id] = {
					id:team.id,
					name:team.name,
					abr:team.abr,
					icon:team.icon
				};
			});
			$(document).trigger('updateTeamsView');
			$(document).trigger('getMatchesModel');
		});
	},
	put: function(id,data){
		app.service.api.put('teams/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				app.teams.data[result.id]['id'] = result.id;
				app.teams.data[result.id]['name'] = result.name;
				app.teams.data[result.id]['abr'] = result.abr;
				app.teams.data[result.id]['icon'] = result.icon;
				$(document).trigger('updateTeamsView');
			});
		});
	},
	post: function(data){
		app.service.api.post('teams',data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				app.teams.data[result.id] = {id:result.id, name:result.name, abr:result.abr, icon:result.icon};
				$(document).trigger('updateTeamsView');
			});
		});
	},
	del: function(id){
		app.service.api.del('teams/'+id,function(result){
			delete app.teams.data[id];
			$(document).trigger('updateTeamsView');
		});
	},
});




////////////////////////////////////////////////////////////////////////////////
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.matches = new app.classes.model({
	get: function(){
		app.service.api.get('matches/',function(result){
			$.each(result,function(index,match){
				app.matches.data[match.id] = {
					id:match.id,
					team1:app.teams.data[match.team1],
					score1:match.score1,
					penalty1:match.penalty1,
					team2:app.teams.data[match.team2],
					score2:match.score2,
					penalty2:match.penalty2,
					date:match.date
				};
			});
			$(document).trigger('updateMatchesView');
			$(document).trigger('getGroupstageModel');
		});
	},
	put: function(id,data){
		app.service.api.put('matches/'+id,data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				app.matches.data[result.id]['id'] = result.id;
				app.matches.data[result.id]['team1'] = app.teams.data[result.team1];
				app.matches.data[result.id]['score1'] = result.score1;
				app.matches.data[result.id]['penalty1'] = result.penalty1;
				app.matches.data[result.id]['team2'] = app.teams.data[result.team2];
				app.matches.data[result.id]['score2'] = result.score1;
				app.matches.data[result.id]['penalty2'] = result.penalty2;
				app.matches.data[result.id]['date'] = result.date;
				$(document).trigger('updateMatchesView');
			});
		});
	},
	post: function(value){
		app.service.api.post('matches/',data,function(result,geturl){
			app.service.api.get(geturl,function(result){
				app.matches.data[result.id]['id'] = result.id;
				app.matches.data[result.id]['team1'] = app.teams.data[result.team1];
				app.matches.data[result.id]['score1'] = result.score1;
				app.matches.data[result.id]['penalty1'] = result.penalty1;
				app.matches.data[result.id]['team2'] = app.teams.data[result.team2];
				app.matches.data[result.id]['score2'] = result.score1;
				app.matches.data[result.id]['penalty2'] = result.penalty2;
				app.matches.data[result.id]['date'] = result.date;
				$(document).trigger('updateMatchesView');
			});
		});
	},
	del: function(id){
		app.service.api.del('matches/'+id,function(result){
			delete app.matches.data[id];
			$(document).trigger('updateMatchesView');
		});
	},
});

////////////////////////////////////////////////////////////////////////////////
// Groupstage                                                                     //
////////////////////////////////////////////////////////////////////////////////
app.groupstage = new app.classes.model({
	get: function(){
		//app.groupstage.data[1] = {id:1, name:'A', matches:{1:app.matches.data[1], 2:app.matches.data[2]}};
		//app.groupstage.data[2] = {id:2, name:'B', matches:{3:app.matches.data[3], 4:app.matches.data[4]}};

		$(document).trigger('updateGroupstageView');
	},
	put: function(data){
		app.service.api.put('groups',data,function(result){
			app.groupstage.data[data.id] = {id:data.id, name:data.name};
			$(document).trigger('updateGroupstageView');
		});
	},
	post: function(value){
	},
	del: function(id){
	},
});

/*
app.model.user = {
	data: {
		username: '',
		id: 0,
	},
	set: function(user){
		that = this;
		$.post('authenticate/authenticate.php',{},function(result){
			console.log(result);
			if(result>0){
				that.username = user.username;
				that.id = user.id;

				// get a list of users
				app.model.users.get();
			}
			// update views
			$(document).trigger('update_user',[]);

		});
	},
	unset: function(){
		this.data.username = '';
		this.data.id = 0;
	}
};

app.model.users = {
	data: {},
	get: function(){
		that = this;
		// get all users from the database
		$.post('requests/select_from_table.php',{table:'users',column:'id,username',where:'id>0'},function(result){
			result = JSON.parse(result);
			$.each(result,function(index,value){
				that.data[value.id] = {id:value.id, username:value.username};
			});
			app.view.users.update();
		});
	},
	add: function(){
	},
	del: function(id){
		that = this;
		$.post('requests/delete_from_table.php',{table:'users',where:'id='+id},function(result){
			result = JSON.parse(result);
			console.log(result)
			if(result>0){
				delete that.data[id];
				app.view.users.update();
			}
		});
	}
}
*/

