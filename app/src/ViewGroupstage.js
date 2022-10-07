import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';

import APIContext from './APIProvider.js';
import PronoContext from './PronoProvider.js';


const useStyles = makeStyles((theme: Theme) =>
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
      justifyContent: 'flex-start',
      width: '90px',
      textAlign: 'left',
      overflow: 'hidden'
    }
  })
);



function Match(props) {
  const match = props.match;
  const date = new Date(match.date);

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

        <div className={classes.team}>
          {match.defaultteam1}
        </div>
        <div>-</div>
        <div className={classes.matchTeam}>
          {match.defaultteam2}
        </div>
      </div>
    </div>
  )
}

function Group(props) {
  const group = props.group;
  const matches = props.matches;
  const deleteGroup = props.deleteGroup;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const classes = useStyles();
  const groupMatches = []
  group.matches.forEach((key) => {
    const match = matches[key];
    if(match !== undefined){
      groupMatches.push(match);
    }
  })
  console.log(groupMatches)

  return (
    <div style={{height: '100%'}}>
      <div className={classes.group}>
        <h4 style={{color: '#ffffff'}}>Group {group.name}</h4>

        {groupMatches.map((match) => (
          <Paper key={match.key}  style={{padding: '5px', height: '50px', marginBottom: '5px', overflowX: 'hidden'}}>
            <Match match={match}/>
          </Paper>
        ))}
        <div>
          <Button onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
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

  const api = useContext(APIContext);
  const prono = useContext(PronoContext);

  const [groups, setGroups] = useState([]);
  const [matches, setMatches] = useState({});

  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  const updateGroup = (group, update) => {
//    api.updateGroup(prono, group, update);
  }

  const deleteGroup = (group) => {
    api.deleteGroup(prono, group);
  }

  const addGroup = () => {
    const group = {
      name: groupNames[groups.length + 1],
      matches: {},
      points: {},
      teams: {}
    }
    api.addGroup(prono, group);
  }

  useEffect(() => {
    api.onGroupstageChanged(prono, groups => {
      setGroups(groups);
    });
  }, [api, prono]);

  useEffect(() => {
    api.onMatchesChanged(prono, matches => {
      setMatches(matches);
    });
  }, [api, prono]);

 // https://codesandbox.io/s/i0ex5?file=/src/App.js:2392-2441

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Group stage</h2>
      <div>
        {groups.map((group) => (
          <Group key={group.key} group={group} matches={matches} deleteGroup={deleteGroup}/>
        ))}
        <Button onClick={() => addGroup()}>Add group</Button>
      </div>
    </div>
  );

}

export default ViewGroupstage;
