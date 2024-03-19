import React, { createContext } from "react";

export const SquadContext = createContext(null);


function SquadProvider(props){
  const squad = props.squad;
  const setSquad = props.setSquad;

  return (
    <SquadContext.Provider value={{squad: squad, setSquad: setSquad}}>
      {props.children}
    </SquadContext.Provider>
  );
}

export default SquadProvider;