import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import { UserContext } from "./UserProvider.js";
import APIContext from './APIProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
  })
);


const getPoints = (user) => {
  if(user.paid && user.points !== undefined){
    return Object.keys(user.points).map((key) => user.points[key]).reduce((a, b) => a + b, 0)
  }
  else{
    return 0;
  }
}

const pointDetailKeys = [
  {key: 'groupstage', displayName: 'Groepsfase'},
  {key: 'groupwinners', displayName: 'Groepswinnaars'},
  {key: 'knockoutstage', displayName: 'Knockout fase'},
  {key: 'knockoutstageteams', displayName: 'Knockout fase teams'},
  {key: 'hometeamresult', displayName: 'Thuisploeg resultaat'},
  {key: 'totalgoals', displayName: 'Totaal aantal goals'},
]


function User(props){


  const ranking = props.ranking;
  const rankingUser = props.user;

  const user = useContext(UserContext);

  const [dialogOpen, setDialogOpen] = useState(false)

  const getFirstLetter = (user) => {
    if(user.displayName !== undefined){
      return user.displayName.substring(0, 1)
    }
    return '';
  }

  const getRankingUserPointsDetail = (user) => {
    return pointDetailKeys.map((val) => {
      return {key: val.key, displayName: val.displayName, points: user.points[val.key] || 0}
    });
  }

  return (
    <div style={{marginBottom: '5px'}}>
      <Paper style={{padding: '10px', marginLeft: (rankingUser.key === user.key ? '10px' : 0)}} onClick={() => setDialogOpen(true)}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '30px', fontWeight: 600}}>{ranking}</div>
          <Avatar alt={rankingUser.displayName} src={rankingUser.profilePicture} style={{height: '50px', width: '50px', marginRight: '20px'}}>{getFirstLetter(rankingUser)}</Avatar>
          <div style={{flexGrow: 2, width: '120px'}}>{rankingUser.displayName}</div>
          <div>{getPoints(rankingUser)}</div>
         </div>
      </Paper>
      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        {user.paid ? (
          <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
            {getRankingUserPointsDetail(rankingUser).map((val) => (
              <div key={val.key} style={{display: 'flex'}}>
                <div style={{width: '180px'}}>{val.displayName}</div>
                <div style={{width: '40px'}}>{val.points}</div>
              </div>
            ))}
            <Divider style={{marginTop: '10px', marginBottom: '10px'}}/>
            <div style={{display: 'flex'}}>
              <div style={{width: '180px'}}>Totaal</div>
              <div style={{width: '40px'}}>{getPoints(rankingUser)}</div>
            </div>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', padding: '20px'}}>
            Eerst betalen aub.
          </div>
        )}
      </Dialog>
    </div>
  )

}


function ViewRanking(props) {

  const api = useContext(APIContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.onUsersChanged(users => {
      setUsers(users);
      console.log(users)
    });
  }, [api]);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h2 style={{color: '#ffffff'}}>Rangschikking</h2>

      {users.sort((a, b) => getPoints(b) - getPoints(a)).map((user, index) => (
        <User key={user.key} user={user} ranking={index+1}/>
      ))}

    </div>
  );

}

export default ViewRanking;
