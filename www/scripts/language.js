
(function(document) {
	'use strict';

	// Grab a reference to our auto-binding template
	// and give it some initial binding values
	// Learn more about auto-binding templates at http://goo.gl/Dx1u2g
	var app = document.querySelector('#app');

	// define the language
	app.language = 'nl';

	// define the dictionary
	app.dictionary = {};
	app.dictionary['Menu'] 					= {'nl':'Menu'};
	app.dictionary['Ranking'] 				= {'nl':'Rangschikking'};
	app.dictionary['Prono'] 				= {'nl':'Prono'};
	app.dictionary['Results'] 				= {'nl':'Resultaten'};
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
	app.dictionary['Group'] 				= {'nl':'Groep'};
	app.dictionary['Winner'] 				= {'nl':'Winnaar'};
	app.dictionary['Runner up'] 			= {'nl':'Tweede'};
	app.dictionary['selections remaining'] 	= {'nl':'Selecties over:'};
	app.dictionary['Teams in round of 16:'] = {'nl':'Ploegen in de 8e finale:'};
	app.dictionary['Teams in quarterfinal:']= {'nl':'Ploegen in de kwartfinale:'};
	app.dictionary['Teams in semifinal:'] 	= {'nl':'Ploegen in de halve finale:'};
	app.dictionary['Teams in final:'] 		= {'nl':'Ploegen in de finale:'};
	app.dictionary['Winner:'] 				= {'nl':'Winnaar:'};
	app.dictionary['Group stage winners'] 	= {'nl':'Winnaars groepsfase'};
	app.dictionary['Knockout stage teams']	= {'nl':'Knockout fase ploegen'};
	app.dictionary['Total goals'] 			= {'nl':'Aantal goals'};
	app.dictionary['Team result'] 			= {'nl':'Ploeg resultaat'};
	app.dictionary['Total'] 				= {'nl':'Totaal'};
	app.dictionary['Team result'] 			= {'nl':'Ploeg resultaat'};
	app.dictionary['Result'] 				= {'nl':'Resultaat'};
	app.dictionary['eliminated in the groupstage'] 		= {'nl':'geëlimineerd in de groepsfase'};
	app.dictionary['eliminated in the round of '] 		= {'nl':'geëlimineerd in de round of '};
	app.dictionary['eliminated in the round of 16'] 	= {'nl':'geëlimineerd in de 8e finale'};
	app.dictionary['eliminated in the quarter-finals'] 	= {'nl':'geëlimineerd in de kwartfinale'};
	app.dictionary['eliminated in the semi-finals'] 	= {'nl':'geëlimineerd in de halve finale'};
	app.dictionary['eliminated in the final'] 			= {'nl':'geëlimineerd in de finale'};
	app.dictionary['winner'] 							= {'nl':'winnaar'};
	app.dictionary['Total goals'] 				= {'nl':'Aantal goals'};
	app.dictionary['Edit profile'] 				= {'nl':'Profiel aanpassen'};
	app.dictionary['Change password'] 				= {'nl':'Wachtwoord veranderen'};
	app.dictionary['Change avatar'] 				= {'nl':'Verander avatar'};
	app.dictionary['Login or password are incorrect'] 	= {'nl':'Login of wachtwoord verkeerd'};
	app.dictionary['Login'] 				= {'nl':'Login'};
	app.dictionary['Password'] 				= {'nl':'Wachtwoord'};
	app.dictionary['Register'] 				= {'nl':'Registreer'};
	app.dictionary['Login is taken'] 		= {'nl':'Login bestaat al'};
	app.dictionary['Repeat password'] 				= {'nl':'Herhaal wachtwoord'};

	


	app.trans = function(key){		
		var val = key;
		try{
			// translate
			val = app.dictionary[key][app.language]

			/*
			// capitalization of 1st letter
			if(key[0] == key[0].toUpperCase()) {
				val = val[0].toUpperCase() + val.slice(1);
			}
			
			// capitalization of words
			var words = key.split(' ');
			var capitalized=true;
			words.forEach(function(word){
				if(key[0] != key[0].toUpperCase()) {
					capitalized = false;
				}
			});
			if(capitalized){
				var words = val.split(' ');
				var newwords = []
				words.forEach(function(word){
					newwords.push( word[0].toUpperCase() + word.slice(1) );
				});
				val = newwords.join(' ');
			}
			*/
		}
		catch(e){
			console.log(key)
			console.log(app.dictionary[key])
		}

		return val;
	};

})(document);
