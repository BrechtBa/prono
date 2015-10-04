


app.model.user = {
	username: '',
	id: 0,
	set: function(user){
		that = this;
		$.post('requests/authenticate.php',{},function(result){
			if(result>0){
				that.username = user.username;
				that.id = user.id;
				// update view
				app.view.user.update([{id:that.id, username:that.username}]);
			}
		});
	}
};

app.model.users = {
	list: []
}


