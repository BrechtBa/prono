import React, { useState, useContext } from 'react';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import { TeamIcon } from './MatchUtils.js';

import { PronoContext } from './PronoProvider.js';


const styles = {
  root: {},
  team: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  teamNumber: {
    marginRight: '10px'
  },
  teamName: {
    display: 'flex',
    flexGrow: 2,
    marginTop: "0.5em"
  },
  teamIcon: {
    maxWidth: '30px', maxHeight: '30px'
  }
}


function Team(props) {
  const index = props.index;
  const team = props.team;

  const updateTeam = props.updateTeam;
  const deleteTeam = props.deleteTeam;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <div style={{height: '100%'}}>
      <div style={styles.team}>
        <div style={styles.teamNumber}>
          {index}
        </div>
        <div style={styles.teamIcon}>
          <TeamIcon team={team}/>
        </div>
        <div style={styles.teamName}>
          <TextField style={{width: '200px', marginLeft: '10px', marginRight: '10px'}}
           value={team.name} onChange={(event) => updateTeam(team, {name: event.target.value})} label="Name"/>
        </div>
        <div style={styles.teamName}>
          <TextField style={{width: '100px', marginLeft: '10px', marginRight: '10px'}}
           value={team.abbreviation} onChange={(event) => updateTeam(team, {abbreviation: event.target.value})}  label="Abbreviation"/>
        </div>
        <div style={styles.teamName}>
          <TextField style={{width: '100px', marginLeft: '10px', marginRight: '10px'}}
           value={team.iso_icon} onChange={(event) => updateTeam(team, {iso_icon: event.target.value})} label="ISO icon"/>
        </div>
        <div style={styles.teamName}>
          <TextField style={{width: '200px', marginLeft: '10px', marginRight: '10px'}}
           value={team.icon} onChange={(event) => updateTeam(team, {icon: event.target.value})} label="Icon"/>
        </div>
        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete team {team.name}?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteTeam(team)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}


function ViewTeams(props) {
  const api = props.api;
  const prono = useContext(PronoContext);

  const teamsObject = api.useTeams(prono);
  // convert to list
  const teams = Object.entries(teamsObject).map(val => val[1]);

  const updateTeam = (team, update) => {
    api.updateTeam(prono, team, update);
  }

  const deleteTeam = (team) => {
    api.deleteTeam(prono, team);
  }

  const addTeam = () => {
    const team = {
      name: 'new team',
      abs: 'ABR',
      iso_icon: 'BE'
    }
    api.addTeam(prono, team);
  }

  return (
    <div style={styles.root}>
      <h2 style={{color: '#ffffff'}}>Teams</h2>
      <div>
        {teams.map((team, index) => (
           <Paper key={team.key} style={{padding: '5px', marginBottom: '5px'}}>
            <Team team={team} index={index + 1} updateTeam={updateTeam} deleteTeam={deleteTeam}/>
          </Paper>
        ))}
        <Button variant="contained" onClick={() => addTeam()}>Add team</Button>
      </div>
    </div>
  );

}

export default ViewTeams;
