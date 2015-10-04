// JQuery wrapper


$(document).ready(function(){

	// show the 1st page
	var target = '#' + $('[data-role=page]').first().attr('id');
	//app.navigation.hashhistory.push(target);
	app.navigation.go(target);

////////////////////////////////////////////////////////////////////////////////
// Navigation                                                                 //
////////////////////////////////////////////////////////////////////////////////
	// action to perform when a link is clicked
	$(document).on('click tap','a[href^="#"]',function(event){
		event.preventDefault();
		
		var target = $(this).attr('href');
		if(target != '#'){
			app.navigation.go(target);
			event.stopPropagation();
			//app.navigation.hashhistory.push(target);
		}
	});

////////////////////////////////////////////////////////////////////////////////
// Popup and Panel                                                            //
////////////////////////////////////////////////////////////////////////////////
	// hide a panel or popup when clicked outside
	$(document).on('click tap','body',function(event){
		var currenttype = $(app.navigation.last()).attr('data-role');
		if( currenttype.substring(0,5) == 'panel' || currenttype == 'popup'){
			app.navigation.back();
		}
	});
	// do not hide the popup when clicked inside but do hide it when clicking on a popup
	$(document).on('click tap','[data-role=popup]',function(event){
		var currenttype = $(app.navigation.last()).attr('data-role');
		if( currenttype.substring(0,5) == 'panel' ){
			app.navigation.back();
		}
		else{
			event.stopPropagation();
		}
	});
	// do not hide the panel when clicked inside
	$(document).on('click tap','[data-role^=panel]',function(event){
		event.stopPropagation();
	});
	// hide a popup when a .close link is clicked
	$(document).on('click tap','[data-role=popup] a.close',function(event){
		app.navigation.back();
	});

	
////////////////////////////////////////////////////////////////////////////////
// Collapsible                                                                //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('click tap','[data-role=collapsible]>h1',function(event){
		//console.log( $(event.target).parent() )
		object = $(event.target).parent();
		if(object.hasClass('collapsed')){
			object.removeClass('collapsed');
		}
		else{
			object.addClass('collapsed');
		}
	}); 
	
////////////////////////////////////////////////////////////////////////////////
// Collapsible-set                                                            //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('click tap','[data-role=collapsible-set]>[data-role=collapsible]>h1',function(event){
		object = $(event.target).parent();
		siblings = object.siblings('[data-role=collapsible]');
		siblings.addClass('collapsed');
	});
////////////////////////////////////////////////////////////////////////////////
// Navigation functions                                                       //
////////////////////////////////////////////////////////////////////////////////
	$(document).on('submit','form',function(event){
		event.preventDefault();
	});

});


app.navigation = {}
////////////////////////////////////////////////////////////////////////////////
// Navigation functions                                                       //
////////////////////////////////////////////////////////////////////////////////
app.navigation.hashhistory = [];

app.navigation.navigate = function(target){
	$('[data-role=popup]').hide();
	$('[data-role=overlay]').hide();
	$('[data-role^=panel]').hide();

	if( $(target).attr('data-role') == 'page'){
		// got to the page
		$('[data-role=page]').hide();
		$(target).show();
	}
	else if( $(target).attr('data-role') == 'popup'){
		// close open popups
		$('[data-role=popup]').hide();
		// show the popup on top of the page
		$(target).show();
		$('[data-role=overlay]').show();
	}
	else if( $(target).attr('data-role').substring(0,5) == 'panel'){
		if( $('#menu').is(":visible") ){
			this.back();
		}
		else{
			// show the panel on top of the page
			$(target).show();
		}
	}
}
app.navigation.go = function(target){
	app.navigation.hashhistory.push(target);
	this.navigate(target);
}
app.navigation.back = function(){
	if(this.hashhistory.length>1){
		this.hashhistory.pop();
		this.navigate(this.last());
	}
}
app.navigation.last = function(){
	return this.hashhistory[this.hashhistory.length-1]
}
