//
// 
// view.js is part of prono
// @author: Brecht Baeten
// @license: GNU GENERAL PUBLIC LICENSE
// 
//


// JQuery wrapper
$(document).ready(function(){
	
	groupstageView = new app.classes.view($('[data-view="groupstage"]'),app.groupstage);
	groupstageView.update();
	$(document).on('updateGroupstageView',function(event,data){
		groupstageView.update();		
	});

	usersView = new app.classes.view($('[data-view="users"]'),app.users);
	usersView.update();	
	$(document).on('updateUsersView',function(event,data){
		usersView.update();		
	});

	teamsView = new app.classes.view($('[data-view="teams"]'),app.teams);
	teamsView.update();
	$(document).on('updateTeamsView',function(event,data){
		teamsView.update();		
	});
	
////////////////////////////////////////////////////////////////////////////////
// users                                                                      //
////////////////////////////////////////////////////////////////////////////////	
/*
	app.view.users = new app.view.Bind('users',$(document),function(){
		var data = [];
		$.each(app.model.users.data,function(index,value){
			data.push({id:value.id,username:value.username});
		});
		this.updateview(data);
	});
*/


	
////////////////////////////////////////////////////////////////////////////////
// View updating events                                                       //
////////////////////////////////////////////////////////////////////////////////
/*
	$(document).on('update_userslist',function(event){
		var object = $('[data-prop="userslist"]');
		console.log(app)
		console.log(app.users);
		object.find('[data-template="user"]').remove();
		
		$.each(app.users,function(index,value){
			console.log(value)
			object.append(app.templates['user'].html(value.id));
			$(document).trigger('update_user',[value.id]);
		});
	});
	
	$(document).on('update_user',function(event,id){
		var object = $('[data-termplate="user"][data-id="'+id+'"]');
		console.log(object);
		object.find('[data-prop="username"]').html(app.users[id].username);
	});

*/
	
});
