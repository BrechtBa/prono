import React, { useState, useEffect, useContext } from 'react';

import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { PronoContext } from '../PronoProvider.js';
import { Disabled } from './PronoUtils.js';
import { TeamName, TeamIcon, TeamSelect, EditScoreDialog } from '../MatchUtils.js';


function calculateGroupStagePoints(teams, matches) {

  const points = teams.reduce((o, team) => ({ ...o, [team.key]: 0}), {})
  const goalSaldo = teams.reduce((o, team) => ({ ...o, [team.key]: 0}), {})
  const goalsScored = teams.reduce((o, team) => ({ ...o, [team.key]: 0}), {})

  matches.forEach( (match) => {
    if (match.score1 >= 0 && match.score2 >= 0) {
      if ( match.score1 > match.score2){
        points[match.team1.key] += 3;
      }
      else if ( match.score2 > match.score1){
        points[match.team2.key] += 3;
      }
      else {
        points[match.team1.key] += 1;
        points[match.team2.key] += 1;
      }
      goalSaldo[match.team1.key] += match.score1 - match.score2
      points[match.team1.key] += (match.score1 - match.score2) * 0.01
      goalSaldo[match.team2.key] += match.score2 - match.score1
      points[match.team2.key] += (match.score2 - match.score1) * 0.01

      goalsScored[match.team1.key] += match.score1
      points[match.team1.key] += match.score1 * 0.0001
      goalsScored[match.team2.key] += match.score2
      points[match.team2.key] += match.score2 * 0.0001

    }
  });

  return points
}



export function Match(props) {
  const match = props.match;
  const onSave = props.onSave;
  const editable = props.editable;
  const editTeams = props.editTeams;
  const teams = props.teams;

  const [editScoreDialogOpen, setEditScoreDialogOpen] = useState(false)

  const formatScore = (score) => {
    if(score >= 0){
      return score
    }
    else{
      return ''
    }
  }

  const styles = {
    team: {
      display: 'flex', 
      flexGrow: 4,
      width: '90px',  
      overflow: 'hidden'
    },
    teamIcon: {
      maxWidth: '30px', 
      maxHeight: '30px'
    },
    score: {
      width: '60px',
      display:'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    scoreRegular: {}
  }

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}} onClick={() => editable && setEditScoreDialogOpen(true)}>
        <div style={{...styles.team, justifyContent: 'flex-start', textAlign: 'left'}}>
          <TeamName team={match.team1} def={match.defaultteam1} />
        </div>
        <div style={styles.teamIcon}>
            <TeamIcon team={match.team1} />
        </div>
        <div style={styles.score}>
          <div style={styles.scoreRegular}>{formatScore(match.score1)} - {formatScore(match.score2)}</div>
        </div>
        <div style={styles.teamIcon}>
            <TeamIcon team={match.team2} />
        </div>
        <div style={{...styles.team, justifyContent: 'flex-end', textAlign: 'right'}}>
            <TeamName team={match.team2} def={match.defaultteam2} />
        </div>
      </div>

      <EditScoreDialog match={match} open={editScoreDialogOpen} setOpen={setEditScoreDialogOpen} onSave={onSave} editPenalties={false}
        editTeams={editTeams} teams={teams}/>
    </div>
  )
}

function GroupPointsDialog(props) {
  const group = props.group;

  const open = props.open;
  const setOpen = props.setOpen;
  const onSave = props.onSave;

  const [teams, setTeams] = useState([])

  useEffect(() => {

    const newTeams = JSON.parse(JSON.stringify(group.teams))
    const calculatedTeamPoints = calculateGroupStagePoints(newTeams, group.matches);

    newTeams.forEach((team) => {
      team.points = calculatedTeamPoints[team.key];
    });

    setTeams(newTeams);
  }, [group]);

  const handleSave = () => {
    onSave(teams)
    setOpen(false)
  }

  const handlePointsChange = (team, event) => {
    let newTeams = JSON.parse(JSON.stringify(teams));
    newTeams.forEach((t) => {
      if(t.key === team.key){
        t.points = event.target.value;
        setTeams(newTeams);
        return false;
      }
    });
  }

  const styles = {
    team: {
      display: 'flex', 
      flexGrow: 4,
      width: '90px',  
      overflow: 'hidden'
    },
    teamIcon: {
      maxWidth: '30px', 
      maxHeight: '30px'
    },
  }

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <form>
        <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
          <div>
            {teams.map((team) => (
              <div key={team.key} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                <div styles={styles.teamIcon}>
                  <TeamIcon team={team} />
                </div>
                <div styles={styles.team} style={{marginLeft: '15px'}}>
                  <TeamName team={team}/>
                </div>
                <div style={{width: '50px'}}>
                  <TextField value={team.points} onChange={(e) => handlePointsChange(team, e)}/>
                </div>
              </div>
            ))}
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

function GroupStageGroup(props) {
  const group = props.group;
  const editable = props.editable;
  const editTeams = props.editTeams;
  const api = props.api;

  const [groupPointsDialogOpen, setGroupPointsDialogOpen] = useState(false)

  const prono = useContext(PronoContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2, team1, team2) => {
    api.updateMatch(prono, match, {score1: score1, score2: score2, penalty1: penalty1, penalty2: penalty2, team1: team1, team2: team2})
  }
  const saveGroupPoints = (teams) => {
    api.updateGroupPoints(prono, group, teams)
  }

  const styles = {
    group: {
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      margin: '5px'
    },
    team: {
      display: 'flex', 
      flexGrow: 4,
      width: '90px',  
      overflow: 'hidden',
      marginLeft: '15px'
    },
    teamIcon: {
      maxWidth: '30px', 
      maxHeight: '30px'
    }
  }
  return (
    <div style={{position: 'relative',  width: '100%', maxWidth: '400px', margin: '5px'}}>
      <Paper key={group.key} style={styles.group}>
        <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

        <div>
          {group.matches.map((match) => (
           <Match key={match.key} match={match} onSave={saveMatch} editable={editable} editTeams={editTeams} teams={group.teams}/>
          ))}
        </div>

        <div style={{marginTop: '10px'}} onClick={() => editable && setGroupPointsDialogOpen(true)}>
          {group.teams.sort((a, b) => b.points-a.points).map((team) => (
            <div key={team.key} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
              <div style={styles.teamIcon}>
                <TeamIcon team={team} />
              </div>
              <div style={styles.team}>
                <TeamName team={team}/>
              </div>
              <div style={{width: '50px'}}>{Math.round(team.points)}</div>
            </div>
          ))}
        </div>
      </Paper>

      <GroupPointsDialog open={groupPointsDialogOpen} group={group} setOpen={setGroupPointsDialogOpen} onSave={saveGroupPoints}/>
    </div>
  );
}


export function GroupStage(props) {
  const api = props.api;
  const groups = props.groups;
  const editable = props.editable;
  const editTeams = props.editable;

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <GroupStageGroup key={group.key} group={group} editable={editable} editTeams={editTeams} api={api}/>
      ))}
    </div>
  );
};


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
  const api = props.api;
  const currentStage = props.currentStage;
  const group = props.group;
  const user = props.user;

  const [groupwinnersDialogOpen, setGroupwinnersDialogOpen] = useState(false)

  const prono = useContext(PronoContext);

  const saveMatch = (match, score1, score2, penalty1, penalty2) => {
    api.updateMatchProno(prono, user, match, {score1: score1, score2: score2})
  }
  const saveGroupwinners = (groupwinners) => {
    api.updateGroupWinnersProno(prono, user, group, groupwinners)
  }

  const editable = (currentStage === 'groupstage' || user.permissions.editDisabledProno);
  const styles = {
    group: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      padding: '10px',
      margin: '5px'
    },
    team: {
      display: 'flex', 
      flexGrow: 4,
      width: '90px',  
      overflow: 'hidden',
      marginLeft: '15px'
    },
    teamIcon: {
      maxWidth: '30px', 
      maxHeight: '30px'
    }
  }

  return (
    <div style={{position: 'relative',  width: '100%', maxWidth: '400px', margin: '5px'}}>
      <Paper style={styles.group}>
        <h3 style={{marginTop: 0}}>Groep {group.name}</h3>

        <div>
          {group.matches.map((match) => (
           <Match key={match.key} match={match} onSave={saveMatch} showPenaltyEdit={false} editable={editable} editTeams={false}/>
          ))}
        </div>

        <div style={{marginTop: '20px'}} onClick={() => setGroupwinnersDialogOpen(true)}>
          <div style={{height: '36px', display: 'flex', alignItems: 'center'}}>
            <div style={{width: '30%'}}>Winnaar: </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <div style={styles.teamIcon}>
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
              <div style={styles.teamIcon}>
                <TeamIcon team={group.winners[2]}/>
              </div>
              <div style={{marginLeft: '20px'}}>
                <TeamName team={group.winners[2]} def=""/>
              </div>
            </div>
          </div>
        </div>

        <Disabled disabled={!editable}/>
      </Paper>
      <GroupwinnersDialog open={groupwinnersDialogOpen} group={group} setOpen={setGroupwinnersDialogOpen} onSave={saveGroupwinners}/>
    </div>
  )
}

export function GroupstageProno(props) {
  const groups = props.groups;
  const user = props.user;
  const currentStage = props.currentStage;

  return (
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {groups.map((group) => (
        <GroupstagePronoGroup key={group.key} group={group} user={user} currentStage={currentStage}/>
      ))}
    </div>
  );
};

