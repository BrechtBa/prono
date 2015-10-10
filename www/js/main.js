

var app = app || {};







////////////////////////////////////////////////////////////////////////////////
// Services                                                                   //
////////////////////////////////////////////////////////////////////////////////
app.service = {};
app.service.api = {};
app.service.api.location = '';
app.service.api.put = function(apiTable,data,callback){

	/*
	$.ajax({
		type:'PUT',
		dataType:'json',
		data: JSON.stringify(data),
		url: app.service.api.location+'/api/index.php/'+apiTable+'/',
		statusCode:{
			200: function(result){
				console.log(result)
				callback(result)
			}
		},
		error: function(result){
			console.log(result);
		}
	});
	*/
	callback(data);
}


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
			
					var find = childstring+'\.';
					var re = new RegExp(find, 'g');

					$.each( model[parentstring],function(index,submodel){

						var child = $(element).clone()
						parent.append( child );

						$(element).remove();

						var subparent = $(child);
						var subtemplate = $(child).html().replace(re,'');

						that._update(submodel,subparent,subtemplate);
					});
				}
				else{
					//console.log('Error: Value not found in model');
				}
			}
			else{
				// check if bind is in the model and update the html if so

				if( typeof deepFind(model,bind) !== "undefined" ){
					console.log($(element));
					console.log(deepFind(model,bind));

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



app.views = {};
app.views.update = function(model,parent){
	
	// look for all elements with a data-bind attribute
	parent.find('[data-bind]').each(function(index,value){
		var bind = $(value).attr('data-bind');

		// if bind contains an ' in ' statement
		if(bind.indexOf(' in ') > -1){

			// get the subparent and submodel
			var subparent = $(value).parent();
			
			// get the part of bind after the ' in '
			var childstring = bind.substring(0,bind.indexOf(' in '));
			var parentstring = bind.substring(bind.indexOf(' in ')+4);
			
			if( typeof deepFind(model,parentstring)  !== "undefined"  ){
			
				var find = childstring+'\.';
				var re = new RegExp(find, 'g');
				var template = value.outerHTML.replace(re,'');
				$(value).remove();
				
				$.each( model[parentstring],function(index,submodel){
					var subparent = $(template);
					parent.append( subparent )
					app.views.update(submodel,subparent);
				});
			}
		}
		else{
			if( typeof deepFind(model,bind) !== "undefined" ){
				if( $(value).is('input') ){
					$(value).val( deepFind(model,bind) )
				}
				else{
					$(value).html( deepFind(model,bind) )
				}
			}
		}
		
		
		// check if bind is in the model and update the html if so
	});
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


/*
// binding class
app.view.Bind = function(bind,parent,callback){

	this.parent = parent	
	this.bind = bind;

	this.template = this.parent.find('[data-template="'+this.bind+'"][data-id="-1"]'); 
	this.content = this.template.prop('outerHTML');
	this.html = function(id){
		return $(this.content).attr('data-id',id).prop('outerHTML');
	}
	this.update = callback;
	this.updateview = function(modeldata){
		that = this;
		template = this.parent.find('[data-template="'+this.bind+'"]:not([data-id=-1])').remove();
		
		// loop over each object in the list
		$.each(modeldata,function(index,value){
			var domobject = $(that.html(value.id));		
			
			// loop over each child dom object with a data-bind attribute and set the html
			domobject.find('[data-bind]').each(function(domindex,domvalue){
				var key = $(domvalue).attr('data-bind');
				if(key in value){
					if($(domvalue).is('input')){
						$(domvalue).val(value[key]);
					}
					else{
						$(domvalue).html(value[key]);
					}
				}
			});
			domobject.insertBefore(that.template);
		});
	}
};
*/
