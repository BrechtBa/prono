import React, { useState, useEffect } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      color: theme.palette.text.headers
    }
  })
);


export function Disabled(props) {
  const disabled = props.disabled;

  if(disabled){
    return (
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(1,1,1,0.3)', borderRadius: 'inherit'}}>
      </div>
    )
  }
  else{
    return ''
  }
}


export function DeadlineMessage(props){
    const deadline = props.deadline;
    const complete = props.complete;
    const active = props.active;
  
    const calculateTimeLeft = () => {
      const difference = deadline - new Date();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      if(days > 0){
        return `${days} dagen ${hours} uur ${minutes} minuten`;
      }
      else if(hours > 0){
        return `${hours} uur ${minutes} minuten`;
      }
      else if(minutes > 1){
        return `${minutes} minuten`;
      }
      else if(minutes > 0){
        return `${minutes} minuut`;
      }
      else{
        return '0';
      }
    }
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    });
  
    const classes = useStyles();
  
    return (
      <div className={classes.header} style={{textAlign: 'right'}}>
        {active && timeLeft !== '0'  && complete && (
          <div>Dit deel is compleet.</div>
        )}
        {active && timeLeft !== '0' && !complete  && (
          <div>Je hebt nog {timeLeft} om dit deel in te vullen.</div>
        )}
      </div>
    )
  }
  