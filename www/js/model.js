


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


