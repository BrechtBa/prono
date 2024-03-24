import React, { useState, useContext } from 'react';

import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { UserContext } from "./UserProvider.js";
import { PronoContext } from './PronoProvider.js';
import { SquadContext } from './SquadProvider.js';


const getPoints = (user) => {
  if(user.showPoints && user.points !== undefined){
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


function RankingUser(props){

  const ranking = props.ranking;
  const rankingUser = props.user;
  const authUser = props.authUser;

  const [dialogOpen, setDialogOpen] = useState(false)

  const getFirstLetter = (user) => {
    if(user.displayName !== undefined){
      return user.displayName.substring(0, 1)
    }
    return '';
  }

  const getRankingUserPointsDetail = (user) => {
    if(user.points !== undefined){
      return pointDetailKeys.map((val) => {
        return {key: val.key, displayName: val.displayName, points: user.points[val.key] || 0}
      });
    }
    else{
      return [];
    }
  }

  return (
    <div style={{marginBottom: '5px'}}>

      <Paper style={{padding: '10px', marginLeft: (rankingUser.key === authUser.key ? '10px' : 0)}} onClick={() => setDialogOpen(true)}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{width: '30px', fontWeight: 600}}>{ranking}</div>
          <Avatar alt={rankingUser.displayName} src={rankingUser.profilePicture} style={{height: '50px', width: '50px', marginRight: '20px'}}>{getFirstLetter(rankingUser)}</Avatar>
          <div style={{flexGrow: 2, width: '120px'}}>{rankingUser.displayName}</div>
          <div>{getPoints(rankingUser)}</div>
         </div>
      </Paper>

      <Dialog onClose={() => setDialogOpen(false)} open={dialogOpen}>
        {authUser.showPoints ? (
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
            Score nog niet vrijgegeven
          </div>
        )}
      </Dialog>

    </div>
  )

}


function ViewRanking(props) {
  const api = props.api;
  const authUser = useContext(UserContext);
  const {squad, setSquad} = useContext(SquadContext);

  const prono = useContext(PronoContext);
  
  const users = api.useSquadUsers(prono, squad);

  const getRankedUsers = (users) => {
    let sortedUsers = JSON.parse(JSON.stringify(users.sort((a, b) => getPoints(b) - getPoints(a))));
    let rank = 1;
    let skip = 1;
    let points = -1;
    sortedUsers.forEach((user) => {
      const userPoints = getPoints(user);
      if(userPoints < points){
        rank += skip;
        skip = 1;
      }
      else if(userPoints === points){
        skip += 1;
      }
      points = userPoints;
      user.rank = rank;
    })

    return sortedUsers;
  }

  const theme = useTheme();

  return (
    <div>
      <h2 style={{color: theme.palette.text.headers}}>Rangschikking</h2>

      {getRankedUsers(users).map((user) => (
        <RankingUser key={user.key} user={user} authUser={authUser} ranking={user.rank}/>
      ))}

    </div>
  );

}

export default ViewRanking;
