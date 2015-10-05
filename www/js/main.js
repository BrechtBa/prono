

var app = app || {};

app.model = {};
app.view = {};



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
