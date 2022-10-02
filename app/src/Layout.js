import React, { useState, useContext } from 'react';
import { UserContext } from "./UserProvider.js";
import PronoContext from './PronoProvider.js';
import { Switch, Route, Link, useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { signOut } from "./UserProvider.js";

import ViewRanking from './ViewRanking.js';
import ViewProno from './ViewProno.js';
import ViewResults from './ViewResults.js';
import ViewRules from './ViewRules.js';
import ViewLogin from './ViewLogin.js';
import ViewProfile from './ViewProfile.js';
import ViewSettings from './ViewSettings.js';
import ViewUsers from './ViewUsers.js';

import Version from './Version.js';

const drawerWidth = 280;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100%',
      background: theme.palette.background.gradient,
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },

    drawerPaper: {
      width: drawerWidth,
    },

    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },

    user: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.headers,
      cursor: 'pointer',
    },

    navigationItem: {
      textDecoration: 'none',
      color: theme.palette.primary.contrastText,
      width: 'auto',
    },

    version: {
      marginLeft: '10px',
      marginTop: '30px'
    },
  }),


);


function User(props) {
  const user = props.user

  const classes = useStyles();

  return (
    <div className={classes.user}>
      <div style={{display: 'flex', justifyContent:'center', paddingTop: '10px'}}>
        <Avatar alt={user.displayName} src={user.profilePicture} style={{width: '120px', height: '120px'}}/>
      </div>
      <div style={{padding: '10px'}}>
        <div>{user.displayName}</div>
        <div>{user.email}</div>
      </div>
    </div>
  );
}


function Navigation(props) {

  const isAdmin = props.isAdmin;
  const onNavigation = props.onNavigation;

  const links = [{
    title: 'Rangschikking',
    path: 'ranking'
  }, {
    title: 'Prono',
    path: 'prono'
  }, {
    title: 'Resultaten',
    path: 'results'
  }, {
    title: 'Regels',
    path: 'rules'
  }]

  const adminLinks = [{
    title: 'Users',
    path: 'users'
  }, {
    title: 'Settings',
    path: 'settings'
  }, {
    title: 'Teams',
    path: 'teams'
  }, {
    title: 'Matches',
    path: 'matches'
  }, {
    title: 'Groupstage',
    path: 'groupstage'
  }, {
    title: 'Knockoutstage',
    path: 'kockoutstage'
  }]
  const classes = useStyles();

  const navigationItem = (link, index) => {
    return (
      <Link key={index} to={link.path} className={classes.navigationItem} onClick={onNavigation()}>
        <ListItem button key={link.title}>
          <ListItemText primary={link.title} />
        </ListItem>
      </Link>
    );
  }

  return (
    <div>
      <List>
        {links.map((link, index) => navigationItem(link, index))}
      </List>

      <Divider/>
      {isAdmin &&
        adminLinks.map((link, index) => navigationItem(link, index))
      }
      {isAdmin &&
        <Divider/>
      }
    </div>
  );
}


function PronoLayout(props) {

  const user = useContext(UserContext);

  const history = useHistory();
  const classes = useStyles();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [prono, setProno] = useState('ek2021');

  const toggleNavigation = (open) => (event) => {
    if(open === undefined){
      setNavigationOpen(!navigationOpen);
    }
    else{
      setNavigationOpen(open);
    }
  }

  const showProfilePage = (history) => {
    setNavigationOpen(false);
    history.push('/profile');
  }

  if(user !== null){
    return (
        <div className={classes.root}>
          <CssBaseline />
          <PronoContext.Provider value={prono}>

            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar style={{display: "flex", paddingRight: "12px"}}>

                  <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleNavigation()}>
                    <MenuIcon/>
                  </IconButton>

                <Typography variant="h6" style={{flexGrow: 1}}  noWrap>
                    Prono
                </Typography>
              </Toolbar>
            </AppBar>

            <SwipeableDrawer anchor="left" className={classes.drawer} classes={{paper: classes.drawerPaper}}
             open={navigationOpen} onClose={toggleNavigation(false)} onOpen={toggleNavigation(true)}>
              <div onClick={(e) => showProfilePage(history)}>
                <User user={user}/>
              </div>
              <Navigation isAdmin={user.permissions.admin} onNavigation={toggleNavigation}/>

              <ListItem button>
                <ListItemText primary={"Sign out"} onClick={() => signOut(() => {setNavigationOpen(false)})}/>
              </ListItem>

              <Divider/>
              <div className={classes.version}>
                <Version/>
              </div>
            </SwipeableDrawer>

            <main className={classes.content}>
              <Toolbar />
              <Switch>
                <Route path="/ranking"> <ViewRanking/> </Route>
                <Route path="/prono"> <ViewProno/> </Route>
                <Route path="/results"> <ViewResults/> </Route>
                <Route path="/rules">  <ViewRules/> </Route>
                <Route path="/profile">  <ViewProfile/> </Route>

                <Route path="/users"> <ViewUsers /> </Route>
                <Route path="/settings"> <ViewSettings /> </Route>
                <Route path="/teams">
                  Users
                </Route>
                <Route path="/matches">
                  Users
                </Route>
                <Route path="/hroupstage">
                  hroupstage
                </Route>
                <Route path="/knockoutstage">
                  Users
                </Route>

                <Route path="/"> <ViewRanking/> </Route>

              </Switch>
            </main>
          </PronoContext.Provider>
        </div>
    );
  }
  else {
    return (
      <div className={classes.root}>
        <ViewLogin />
      </div>
    )
  }

}

export default PronoLayout;
