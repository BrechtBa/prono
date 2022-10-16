import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import { TeamIcon } from './MatchUtils.js';

import APIContext from './APIProvider.js';
import { PronoContext } from './PronoProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    }
  })
);



function Team(props) {
  const index = props.index;
  const team = props.team;

  const updateTeam = props.updateTeam;
  const deleteTeam = props.deleteTeam;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.team}>
        <div className={classes.teamNumber}>
          {index}
        </div>
        <div className={classes.teamIcon}>
          <TeamIcon team={team}/>
        </div>
        <div className={classes.teamName}>
          <TextField style={{width: '150px', marginLeft: '10px', marginRight: '10px'}}
           value={team.name} onChange={(event) => updateTeam(team, {name: event.target.value})} label="Name"/>
        </div>
        <div className={classes.teamName}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}}
           value={team.abbreviation} onChange={(event) => updateTeam(team, {abbreviation: event.target.value})}  label="Abbreviation"/>
        </div>
        <div className={classes.teamName}>
          <TextField style={{width: '80px', marginLeft: '10px', marginRight: '10px'}}
           value={team.iso_icon} onChange={(event) => updateTeam(team, {iso_icon: event.target.value})} label="ISO icon"/>
        </div>
        <div className={classes.teamName}>
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

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [teams, setTeams] = useState([]);

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

  useEffect(() => {
    api.onTeamsChanged(prono, teams => {
      setTeams(Object.entries(teams).map(val => val[1]));
    });
  }, [api, prono]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
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
