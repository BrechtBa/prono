//
// 
// model.js is part of Prono
// @author: Brecht Baeten
// @license: GNU GENERAL PUBLIC LICENSE
// 
//




var model = {
	initialized: false,
	init: function(){	
		// start
		model.get_teams();
		model.get_competition();
		$(document).on('updated_competition',function(event,stage_id){
			model.get_prono_stage(stage_id);
		};
		
		// when the competition is loaded get the users
		$(document).on('updated_prono',function(event){
			model.get_usergroups(model.user.id);
		});
		
		model.initialized = true;
	},
	
	/*************************************************************************/
	/*                     Current user                                      */
	/*************************************************************************/
	user: {
		id: 1,
		name: '',
		email: ''
	},
	
	/*************************************************************************/
	/*                     Competition                                       */
	/*************************************************************************/
	teams: new Object(),        
	/*  example structure    
	teams: {
		1: {id: 1, name: 'Belgium', abr: 'BEL'},
		2: {id: 2, name: 'Germany', abr: 'GER'},
		...
	},
	*/
	
	/*************************************************************************/
	/*                     Competition                                       */
	/*************************************************************************/
	competition: new Object(),        
	/*  example structure          
	competition:{
		1: {
			id: 1,
			name: 'groupstage',
			type: 'points',
			groups: {
				1: {
					id: 1,
					name: 'A',
					matches: {
						1: {
							id: 1
							team1: 1,
							team2: 2,
							default_team1: 'A1',
							default_team2: 'A2',
							score1: -1,
							score2: -1
						}
						...
					}
				}
				...
			}
		},
		2: {
			id: 2,
			name: 'round of 16',
			type: 'knockout',
			groups: {
				0: {
					id: 0,
					name: 0,
					matches: {
						33: {
							id: 33
							team1: 0,
							team2: 0,
							default_team1: '1A',
							default_team2: '2B',
							score1: -1,
							score2: -1
						}
						...
					}
				}
			}
		},
		...
	},
	*/
	
	/* reads the competition data from the database                          */
	read_competition = function(){
		
		// read rounds from the database
		$.post('requests/select_from_table.php',{table: 'rounds', where: ''},function(result){
			var rounds = JSON.parse(result);
			
			$.each(rounds, function(index,round){
				// add the round
				competition[round.name] = {
					id: round.id,
					name: round.name,
					type: round.type,
					groups:{}
				};
				if(round.type=='points'){
					
					// read groups from the database
					$.post('requests/select_from_table.php',{table: 'groups'},function(result){
						var groups = JSON.parse(result);
					
						$.each(groups, function(index,group){
							
							// add the group
							competition[round.name].groups[group.name] = {
								id: group.id,
								name: group.name,
								matches: {}
							};
							
							// read matches from the database
							$.post('requests/select_from_table.php',{table: 'matches', where: 'round_id='+round.id+' AND group_id='+group.id},function(result){
								var matches = JSON.parse(result);
								$.each(matches, function(index,match){
							
									// add the match
									competition[round.name].groups[group.name].matches[match.id] = prono.read_match(match.id);
									
								});
							});
						});
					});
				}
				else{
					// add the an empty group
					competition[round.name].groups[0] = {
						id: 0,
						name: 0,
						matches: {}
					};
					
					// read matches from the database
					$.post('requests/select_from_table.php',{table: 'matches', where: 'round_id='+round.id},function(result){
						var matches = JSON.parse(result);
						$.each(matches, function(index,match){
							
							// add the match
							competition[round.name].groups[0].matches[match.id] = prono.read_match(match.id);
							
						});
					});
				}
			});
		});
	},
	
	/* returns match data from the database                                  */
	read_match = function(id){
		var match = {};
		
		if(id != 0){
			$.ajax({type:'POST', url:'requests/select_from_table.php', data:{table: 'matches', where: 'id='+id}, dataType:'html', async:false, success:function(result){
				tmpmatch = JSON.parse(result);
				match = {
					id: tmpmatch[1].id,
					team1: prono.read_team(tmpmatch[1].team1_id),
					team2: prono.read_team(tmpmatch[1].team2_id),
					default_team1: tmpmatch[1].default_team1,
					default_team2: tmpmatch[1].default_team2,
					score1: tmpmatch[1].score1,
					score2: tmpmatch[1].score2
				};
			}});
		}
		return match;
	},
	
	/* returns team data from the database                                   */
	read_team = function(id){
		var team = 0;
		
		if(id != 0){
			$.ajax({type:'POST', url:'requests/select_from_table.php', data:{table: 'teams', where: 'id='+id}, dataType:'html', async:false, success:function(result){
				tmpteam = JSON.parse(result);
				team = {
					id: tmpteam[1].id,
					name: tmpteam[1].name,
					abrv: tmpteam[1].abrv,
				};
			}});
		}
		return team;
	},
	/*************************************************************************/
	/*                     Prono                                             */
	/*************************************************************************/
	prono: new Object(),  
	/*  example structure    
	prono: {
		stages:{
			'groupstage': {
				score_points: 3,
				result_points: 4
			},
			'roundof16': {
				score_points: 6,
				result_points: 8
			},
			...
		},
		teamselections: {
			'groupA_1':{
				id: 1,
				name: 'groupA_1',
				displayname: 'Group A winner',
				points: 3
			}
			...
		}
	},
	*/
	/*************************************************************************/
	/*                     Userprono                                         */
	/*************************************************************************/
	userprono: new Object(),        
	/*  example structure          
	userprono: {
		user: {
			id: 1,
			name: 'BB'
		},
		points:{
			'groupstage': 0,
			'roundof16': 0,
			...
		}
		matches: {
			1: {
				score1: 0,
				score2: 1
			},
			...
		},
		teamselections: {
			'groupA_1': 1,
			'groupA_2': 2,
			'roundof16_1': 1,
			...
		},
		numberselections: {
			'totalgoals': 142,
			'hometeam': 4
		}
	}
	*/
	
};