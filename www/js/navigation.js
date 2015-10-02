// JQuery wrapper
$(document).ready(function(){
	
	// show the 1st page
	var target = '#' + $('[data-role=page]').first().attr('id');
	hashhistory.push(target);
	navigate(target);

////////////////////////////////////////////////////////////////////////////////
// Navigation                                                                 //
////////////////////////////////////////////////////////////////////////////////
	// action to perform when a link is clicked
	$(document).on('click tap','a[href^="#"]',function(event){
		event.preventDefault();
		
		var target = $(this).attr('href');
		if(target != '#'){
			navigate(target);
			event.stopPropagation();
			hashhistory.push(target);
		}
	});

////////////////////////////////////////////////////////////////////////////////
// Popup and Panel                                                            //
////////////////////////////////////////////////////////////////////////////////
	// hide a panel or popup when clicked outside
	$(document).on('click tap','body',function(event){
		var currenttype = $(hashhistory[hashhistory.length-1]).attr('data-role');
		if( currenttype.substring(0,5) == 'panel' || currenttype == 'popup'){
			back();
		}
	});
	// do not hide the popup when clicked inside but do hide it when clicking on a popup
	$(document).on('click tap','[data-role=popup]',function(event){
		var currenttype = $(hashhistory[hashhistory.length-1]).attr('data-role');
		if( currenttype.substring(0,5) == 'panel' ){
			back();
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
		back();
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


////////////////////////////////////////////////////////////////////////////////
// Navigation functions                                                       //
////////////////////////////////////////////////////////////////////////////////
var hashhistory = [];

navigate = function(target){
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
			back();
		}
		else{
			// show the panel on top of the page
			$(target).show();
		}
	}
}
back = function(){
	if(hashhistory.length>1){
		hashhistory.pop();
		navigate(hashhistory[hashhistory.length-1]);
	}
}
