import React, { useState, useContext, useEffect } from 'react';
import { createStyles, makeStyles } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { PronoContext } from '../PronoProvider.js';
import { TeamName, TeamIcon } from '../MatchUtils.js';
import { Disabled } from './PronoUtils.js';


const useStyles = makeStyles((theme) =>
  createStyles({
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    }
  })
);


function StageTeamPronoSelectDialog(props){
  const numberOfTeams = props.numberOfTeams;
  const teams = props.teams;
  const oldSelectedTeams = props.selectedTeams;
  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave

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
        if(val.team.key === team.team.key){

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
  const currentStage = props.currentStage;
  const pronoStage = props.pronoStage;
  const selectedTeams = props.selectedTeams;
  const teams = props.teams;
  const api = props.api;

  const [editTeamsDialogOpen, setEditTeamsDialogOpen] = useState(false)

  const prono = useContext(PronoContext);

  const saveStageTeams = (selectedTeams) => {
    api.updateStageTeamsProno(prono, user, pronoStage, selectedTeams)
  }

  const editable = (currentStage === 'groupstage' || user.permissions.editDisabledProno);

  const classes = useStyles();

  return (
    <div>
      <Paper key={pronoStage.stage} style={{padding: '10px', marginBottom: '10px', position: 'relative'}}>
        <div onClick={() => setEditTeamsDialogOpen(true)}>
          <h3 style={{marginTop: '0px'}}>{pronoStage.displayName}</h3>
          <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
            {selectedTeams.map((team) => (
              <div key={team.key} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '10px', flexGrow: 1, width: '125px'}}>
                <div className={classes.teamIcon}>
                  <TeamIcon team={team} />
                </div>
                <div style={{marginLeft: '10px'}}>
                  <TeamName team={team} def={''}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Disabled disabled={!editable}/>
      </Paper>

      <StageTeamPronoSelectDialog open={editTeamsDialogOpen} setOpen={setEditTeamsDialogOpen} teams={teams} selectedTeams={selectedTeams}
        numberOfTeams={pronoStage.numberOfTeams} onSave={saveStageTeams} />
    </div>
  );
}

export const pronoStages = [
  {key: '8', displayName: 'Kwartfinale', numberOfTeams: 8},
  {key: '4', displayName: 'Halve finale', numberOfTeams: 4},
  {key: '2', displayName: 'Finale', numberOfTeams: 2},
  {key: '1', displayName: 'Winnaar', numberOfTeams: 1},
]

export function KnockoutStageTeamsProno(props) {
  const user = props.user;
  const currentStage = props.currentStage;
  const teams = props.teams;
  const stageTeams = props.stageTeams;



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
        <KnockoutStageTeamsPronoStage key={pronoStage.key} user={user} pronoStage={pronoStage}
          selectedTeams={getSelectedTeams(stageTeams, pronoStage.key)} teams={teams} currentStage={currentStage}/>
      ))}
    </div>
  );
}