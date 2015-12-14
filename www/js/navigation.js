// JQuery wrapper
$(document).ready(function(){

////////////////////////////////////////////////////////////////////////////////
// Pages                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$('[data-role=page]').hide();
	if(window.location.hash==""){
		$('[data-role=page]').first().show();
	}
	else{
		$(window.location.hash).show()
	}

	// open page
	$(document).on('click tap','[href^="#"]',function(event){
		event.preventDefault();
		var target = $(this).attr('href');
		if( target!='#' && target!='#close' && $(target).attr('data-role')=='page' ){			
			//change the window hash
			window.location.hash = this.hash;
			event.stopPropagation();
		}
	});

	$(window).on('hashchange',function(event){
		event.preventDefault();
		$('[data-role="page"]').hide()
		$(window.location.hash).show()
	});

////////////////////////////////////////////////////////////////////////////////
// Panel                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$('[data-role^=panel]').hide();
	$('[data-role=overlaypanel]').hide();
	var openPanels = [];
	// open panel
	$(document).on('click tap','[href^="#"]',function(event){
		event.preventDefault();
		
		var target = $(this).attr('href');
		if( target!='#' && target!='#close' && $(target).attr('data-role').substring(0,5)=='panel' ){
			$(document).trigger('openPanel',[target]);
			event.stopPropagation();
		}
	});
	// close panel
	$(document).on('click tap','[data-role=overlaypanel]',function(event){
		$(document).trigger('closePanel');
	});
	// do not hide the panel when clicked inside
	$(document).on('click tap','[data-role^=panel]',function(event){
		event.stopPropagation();
	});
	// hide the panel when clicking on a link with a #attribute
	$(document).on('click tap','[data-role^=panel] [href^="#"]',function(event){
		event.preventDefault();
		$(document).trigger('closePanel');
	});
	
	$(document).on('openPanel',function(event,target){
		$(target).show();
		$('[data-role="overlaypanel"]').show();
		openPanels.push($(target));
	});
	$(document).on('closePanel',function(event){
		currentPanel = openPanels.pop()
		if( currentPanel != undefined ){
			currentPanel.hide()
		}
		if( openPanels.length == 0){
			$('[data-role="overlaypanel"]').hide();
		}
	});
	
////////////////////////////////////////////////////////////////////////////////
// Popup                                                                      //
////////////////////////////////////////////////////////////////////////////////
	$('[data-role=popup]').hide();
	$('[data-role=overlay]').hide();
	var openPopups = [];
	// open popup
	$(document).on('click tap','[href^="#"]',function(event){
		event.preventDefault();
		
		var target = $(this).attr('href');
		if( target!='#' && target!='#close' && $(target).attr('data-role').substring(0,5)=='popup' ){
			$(document).trigger('openPopup',[target]);
			event.stopPropagation();
		}
	});
	// close popup
	$(document).on('click tap','[data-role=overlay]',function(event){
		$(document).trigger('closePopup');
	});
	// do not hide the popup when clicked inside a popup
	$(document).on('click tap','[data-role=popup]',function(event){
		event.stopPropagation();
	});
	// hide the popup when clicking on a link with a #attribute
	$(document).on('click tap','[data-role^="popup"] [href^="#"]',function(event){
		event.preventDefault();
		$(document).trigger('closePopup');
	});
	
	$(document).on('openPopup',function(event,target){
		$(target).show();
		$('[data-role="overlay"]').show();
		openPopups.push($(target));
	});
	$(document).on('closePopup',function(event){
		currentPopup = openPopups.pop()
		if( currentPopup != undefined ){
			currentPopup.hide();
		}
		if( openPopups.length == 0){
			$('[data-role="overlay"]').hide();
		}	
	});
	
	
	
////////////////////////////////////////////////////////////////////////////////
// Hide Header on on scroll down                                              //
////////////////////////////////////////////////////////////////////////////////
/*
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var content = $('[data-role="content"]');
	var header = $('[data-role="fixed-header"]');
	var headerHeight = header.outerHeight();

	content.scroll(function(event){
		didScroll = true;
	});
	setInterval(function(){
		if(didScroll){
			hasScrolled();
			didScroll = false;
		}
	}, 250);
	function hasScrolled() {
		var st = $(content).scrollTop();

		// Make sure they scroll more than delta
		if(Math.abs(lastScrollTop - st) <= delta)
			return;
		
		// If they scrolled down and are past the header, add class .header-up.
		// This is necessary so you never see what is "behind" the header.
		if (st > lastScrollTop && st > headerHeight){
			// Scroll Down
			header.addClass('header-up');
		}
		else{
			// Scroll Up
			if(st + content.height() < $(document).height()){
				header.removeClass('header-up');
			}
		}
		lastScrollTop = st;
	}
*/
});
