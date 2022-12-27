import React, { useState, useContext } from 'react';
import { createStyles, makeStyles } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';

import { PronoContext } from './PronoProvider.js';
import { TeamIcon, TeamSelect, MatchSelect } from './MatchUtils.js';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
    stage: {
    },
    group: {
    },
    match: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    matchNumber: {
      display: 'flex',
      flexGrow: 2,
    },
    matchStage: {
      display: 'flex',
      flexGrow: 4,
    },
    matchDate: {
      display: 'flex',
      flexGrow: 4,
    },
    matchTeam: {
      display: 'flex',
      flexGrow: 4,
    },
    teamName: {
      display: 'flex',
      flexGrow: 2,
      marginLeft: '10px'
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    }
  })
);



function Match(props) {
  const match = props.match;
  const date = new Date(match.date);
  const deleteMatch = props.deleteMatch;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatDate = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? '0'+hours : hours;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes;
    return date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + "  " + strTime;
  }

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.match}>
        <div className={classes.matchNumber}>
          {match.number}
        </div>

        <div className={classes.matchDate}>
          {formatDate(date)}
        </div>

        <div className={classes.matchTeam}>
          {match.defaultteam1} - {match.defaultteam2}
        </div>
        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete match {match.number} from this group?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteMatch(match)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}

function Team(props){
  const team = props.team;
  const deleteTeam = props.deleteTeam;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const classes = useStyles();

 return (
    <div style={{height: '100%'}}>
      <div className={classes.team}>
        <div className={classes.teamIcon}>
          <TeamIcon team={team}/>
        </div>
        <div className={classes.teamName}>
          {team.name}
        </div>
        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
        </div>

      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to remove team {team.name} from this group?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteTeam(team)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )
}


function Group(props) {
  const group = props.group;
  const matches = props.matches;
  const teams = props.teams;

  const deleteGroup = props.deleteGroup;
  const updateGroup = props.updateGroup;
  const addMatch = props.addMatch;
  const deleteMatch = props.deleteMatch;
  const addTeam = props.addTeam;
  const deleteTeam = props.deleteTeam;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  let groupMatches = [];
  group.matches.forEach((key) => {
    const match = matches[key];
    if(match !== undefined){
      groupMatches.push(match);
    }
  })
  let groupTeams = [];
  group.teams.forEach((key) => {
    const team = teams[key];
    if(team !== undefined){
      groupTeams.push(team);
    }
  })

  const sortTeams = (a, b) => {
    if(a.name > b.name){
      return 1;
    }
    return -1;
  }

  const classes = useStyles();

  return (
    <div style={{height: '100%'}}>
      <div className={classes.group}>
        <TextField style={{width: '200px', marginLeft: '10px', marginRight: '10px'}}
          value={group.name} onChange={(event) => updateGroup(group, {name: event.target.value})} label="Group name"/>
        <div>
          <h4>Matches</h4>
          {groupMatches.map((match) => (
            <Paper key={match.key}  style={{padding: '5px', marginBottom: '5px'}}>
              <Match match={match} deleteMatch={deleteMatch} />
            </Paper>
          ))}
          <MatchSelect label="Add match" matches={Object.entries(matches).map(val => val[1])} selected={{key: -1}}
            onChange={(match) => {if(match.key !== -1){addMatch(match)}}}/>

        </div>

        <div>
          <h4>Teams</h4>
          {groupTeams.map((team) => (
            <Paper key={team.key}  style={{padding: '5px', marginBottom: '5px'}}>
              <Team team={team} deleteTeam={deleteTeam}/>
            </Paper>
          ))}
          <TeamSelect label="Add team" teams={Object.entries(teams).map(val => val[1]).sort(sortTeams)} selected={{key: -1}}
            onChange={(team) => {if(team.key !== -1){addTeam(team)}}}/>
        </div>

        <div style={{display: "flex", justifyContent: 'flex-end'}}>
          <Button variant="contained" onClick={() => setDeleteDialogOpen(true)}>Delete Group</Button>
        </div>
      </div>

      <Dialog onClose={() => setDeleteDialogOpen(false)} open={deleteDialogOpen}>
        <div style={{margin: "20px"}}>
          <div>Do you really want to delete group {group.name}?</div>
          <div style={{marginTop: "10px"}}>
            <Button onClick={() => deleteGroup(group)}>Delete</Button>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>

    </div>
  )

}


function ViewGroupstage(props) {

  const api = props.api;
  const prono = useContext(PronoContext);

  const groups = api.useGroupStage(prono);
  const matches = api.useMatches(prono);
  const teams = api.useTeams(prono);

  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  const updateGroup = (group, update) => {
    api.updateGroup(prono, group, update);
  }
  const deleteGroup = (group) => {
    api.deleteGroup(prono, group);
  }

  const addTeamFactory = (group) => {
    return (team) => api.groupAddTeam(prono, group, team.key);
  };
  const deleteTeamFactory = (group) => {
    return (team) => api.groupDeleteTeam(prono, group, team.key);
  };

  const addMatchFactory = (group) => {
    return (match) => api.groupAddMatch(prono, group, match.key);
  };
  const deleteMatchFactory = (group) => {
    return (match) => api.groupDeleteMatch(prono, group, match.key);
  };

  const addGroup = () => {
    const group = {
      name: groupNames[groups.length],
      matches: {},
      points: {},
      teams: {}
    }
    api.addGroup(prono, group);
  }

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Group stage</h2>
      <div>
        {groups.map((group) => (
          <Paper key={group.key}  style={{padding: '5px', marginBottom: '5px'}}>
            <Group key={group.key} group={group} matches={matches} teams={teams} deleteGroup={deleteGroup} updateGroup={updateGroup}
              addMatch={addMatchFactory(group)} deleteMatch={deleteMatchFactory(group)} addTeam={addTeamFactory(group)} deleteTeam={deleteTeamFactory(group)}/>
          </Paper>
        ))}
        <Button variant="contained" onClick={() => addGroup()}>Add group</Button>
      </div>
    </div>
  );

}

export default ViewGroupstage;
