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
// Templates                                                                  //
////////////////////////////////////////////////////////////////////////////////
	app.Template = function( name ){
		this.name = name;
		console.log($('[data-template="'+this.name+'"][data-id="-1"]'))
		this.content = $('[data-template="'+this.name+'"][data-id="-1"]').prop('outerHTML');
		this.html = function(id){
			return $(this.content).attr('data-id',id).prop('outerHTML');
		}
	}
	
	app.templates = app.templates || {};
	
	$('[data-id="-1"]').each(function(index,value){
		app.templates[$(value).attr('data-template')] = new app.Template($(value).attr('data-template'));
	});
	


////////////////////////////////////////////////////////////////////////////////
// View data binding                                                          //
////////////////////////////////////////////////////////////////////////////////	

	app.view.user = new app.view.Bind('user',$(document));




	
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
