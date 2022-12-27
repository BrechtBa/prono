import React, { useState, useContext, useRef } from 'react';
import Resizer from "react-image-file-resizer";

import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';

import { UserContext } from "./UserProvider.js";


const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      200,
      200,
      "PNG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

function ViewProfile(props){
  const api = props.api;

  const user = useContext(UserContext);
  const [editDisplayNameOpen, setEditDisplayNameOpen] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')

  const inputFile = useRef(null)

  const handleSaveDisplayName = () =>{
    api.updateDisplayName(user, newDisplayName);
    setEditDisplayNameOpen(false);
  }

  const openFileInput = () => {
    inputFile.current.click();
  }

  const onFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      api.updateProfilePicture(user, image);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Paper>
        <div style={{display: 'flex', flexWrap: 'wrap', padding: '10px', alignItems: 'flex-end'}}>
          <div style={{marginRight: '20px'}}>
            <Avatar alt={user.displayName} src={user.profilePicture} style={{width: '200px', height: '200px'}}/>
            <Button style={{marginTop: '10px'}} onClick={e => openFileInput()}>Verander profielfoto</Button>
            <input type='file' id='file' ref={inputFile} accept="image/*" style={{display: 'none'}} onChange={onFileChange}/>
          </div>
          <div style={{marginRight: '20px', marginTop: '20px'}}>
            <div>{user.displayName}</div>
            <Button style={{marginTop: '10px'}} onClick={(e) => {setNewDisplayName(user.displayName); setEditDisplayNameOpen(true);}}>Verander naam</Button>
          </div>
        </div>
      </Paper>

      <Dialog onClose={() => setEditDisplayNameOpen(false)} open={editDisplayNameOpen}>
        <div style={{padding: '20px'}}>
          <form>
            <TextField value={newDisplayName} label="Naam" onChange={(e) => setNewDisplayName(e.target.value)}/>

            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px'}}>
              <Button onClick={() => handleSaveDisplayName()}>save</Button>
              <Button onClick={() => setEditDisplayNameOpen(false)}>cancel</Button>
            </div>
          </form>
        </div>
      </Dialog>
      
    </div>

  );

}

export default ViewProfile;
