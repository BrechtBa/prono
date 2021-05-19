import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

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
      flexDirection: 'row',
      alignItems: 'center'
    },
    team1: {
      display: 'flex',
      flexGrow: 4,
      justifyContent: 'flex-start',
      width: '110px',
      textAlign: 'left',
    },
    team2: {
      display: 'flex',
      flexGrow: 4,
      justifyContent: 'flex-end',
      width: '110px',
      textAlign: 'right'
    },
    teamIcon: {
      maxWidth: '30px', maxHeight: '30px'
    },
    score: {
      width: '60px',
      display:'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    scoreRegular: {
    },
    scorePenalty: {
    }

  })
);


export function Match(props) {
  const match = props.match;
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

  const classes = useStyles();

  return (
    <div>
      <div className={classes.match} onClick={() => setEditScoreDialogOpen(true)}>
        <div className={classes.team1}>
          <TeamName team={match.team1} def={match.defaultteam1} />
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team1} />
        </div>
        <div className={classes.score}>
          <div className={classes.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>
        </div>
        <div className={classes.teamIcon}>
            <TeamIcon team={match.team2} />
        </div>
        <div className={classes.team2}>
            <TeamName team={match.team2} def={match.defaultteam2} />
        </div>
      </div>

      <EditScoreDialog match={match} open={editScoreDialogOpen} setOpen={setEditScoreDialogOpen} onSave={onSave} showPenaltyEdit={false}/>
    </div>
  )
}


export function GroupStage(props) {
  const groups = props.groups;

  const api = useContext(APIContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatch(match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2})
  }

  const classes = useStyles();

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <Paper key={group.key} className={classes.group}>
          <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

          <div>
            {group.matches.map((match) => (
             <Match key={match.key} match={match} onSave={saveMatch}/>
            ))}
          </div>

          <div style={{marginTop: '10px'}}>
            {group.teams.map((team) => (
              <div key={team.key} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                <div className={classes.teamIcon}>
                  <TeamIcon team={team} />
                </div>
                <div className={classes.team1} style={{marginLeft: '15px'}}>
                  <TeamName className={classes.TeamName} team={team}/>
                </div>
                <div style={{width: '50px'}}>{Math.floor(team.points)}</div>
              </div>
            ))}
          </div>

        </Paper>
      ))}

    </div>
  );
};


function TeamSelect(props){
  const label = props.label;
  const teams = props.teams;
  const selected = props.selected;
  const onSelect = props.onChange

  const handleChange = (e) => {
    const key = e.target.value;
    if (key !== -1){
      const teamsKeys = teams.map((team) => team.key)
      const ind = teamsKeys.indexOf(key)
      if(ind >= 0){
        onSelect(teams[ind]);
      }
      else{
        onSelect({key: -1})
      }
    }
    else{
      onSelect({key: -1})
    }
  }

  const classes = useStyles();

  return (
    <div style={{width: '100%', marginBottom: '20px'}}>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select value={selected.key} onChange={handleChange} labelId="select-label" style={{width: '100%'}}>
        <MenuItem value={-1}></MenuItem>

        {teams.map((team) => (
          <MenuItem key={team.key} value={team.key}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className={classes.teamIcon}>
                <TeamIcon team={team}/>
              </div>
              <div style={{marginLeft: '20px'}}>
                <TeamName team={team} def=""/>
              </div>
            </div>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}


function GroupwinnersDialog(props) {
  const group = props.group;

  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave;

  const [groupwinner, setGroupwinner] = useState(-1)
  const [groupsecond, setGroupsecond] = useState(-1)

  useEffect(() => {
    setGroupwinner(group.winners[1])
    setGroupsecond(group.winners[2])
  }, [group]);


  const handleSave = () => {
    onSave({1: groupwinner, 2: groupsecond})
    setOpen(false)
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <form>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
          <div>
            <TeamSelect label={'Groepswinnaar'} teams={group.teams} selected={groupwinner} onChange={(t) => setGroupwinner(t)} />
            <TeamSelect label={'Groepstweede'} teams={group.teams} selected={groupsecond} onChange={(t) => setGroupsecond(t)} />
          </div>

          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
            <Button onClick={() => handleSave()}>save</Button>
            <Button onClick={() => setOpen(false)}>cancel</Button>
          </div>
        </div>
      </form>
    </Dialog>
  )

}


function GroupstagePronoGroup(props) {
  const group = props.group;
  const user = props.user;

  const [groupwinnersDialogOpen, setGroupwinnersDialogOpen] = useState(false)


  const api = useContext(APIContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatchProno(user, match, {score1: score1, score2: score2})
  }
  const saveGroupwinners = (groupwinners) => {
    api.updateGroupWinnersProno(user, group, groupwinners)
  }

  const classes = useStyles();

  return (
    <div style={{position: 'relative',  width: '100%', maxWidth: '400px', margin: '5px'}}>
      <Paper className={classes.group}>
        <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

        <div>
          {group.matches.map((match) => (
           <Match key={match.key} match={match} onSave={saveMatch} showPenaltyEdit={false}/>
          ))}
        </div>

        <div style={{marginTop: '20px'}} onClick={() => setGroupwinnersDialogOpen(true)}>
          <div style={{height: '36px', display: 'flex', alignItems: 'center'}}>
            <div style={{width: '30%'}}>Winnaar: </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className={classes.teamIcon}>
                <TeamIcon team={group.winners[1]}/>
              </div>
              <div style={{marginLeft: '20px'}}>
                <TeamName team={group.winners[1]} def=""/>
              </div>
            </div>
          </div>
          <div style={{height: '36px', display: 'flex', alignItems: 'center'}}>
            <div style={{width: '30%'}}>Tweede: </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div className={classes.teamIcon}>
                <TeamIcon team={group.winners[2]}/>
              </div>
              <div style={{marginLeft: '20px'}}>
                <TeamName team={group.winners[2]} def=""/>
              </div>
            </div>
          </div>
        </div>

        <Disabled disabled={false}/>
      </Paper>
      <GroupwinnersDialog open={groupwinnersDialogOpen} group={group} setOpen={setGroupwinnersDialogOpen} onSave={saveGroupwinners}/>
    </div>
  )
}

export function GroupstageProno(props) {
  const groups = props.groups;
  const user = props.user;

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <GroupstagePronoGroup key={group.key} group={group} user={user} />
      ))}
    </div>
  );
};

