
(function(document) {
	'use strict';

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');

	// define the language
	app.language = 'nl';

	// define the global dictionary
	app.dictionary = {};
	app.dictionary['Terms'] 				= {'nl':'Gebruiksvoorwaarden'};
	app.dictionary['Menu'] 					= {'nl':'Menu'};
	app.dictionary['Ranking'] 				= {'nl':'Rangschikking'};
	app.dictionary['Prono'] 				= {'nl':'Prono'};
	app.dictionary['Results'] 				= {'nl':'Resultaten'};
	app.dictionary['Rules'] 				= {'nl':'Spelregels'};
	app.dictionary['Profile'] 				= {'nl':'Profiel'};
	app.dictionary['Config'] 				= {'nl':'Config'};
	app.dictionary['Users'] 				= {'nl':'Users'};
	app.dictionary['Logout'] 				= {'nl':'Logout'};
	app.dictionary['Group stage'] 			= {'nl':'Groepsfase'};
	app.dictionary['Knockout stage'] 		= {'nl':'Knockout fase'};
	app.dictionary['Varia']					= {'nl':'Varia'};
	app.dictionary['Finals'] 				= {'nl':'Finale'};
	app.dictionary['Matches'] 				= {'nl':'Wedstrijden'};
	app.dictionary['Teams'] 				= {'nl':'Ploegen'};
	app.dictionary['close'] 				= {'nl':'sluiten'};
	app.dictionary['Save'] 					= {'nl':'Opslaan'};

	app.trans = function(key,localdictionary){		
		var val = key;

		try{
			// try the local dictionary
			val = localdictionary[key][app.language]
		}
		catch(e){
			try{
				// try the global dictionary
				val = app.dictionary[key][app.language]

			}
			catch(e){
				// return the key
			}
		}

		return val;
	};

})(document);
