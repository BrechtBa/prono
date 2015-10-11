




////////////////////////////////////////////////////////////////////////////////
// Users                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.users = new app.classes.model({
	get: function(){
		// load data from the database
		app.service.api.get('users/',function(result){
			$.each(result,function(index,user){
				app.users.data[user.id] = {id:user.id,username:user.username};
			});
			$(document).trigger('updateUsersView');
		});
	},
	put: function(data){
		app.service.api.put('users/'+data.id,data,function(result){
			//app.teams.data[data.id] = {id:result.id, name:result.name, abr:result.abr};
			$(document).trigger('updateUsersView');
		});
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
		// load data from the database
		app.service.api.get('teams/',function(result){
			$.each(result,function(index,team){
				app.teams.data[team.id] = {id:team.id,name:team.name,abr:team.abr,icon:team.icon};
			});
			$(document).trigger('updateTeamsView');
			$(document).trigger('getMatchesModel');
		});
	},
	put: function(id,data){
		app.service.api.put('teams/'+id,data,function(result){
			if( typeof data.name !== 'undefined' ){
				app.teams.data[id].name = data.name;
			}
			if( typeof data.abr !== 'undefined' ){
				app.teams.data[id].abr = data.abr;
			}
			if( typeof data.icon !== 'undefined' ){
				app.teams.data[id].icon = data.icon;
			}
			$(document).trigger('updateTeamsView');
		});
	},
	post: function(data){
		app.service.api.post('teams',data,function(result){
			app.teams.data[data.id] = {id:data.id, name:data.name, abr:data.abr};
			$(document).trigger('updateTeamsView');
		});
	},
	del: function(id){
	},
});

////////////////////////////////////////////////////////////////////////////////
// Matches                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.matches = new app.classes.model({
	get: function(){
		//app.matches.data[1] = {id:1,team1:app.teams.data[1],score1:5,team2:app.teams.data[2],score2:0, date:100100};
		//app.matches.data[2] = {id:2,team1:app.teams.data[3],score1:2,team2:app.teams.data[4],score2:2, date:100300};
		//app.matches.data[3] = {id:3,team1:app.teams.data[1],score1:7,team2:app.teams.data[3],score2:0, date:100200};
		//app.matches.data[4] = {id:4,team1:app.teams.data[4],score1:2,team2:app.teams.data[2],score2:3, date:100400};
		$(document).trigger('getGroupstageModel');
	},
	put: function(data){
		//app.service.api.put('matches',data,function(result){
		//  console.log(result)
		//	app.matches.data[data.id] = {id:result.id, team1:app.teams.data[result.team1], score1:result.score1, team2:app.teams.data[result.team2], score2:result.score2, date:result.date};
		//	$(document).trigger('updateMatchesView');
		//});
		var result = data;
		app.matches.data[result.id].team1 = app.teams.data[result.team1];
		app.matches.data[result.id].score1 = result.score1;
		app.matches.data[result.id].team2 = app.teams.data[result.team2];
		app.matches.data[result.id].score2 = result.score2;
		app.matches.data[result.id].date = result.date;
	
		$(document).trigger('updateMatchesView',[data.id]);
		$(document).trigger('updateGroupstageView');
	},
	post: function(value){
	},
	del: function(id){
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

