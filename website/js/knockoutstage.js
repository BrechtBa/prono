$( document ).ready(function(){
	$( document ).on( "click","div.knockoutstage div.match", function() {
		
		// find stage
		var stage = $(this).parents("div[class^='stage']").attr('class');

		// set the large width
		var large_width = "6.5em";
		if(stage=="stage4"){
			var large_width = "12em";
		}
		
		// set width of all stage elements and hide all content
		$("div.knockoutstage div.match").css('width','1em');
		$("div.knockoutstage div.match div").css('visibility','hidden');
		
		// set width of current stage and show content
		$("div.knockoutstage div."+stage+" div.match").css('width',large_width);
		$("div.knockoutstage div."+stage+" div.match div").css('visibility','visible');
		
		
	});
});

