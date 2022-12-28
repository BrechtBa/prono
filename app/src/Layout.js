import React, { useState, useContext } from 'react';
import { UserContext } from "./UserProvider.js";

import { Link, useNavigate} from "react-router-dom";

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useTheme } from '@mui/material/styles';

import ViewLogin from './ViewLogin.js';

import Version from './Version.js';


function User(props) {
  const user = props.user

  return (
    <div style={{cursor: 'pointer'}} className="MenuUser">
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
    path: 'knockoutstage'
  }]

  const theme = useTheme();

  const navigationItem = (link, index) => {
    return (
      <Link key={index} to={link.path} style={{width: 'auto', textDecoration: 'none', color: theme.palette.text.primary}} onClick={onNavigation()}>
        <ListItemButton key={link.title}>
          <ListItemText primary={link.title} />
        </ListItemButton>
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

export function PronoWrapper(props) {

  const api = props.api;
  const content = props.content;

  const user = useContext(UserContext);
  const theme = useTheme();


  if(user !== null){
      return (
        <PronoLayout api={api} user={user} content={content}/>
      );
  }
  else {
    return (
      <div style={{display: 'flex', minHeight: '100%', background: theme.palette.background.gradient}}>
        <ViewLogin api={api}/> 
      </div>
    );
  }
}

export function PronoLayout(props) {
  const api = props.api;
  const user = props.user;
  const content = props.content;
  
  const navigate = useNavigate();

  const [navigationOpen, setNavigationOpen] = useState(false);

  const toggleNavigation = (open) => (event) => {
    if(open === undefined){
      setNavigationOpen(!navigationOpen);
    }
    else{
      setNavigationOpen(open);
    }
  }

  const showProfilePage = () => {
    setNavigationOpen(false);
    navigate('profile');
  }

  const theme = useTheme();

  return (
    <div style={{display: 'flex', minHeight: '100%', background: theme.palette.background.gradient}}>
      <CssBaseline />

      <AppBar position="fixed">
        <Toolbar style={{display: "flex", paddingRight: "12px"}}>

            <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleNavigation()}>
              <MenuIcon/>
            </IconButton>

          <Typography variant="h6" style={{flexGrow: 1}}  noWrap>
              Pronostiek
          </Typography>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer anchor="left" style={{flexShrink: 0}}
      open={navigationOpen} onClose={toggleNavigation(false)} onOpen={toggleNavigation(true)}>
        <div onClick={(e) => showProfilePage()}>
          <User user={user}/>
        </div>
        <Navigation isAdmin={user.permissions.admin} onNavigation={toggleNavigation}/>

        <ListItem button>
          <ListItemText primary={"Sign out"} onClick={() => api.signOut(() => {setNavigationOpen(false)})}/>
        </ListItem>

        <Divider/>
        <div style={{marginLeft: '10px', marginTop: '30px'}}>
          <Version/>
        </div>
      </SwipeableDrawer>

      <main style={{flexGrow: 1, padding: "1em"}}>
        <Toolbar /> {/* Placeholder for the real toolbar */}
        { content }
      </main>

    </div>
  );
}