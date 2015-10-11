

var app = app || {};







////////////////////////////////////////////////////////////////////////////////
// Services                                                                   //
////////////////////////////////////////////////////////////////////////////////
app.service = {};

////////////////////////////////////////////////////////////////////////////////
// API                                                                        //
////////////////////////////////////////////////////////////////////////////////
app.service.api = {
	location: '',
	get: function(apipath,callback){
		app.service.user.authenticate(function(result){
			console.log(result);		
			if(result.priveledge>0){
				$.ajax({
					type: 'GET',
					dataType: 'json',
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					statusCode: {
						200: function(result){
							console.log(result);
							if (typeof(result.error) == 'undefined'){
								callback(result);
							}
							else{
								callback({});
							}
						}
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	put: function(apipath,data,callback){
		app.service.user.authenticate(function(result){			
			if(result.priveledge>0){
				$.ajax({
					type: 'PUT',
					dataType: 'json',
					data: data,
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					statusCode: {
						200: function(result){
							callback(result);
						}
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	post: function(apipath,data,callback){
		app.service.user.authenticate(function(result){			
			if(result.priveledge>0){
				$.ajax({
					type: 'POST',
					dataType: 'json',
					data: data,
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					statusCode: {
						200: function(result){
							callback(result);
						}
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	},
	del: function(apipath,callback){
		app.service.user.authenticate(function(result){			
			if(result.priveledge>0){
				$.ajax({
					type: 'DELETE',
					dataType: 'json',
					url: app.service.api.location+'api/index.php/'+apipath,
					headers: {'Authentication': result.api_token},
					statusCode: {
						200: function(result){
							callback(result);
						}
					},
					error: function(result){
						console.log(result);
					}
				});
			}
		});
	}


};

////////////////////////////////////////////////////////////////////////////////
// User                                                                       //
////////////////////////////////////////////////////////////////////////////////
app.service.user = {
	id: -1,
	username: '',
	login: function(username=-1,password=-1){
		console.log('loggigng in');
		that = this;
		var data = {username:username,password:password};
		if(username==-1){
			data = {};
		}
		$.post('authenticate/login.php',data,function(result){
			result = JSON.parse(result);
			console.log(result);
			if(result.status>0){
				that.id = result.data.id;
				that.username = result.data.username;
				$(document).trigger('loggedin');
				window.location.hash = '#ranking';
			}
		});
	},
	logout: function(){
		that = this;
		$.post('authenticate/logout.php',{id:that.id},function(result){
			that.id = -1;
			that.username = '';
			$(document).trigger('loggedout');
			window.location.hash = '#login';
		});
	},
	authenticate: function(callback){
		$.get('authenticate/index.php',function(result){
			result = JSON.parse(result);
			callback(result);
		});
	},
	register: function(username=-1,password=-1,password2=-1){
		that = this;
		$.post('authenticate/register.php',{username:username,password:password,password2:password2},function(result){
			result = JSON.parse(result);			
			if(result['status']>0){
				that.login(username,password);
			}
			else{
				console.log(result);
			}
		});
	}
}




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
*/







////////////////////////////////////////////////////////////////////////////////
// Classes                                                                    //
////////////////////////////////////////////////////////////////////////////////
app.classes = {};
////////////////////////////////////////////////////////////////////////////////
// Model                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.classes.model = function(args){
	this.data = {};
	
	this.get = function(){
		args.get();
	}
	this.put = function(data){
		args.put(data);
	}
	this.post = function(value){
		args.post(value);
	}
	this.del = function(id){
		args.del(id);
	}
	
}


////////////////////////////////////////////////////////////////////////////////
// View                                                                       //
////////////////////////////////////////////////////////////////////////////////
app.classes.view = function(parent,model){
	this.parent = parent
	this.template = parent.html();
	this.model = model;

	this.update = function(){
		this._update(this.model,this.parent,this.template);
	}

	this._update = function(model,parent,template){
		// remove the parents content and replace it with template
		parent.html(template);

		var that = this;

		// look for all elements with a data-bind attribute in the template including the element itself
		var elements = $(parent).find('[data-bind]');
		if( $(parent).length ==1 && typeof $(parent).attr('data-bind') !== 'undefined' ){
			elements = $(parent).add(elements)
		}


		// loop over the elements
		elements.each(function(index,element){
			var bind = $(element).attr('data-bind');
			
			if(bind.indexOf(' in ') > -1){
				// if bind contains an ' in ' statement expand the child

				// get the part of bind after the ' in '
				var childstring = bind.substring(0,bind.indexOf(' in '));
				var parentstring = bind.substring(bind.indexOf(' in ')+4);

				if( typeof deepFind(model,parentstring)  !== 'undefined'  ){
			
					var find = 'data-bind=\"'+childstring+'\.';
					var re = new RegExp(find, 'g');

					$.each( model[parentstring],function(index,submodel){
						
						var child = $(element).clone()
						parent.append( child );
						child.attr('data-id',index);

						//$(element).remove();

						var subparent = $(child);
						var subtemplate = $(child).html();

						// replace all occurences of the childstring in data-bind attributes
						subtemplate = subtemplate.replace(re,'data-bind="');

						that._update(submodel,subparent,subtemplate);
					});
					$(element).remove();
				}
				else{
					//console.log('Error: Value not found in model');
				}
			}
			else{
				// check if bind is in the model and update the html if so
				if( typeof deepFind(model,bind) !== "undefined" ){

					if( $(element).is('input') ){
						$(element).val( deepFind(model,bind) )
					}
					else{
						$(element).html( deepFind(model,bind) )
					}
				}
			}
		
		});
	}
}


function deepFind(obj, path) {
  var paths = path.split('.')
    , current = obj
    , i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }
  return current;
}

