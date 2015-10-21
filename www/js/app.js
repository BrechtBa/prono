

var app = app || {};

////////////////////////////////////////////////////////////////////////////////
// Model                                                                      //
////////////////////////////////////////////////////////////////////////////////
app.model = {};
app.add_model = function(name,methods){
	app.model[name] = {};
	var that = app.model[name];
	
	that.get = function(){
		return methods['get'](that);
	}
	that.post = function(data){
		return methods['post'](that,data);
	}
	that.put = function(id,data){
		return methods['put'](that,id,data);
	}
	that.delete = function(id){
		return methods['delete'](that,id);
	}
}



////////////////////////////////////////////////////////////////////////////////
// View                                                                       //
////////////////////////////////////////////////////////////////////////////////
app.view = {}
app.add_view = function(key,parent){
	// class to bind a model to a view
	// arguments:
	// parent:      a jquery dom element
	
	app.view[key] = new app._view(parent);
	
	// add an update event to the document
	$(document).on(key+'ViewUpdate',function(){
		app.view[key].update();
	});
}


// _view class
app._view = function(parent){
	this.parent = parent
	this.template = parent.html();
};
app._view.prototype.update = function(){
	this._update(app.model,this.parent,this.template);
}
app._view.prototype._update = function(model,parent,template){
	// remove the parents content and replace it with template
	parent.html(template);

	var that = this;

	var todolist = [];
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
			
			
			// check if the parentstring contains an orderby statement
			if(parentstring.indexOf(' orderby ') > -1){
				var temp = parentstring
				parentstring = temp.substring(0,temp.indexOf(' orderby '));
				var orderstring = temp.substring(temp.indexOf(' orderby ')+9);
				
				// check if the orderstring contains a reversed statement
				var reversed = false;
				if(orderstring.indexOf(' reversed') > -1){
					var orderstring = orderstring.substring(0,orderstring.indexOf(' reversed'));
					reversed = true;
				}
			}
			
			
			
			var temp = childstring;
			// get only the part of the child before the 1st dot
			var attribute = '';
			if(temp.indexOf('.') > -1){
				childstring = temp.substr(0,temp.indexOf('.'));
				attribute = temp.substr(temp.indexOf('.')+1);
			}
			
			// check if the parent exists in the model
			if( typeof that.deepFind(model,parentstring)  !== 'undefined'  ){
				
				// prepare a regular expression to remove the childstring from the added elements
				var re = new RegExp(childstring+'\\.', 'g');
				
				// get the container element and
				var container = $(element).parent();
				if(typeof container === 'undefined'){
					container = parent;
				}
				
				// create a list of submodels
				var submodels = [];
				$.each(that.deepFind(model,parentstring),function(index,submodel){
					submodels.push(submodel);
				});
				
				// order the list of submodels if required
				if(typeof orderstring  !== 'undefined' && typeof submodels[0] !== 'undefined'){
					if( typeof that.deepFind(submodels[0],orderstring)  !== 'undefined' ){
						submodels.sort(function(a, b){
							if(reversed){
								return that.deepFind(b,orderstring)- that.deepFind(a,orderstring);
							}
							else{
								return that.deepFind(a,orderstring)- that.deepFind(b,orderstring);
							}
						});
					}
				}
				
				$.each(submodels,function(index,submodel){
					if(typeof submodel === typeof {} ){
	
						var child = $(element).clone()
						container.append( child );
						
						// the submodel must have an id value to reference it
						if( child.is('option') ){
							child.attr('value',submodel.id);
						}
						else{
							child.attr('data-id',submodel.id);
						}
						
						// if the attribute is found in the submodel fill it in
						var ret = that.bindValue(child,submodel,attribute);
						if(ret !== false){
							todolist.push(ret);
						}
						// try to go one level deeper
						var subparent = $(child);
						var subtemplate = $(child).html();
						
						// replace all occurences of the childstring in data-bind attributes
						subtemplate = subtemplate.replace(re,'');

						that._update(submodel,subparent,subtemplate);
					}
				});
				// if it is a select list, prepend a blank opption
				if( $(element).is('option') ){
					var child = $(element).clone()
					child.attr('value','');
					container.prepend( child );
				}

				$(element).remove();
			}
			else{
				//console.log('Error: Value not found in model');
			}
		}
		else{
			// check if bind is in the model and update the html if so
			var ret = that.bindValue(element,model,bind);
			if(ret !== false){
				todolist.push(ret);
			}
		}
	});



	// check for bind-class emenents
	var classelements = $(parent).find('[data-bind-class]');
	if( $(parent).length ==1 && typeof $(parent).attr('data-bind-class') !== 'undefined' ){
		classelements = $(parent).add(classelements)
	}
	// loop over the elements
	classelements.each(function(index,classelement){
		var classbind = $(classelement).attr('data-bind-class');
		// bind classes
		that.bindClass(classelement,model,classbind);
	});


	// set all values in the todolist
	$.each(todolist,function(index,value){
		$(value.element).val( value.value );
	});
}
app._view.prototype.bindValue = function(element,model,bind){
	that = this;

	var val = false;
	if( typeof that.deepFind(model,bind) !== "undefined" ){
		val = that.deepFind(model,bind);
	}
	else{
		// check if there is a parse(*.) statement in the bind and redefine the parsefun if so
		$.each(app.view.functions,function(index,parsefun){
			var re = new RegExp(index+'\\(([^)]+)\\)');
			var arg = re.exec(bind);
			if(arg !== null){
				if( typeof that.deepFind(model,arg[1]) !== "undefined" ){
					val = parsefun(that.deepFind(model,arg[1]));
				}
			}
		});
	}
	
	ret = false;
	if(val !== false){
		if( $(element).is('input') ){
			$(element).val( val );
		}
		else if( $(element).is('img') ){
			$(element).attr('src',val );
		}
		else if( $(element).is('select') ){
			$(element).val( val );
			// select hack
			// return the element and value and store them in a list as they must be set after the options, which can be dynamic are added
			ret = {element:element, value:val};
		}
		else{
			$(element).html( val );
		}
	}
	return ret;
}
app._view.prototype.bindClass = function(element,model,bind){
	that = this;

	var val = false;
	if( typeof that.deepFind(model,bind) !== "undefined" ){
		val = that.deepFind(model,bind);
	}
	else{
		// check if there is a parse(*.) statement in the bind and redefine the parsefun if so
		$.each(app.view.functions,function(index,parsefun){
			var re = new RegExp(index+'\\(([^)]+)\\)');
			var arg = re.exec(bind);
			if(arg !== null){
				if( typeof that.deepFind(model,arg[1]) !== "undefined" ){
					val = parsefun(that.deepFind(model,arg[1]));
				}
			}
		});
	}
	if(val !== false){
		$(element).addClass(val);
	}
}

app._view.prototype.deepFind = function(obj, path){
	var paths = path.split('.')
    	, current = obj
    	, i;

	for (i = 0; i < paths.length; ++i) {
		if (current[paths[i]] == undefined) {
      		return undefined;
    	}
		else {
      		current = current[paths[i]];
    	}
  	}
  	return current;
}


////////////////////////////////////////////////////////////////////////////////
// Bind the elements with a data-view attribute                               //
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
	$('[data-view]').each(function(index,element){
		app.add_view(element.attr('data-view'),element);
	});
});