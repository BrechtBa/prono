import React, { useState, useContext, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import APIContext from './APIProvider.js';
import { Disabled, TeamName, TeamIcon, EditScoreDialog } from './MatchUtils.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    group: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      margin: '5px'
    },
    match: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
    team1: {
      width: '5px',
      display: 'flex',
      justifyContent: 'center',
    },
    team2: {
      width: '5px',
      display: 'flex',
      justifyContent: 'center',
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    },
    score: {
      width: '5px',
      display:'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 4,
    },
    scoreRegular: {
      width: '40px',
      textAlign: 'center'
    },
    scorePenalty: {
      fontSize: '0.8em',
      width: '40px',
      textAlign: 'center'
    }
  })
);


function Match(props) {
  const match = props.match;
  const showPenaltyEdit = props.showPenaltyEdit;
  const collapsed = props.collapsed;
  const onSave = props.onSave

  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false)

  const formatScore = (score) => {
    if(score >= 0){
      return score
    }
    else{
      return ''
    }
  }

  const showPenalty = (penalty1, penalty2, collapsed) => {
    return (!collapsed && penalty1 > -1 && penalty2 >-1);
  }

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match} onClick={() => setEditScoreDialogOpen(true)}>
        <div className={classes.team1}>
          <TeamName team={match.team1} def={match.defaultteam1} />
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team1} />
        </div>
        <div className={classes.score}>
          <div className={classes.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>

          {showPenalty(match.penalty1, match.penalty2, collapsed) &&
            <div className={classes.scorePenalty}>({formatScore(match.penalty1)} - {formatScore(match.penalty2)})</div>
          }
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team2} />
        </div>
        <div className={classes.team2}>
            <TeamName team={match.team2} def={match.defaultteam2} />
        </div>
      </div>

      <EditScoreDialog match={match} open={editScoreDialogOpen} setOpen={setEditScoreDialogOpen} onSave={onSave} showPenaltyEdit={showPenaltyEdit}/>
    </div>
  )


}


const getMatchColumns = (knockoutstages) => {

  const matchColumnsLeft = knockoutstages.map((stage) => {
    if(stage.matches.length > 1){
      const col = {
        key: `L${stage.key}`,
        stage: stage.key,
        matches: stage.matches.slice(0, stage.matches.length/2)
      }
      return col;
    }
    else {
      //final
      const col = {
        key: `F${stage.key}`,
        stage: stage.key,
        matches: stage.matches
      }
      return col;
    }
  });

  const matchColumnsRight = knockoutstages.slice(0, knockoutstages.length-1).reverse().map((stage) => {
    if(stage.matches.length > 1){
      const col = {
        key: `R${stage.key}`,
        stage: stage.key,
        matches: stage.matches.slice(stage.matches.length/2, stage.matches.length)
      }
      return col;
    }
  });

  const matchColumns = matchColumnsLeft.concat(matchColumnsRight);
  console.log(matchColumns)
  return matchColumns
}


export function KnockoutStage(props) {
  const stages = props.stages;
  const columns = getMatchColumns(stages);

  const [openStage, setOpenStage] = useState('16')

  const getStageGrow = (stage, openStage) => {
    if(stage == openStage){
      return 4;
    }
    else{
      return 1
    }
  }

  const api = useContext(APIContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatch(match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2})
  }

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
      {columns.map( (column) => (
        <div key={column.key} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '750px', marginRight: '5px', marginLeft: '5px', flexGrow: getStageGrow(column.stage, openStage)}}
         onClick={() => setOpenStage(column.stage)}>

          {column.matches.map((match, matchIndex) => (
            <div key={match.key}>
              {(column.key == 'R4' && matchIndex == 0)  && (<div style={{height: '80px'}}></div>)}

              <Paper style={{padding: '5px', height: '175px', overflowX: 'hidden'}}>
                <Match match={match} showPenaltyEdit={true} onSave={saveMatch}/>
              </Paper>

              {(column.key == 'L4' && matchIndex == 0)  && (<div style={{height: '80px'}}></div>)}
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};


export function KnockoutStageProno(props) {
  const user = props.user;
  const stages = props.stages;
  const columns = getMatchColumns(stages);

  const [openStage, setOpenStage] = useState('16')

  const getStageGrow = (stage, openStage) => {
    if(stage == openStage){
      return 4;
    }
    else{
      return 1
    }
  }

  const api = useContext(APIContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatchProno(user, match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2})
  }

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
      {columns.map( (column) => (
        <div key={column.key} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', height: '750px', marginRight: '5px', marginLeft: '5px', flexGrow: getStageGrow(column.stage, openStage)}}
         onClick={() => setOpenStage(column.stage)}>

          {column.matches.map((match, matchIndex) => (
            <div key={match.key}>
              {(column.key == 'R4' && matchIndex == 0)  && (<div style={{height: '80px'}}></div>)}

              <Paper style={{padding: '5px', height: '175px', overflowX: 'hidden'}}>
                <Match match={match} showPenaltyEdit={false} onSave={saveMatch}/>
              </Paper>

              {(column.key == 'L4' && matchIndex == 0)  && (<div style={{height: '80px'}}></div>)}
            </div>
          ))}

        </div>
      ))}
    </div>
  );
};


function StageTeamPronoSelectDialog(props){
  const numberOfTeams = props.numberOfTeams;
  const teams = props.teams;
  const oldSelectedTeams = props.selectedTeams;
  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave

  const oldSelectedTeamsKeys = oldSelectedTeams.map((team) => {
    return team.key;
  })

  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    const oldSelectedTeamsKeys = oldSelectedTeams.map((team) => {
      return team.key;
    })

    let tempSelectedTeams = [];
    if(teams !== undefined){

      tempSelectedTeams = Object.keys(teams).map(function(key) {
        if(oldSelectedTeamsKeys.indexOf(key) >=0 ){
          return {team: teams[key], selected: true};
        }
        else{
          return {team: teams[key], selected: false};
        }
      });
    }
    setSelectedTeams(tempSelectedTeams)

  }, [teams, oldSelectedTeams]);

  const getRemainingTeams = (numberOfTeams, tempSelectedTeams) => {
    return numberOfTeams - tempSelectedTeams.filter((team) => {
      return team.selected
    }).length
  }

  const getStyle = (selected) => {
    if(selected){
      return {backgroundColor: '#cccccc', width: '180px'}
    }
    else{
      return {width: '180px'}
    }
  }

  const toggleTeam = (team) => {

      const tempSelectedTeams = selectedTeams.map((val) => {
        let temp_val = JSON.parse(JSON.stringify(val))
        if(val.team.key == team.team.key){

          if(temp_val.selected || getRemainingTeams(numberOfTeams, selectedTeams) > 0){
            temp_val.selected = !temp_val.selected
          }
        }
        return temp_val
      });
      console.log(tempSelectedTeams)
      setSelectedTeams(tempSelectedTeams)
  }

  const handleSave = () => {
    const selectedTeamsList = selectedTeams.filter((team) => {return team.selected}).map((team) => {return team.team});
    onSave(selectedTeamsList)
    setOpen(false)
  }

  const classes = useStyles();

  return (
    <Dialog onClose={() => setOpen(false)} open={open} style={{padding: '10px'}}>
      <form>
        <div style={{padding: '20px'}}>
          <div>
            Nog {getRemainingTeams(numberOfTeams, selectedTeams)} teams.
          </div>
          <List style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            {selectedTeams.map((team) => (
              <ListItem key={team.team.key} button style={getStyle(team.selected)} onClick={() => toggleTeam(team)}>
                <div className={classes.teamIcon}>
                  <TeamIcon team={team.team} />
                </div>
                <div style={{marginLeft: '10px'}}>
                  <TeamName team={team.team} def={''}/>
                </div>
              </ListItem>
            ))}
          </List>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
            <Button onClick={() => handleSave()}>save</Button>
            <Button onClick={() => setOpen(false)}>cancel</Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

function KnockoutStageTeamsPronoStage(props) {
  const user = props.user;
  const pronoStage = props.pronoStage;
  const selectedTeams = props.selectedTeams;
  const teams = props.teams;

  const [editTeamsDialogOpen, setEditTeamsDialogOpen] = useState(false)

  const handleSave = (selectedTeams) => {
    console.log(selectedTeams)
  }

  const api = useContext(APIContext);

  const saveStageTeams = (selectedTeams) => {
    api.updateStageTeamsProno(user, pronoStage, selectedTeams)
  }


  const classes = useStyles();

  return (
    <div>
      <Paper key={pronoStage.stage} style={{padding: '10px', marginBottom: '10px'}} onClick={() => setEditTeamsDialogOpen(true)}>
        <h3 style={{marginTop: '0px'}}>{pronoStage.displayName}</h3>
        <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          {selectedTeams.map((team) => (
            <div key={team.key} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '10px'}}>
              <div className={classes.teamIcon}>
                <TeamIcon team={team} />
              </div>
              <div style={{marginLeft: '10px'}}>
                <TeamName team={team} def={''}/>
              </div>
            </div>
          ))}
        </div>
      </Paper>
      <StageTeamPronoSelectDialog open={editTeamsDialogOpen} setOpen={setEditTeamsDialogOpen} teams={teams} selectedTeams={selectedTeams} numberOfTeams={pronoStage.numberOfTeams} onSave={saveStageTeams} />
    </div>
  );
}


export function KnockoutStageTeamsProno(props) {
  const user = props.user;
  const teams = props.teams;
  const stageTeams = props.stageTeams;

  const pronoStages = [
    {key: '8', displayName: 'Kwartfinale', numberOfTeams: 8},
    {key: '4', displayName: 'Halve finale', numberOfTeams: 4},
    {key: '2', displayName: 'Finale', numberOfTeams: 2},
    {key: '1', displayName: 'Winnaar', numberOfTeams: 1},
  ]

  const getSelectedTeams = (stageTeams, stage) => {
    if(stageTeams[stage] !== undefined && stageTeams[stage].teams !== undefined){
      return stageTeams[stage].teams;
    }
    else{
      return []
    }
  }

  return (
    <div>
      {pronoStages.map((pronoStage) => (
        <KnockoutStageTeamsPronoStage user={user} pronoStage={pronoStage} selectedTeams={getSelectedTeams(stageTeams, pronoStage.key)} teams={teams} />
      ))}
    </div>
  );
}