import React, { useState, useEffect, useContext } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import APIContext from './APIProvider.js';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);


function ViewRanking(props) {

  const groups = [{
    key: 'A',
    title: 'A',
    matches: [{
      key: 1,
      team1: {name: 'Belgie', abbreviation: 'BEL', icon: 'images/flags/BE.png'},
      team2: {name: 'Rusland', abbreviation: 'RUS', icon: 'images/flags/BE.png'},
      score1: 5,
      score2: 1,
    }, {
      key: 2,
      team1: {name: 'Noord-Macedonië', abbreviation: 'BEL', icon: 'images/flags/BH.png'},
      team2: {name: 'Zwitserland', abbreviation: 'RUS', icon: 'images/flags/CH.png'},
      score1: -1,
      score2: -1,
    }]
  }, {
    key: 'B',
    title: 'B',
    matches: [{
      key: 3,
      team1: {name: 'Denemarken', abbreviation: 'BEL', icon: 'images/flags/DE.png'},
      team2: {name: 'Rusland', abbreviation: 'RUS', icon: 'images/flags/RU.png'},
      score1: -1,
      score2: -1,
    }, {
      key: 4,
      team1: {name: 'Belgie', abbreviation: 'BEL', icon: 'images/flags/BE.png'},
      team2: {name: 'Wales', abbreviation: 'RUS', icon: 'images/flags/_wales.png'},
      score1: -1,
      score2: -1,
    }]
  }]


  const api = useContext(APIContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.onUsersChanged(users => {
      setUsers(users);
      console.log(users)
    });
  }, []);

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Rangschikking</h2>

      {users.map((user, index) => {
        return (<div key={user.key}>{user.displayName}</div>)

      })}
    </div>
  );

}

export default ViewRanking;
