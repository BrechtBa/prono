import React, { useContext } from 'react';

import { PronoContext } from './PronoProvider.js';
import { UserContext } from "./UserProvider.js";
import { GroupStageProno } from './prono/GroupStage.js';
import { KnockoutStage } from './prono/KnockoutStage.js';

import {getFullGroupStage, getFullKnockoutStages} from './domain.js'



function ViewResults(props) {

  const api = props.api;
  const user = useContext(UserContext);
  const prono = useContext(PronoContext);

  const teams = api.useTeams(prono);
  const matches = api.useMatches(prono);
  const groupstage = api.useGroupStage(prono);
  const knockoutstages = api.useKnockoutStage(prono);

  const matchesProno = api.useUserPronoMatches(prono, pronoUser);
  
  const fullGroupStage = getFullGroupStage(groupstage, matches, teams);

  const stages = getFullKnockoutStages(knockoutstages, matches, teams);

  return (
    <div>
      <h2 style={{color: '#ffffff'}}>Groepsfase</h2>
      <GroupStageProno showResults={true} groupStage={fullGroupStage} matchesProno={matchesProno} groupWinnersProno={groupWinnersProno} user={pronoUser} currentStage={currentStage} api={api}/>

      <h2 style={{color: '#ffffff'}}>Knockout fase</h2>
      <KnockoutStage stages={stages} editable={user.permissions.editor || false} teams={user.permissions.editor ? Object.keys(teams).map(key => teams[key]) : [] } api={api}/>

    </div>
  );

}

export default ViewResults;
