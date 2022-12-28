import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';

import { PronoContext } from './PronoProvider.js';


function Rules(props) {
  const rules = props.rules;
  const groupStage = props.groupStage;
  const knockoutStages = props.knockoutStages;

  const getGroupstagePoints = (rules, groupStage) => {
    const matches = groupStage.map((group) => group.matches.length * (rules.groupStage.result + rules.groupStage.score)).reduce((a, b) => a+b, 0);
    const winners = groupStage.length * (rules.groupWinners.winner + 2*rules.groupWinners.team);
    return matches + winners;
  }
  const getKnockoutStagePoints = (rules, knockoutStages) => {
    return knockoutStages.map((stage) => stage.matches.length * (rules.knockoutStage.result + rules.knockoutStage.score)).reduce((a, b) => a+b, 0)
  }
  const getKnockoutstageTeamsPoints = (rules, knockoutStages) => {
    return 8*rules.knockoutStageTeams[8] + 4*rules.knockoutStageTeams[4] + 2*rules.knockoutStageTeams[2] + 1*rules.knockoutStageTeams[1];
  }

  const styles = {
    paragraph: {
      marginBottom: '10px'
    }
  }

  return (
    <div>
      <h3>Voor de start van het toernooi</h3>
      <div style={styles.paragraph}>
        <div>Er worden score's opgegeven voor alle matchen van de groepsfase.</div>
        <div>Voor een juiste voorspelling van de uitslag (winst/verlies/gelijkspel) krijg je <b>{rules.groupStage.result} punten</b>.</div>
        <div>Indien je ook de juiste score voorspelde krijg je nog <b>{rules.groupStage.score} punten</b> daarbovenop.</div>
      </div>
      <div style={styles.paragraph}>
        <div>Je moet ook de ploegen die doorstromen naar de eliminatie fase opgeven evenals of ze groepswinnaar of tweede zullen worden.</div>
        <div>Per juiste ploeg krijg je <b>{rules.groupWinners.team} punten</b>.</div>
        <div>Per juiste groepswinnaar krijge je daarbovenop <b>{rules.groupWinners.winner} punten</b>.</div>
        <div>Tijdens de groepsfase zijn in totaal <b>{getGroupstagePoints(rules, groupStage)} punten</b> te verdienen.</div>
      </div>
      <div style={styles.paragraph}>
        <div>De ploegen die elke eliminatie ronde halen, worden opgegeven.</div>
        <div>Indien je de ploegen die de kwartfinales halen kan voorspellen krijg je <b>{rules.knockoutStageTeams[8]} punten</b> per ploeg. </div>
        <div>Indien je de ploegen die de halve finales halen kan voorspellen krijg je <b>{rules.knockoutStageTeams[4]} punten</b> per ploeg. </div>
        <div>Indien je de ploegen die de finale spelen kan voorspellen krijg je <b>{rules.knockoutStageTeams[2]} punten</b> per ploeg. </div>
        <div>Indien je kan voorspellen wie het toernooi wint krijg je <b>{rules.knockoutStageTeams[1]} punten</b>.</div>
        <div>Hier zijn in totaal <b>{getKnockoutstageTeamsPoints(rules, knockoutStages)} punten</b> te verdienen.</div>
      </div>
      <div style={styles.paragraph}>
        <div>Probeer het totaal aantal goals gedurende het hele toernooi te raden.</div>
        <div>Penalties tijdens een eventuele shootouts tellen hier niet mee. Goals gescoord tijdens verlengingen wel.</div>
        <div>Indien je het juist hebt krijg je <b>{rules.totalGoals.correct} punten</b></div>
        <div>Per doelpunt verschil worden <b>{rules.totalGoals.error} punten</b> van deze {rules.totalGoals.correct} afgetrokken, je kan niet onder 0 gaan.</div>
      </div>
      <div style={styles.paragraph}>
        <div>Voorspel tot in welke ronde de Rode Duivels geraken.</div>
        <div>Indien je voorspelde dat ze niet verder dan de groepsfase raken en ze worden in de groepsfase uitgeschakeld, krijg je <b>{rules.homeTeamTesult.groupStage} punten</b>.</div>
        <div>Indien je voorspelde dat ze niet verder dan de 8e finales raken en ze worden in de 8e finales uitgeschakeld, krijg je <b>{rules.homeTeamTesult[16]} punten</b>.</div>
        <div>Indien je voorspelde dat ze niet verder dan de kwartfinales raken en ze worden in de kwartfinales uitgeschakeld, krijg je <b>{rules.homeTeamTesult[8]} punten</b>.</div>
        <div>Indien je voorspelde dat ze niet verder dan de halve finales raken en ze worden in de halve finales uitgeschakeld, krijg je <b>{rules.homeTeamTesult[4]} punten</b>.</div>
        <div>Indien je voorspelde dat ze niet verder dan de finale raken en ze worden in de finale uitgeschakeld, krijg je <b>{rules.homeTeamTesult[2]} punten</b>.</div>
        <div>Indien je voorspelde dat de Rode Duivels Wereldkampioen worden en ze worden Wereldkampioen dan krijg je <b>{rules.homeTeamTesult[1]} punten</b>.</div>
      </div>

      <h3>Voor elke eliminatie ronde</h3>
      <div style={styles.paragraph}>
        <div>Voor elke eliminatie ronde worden er score's opgegeven voor alle matchen van die ronde.</div>
        <div>Voor een juiste voorspelling van de uitslag (winst/verlies/gelijkspel) krijg je <b>{rules.knockoutStage.result} punten</b>.</div>
        <div>Indien je ook de juiste score voorspelde krijg je nog <b>{rules.knockoutStage.score} punten</b> daarbovenop.</div>
        <div>Bij de uitslag en score tellen penalties van een eventuele shootout niet mee. Gelijkspel kan dus.</div>
        <div>Hier zijn in totaal <b>{getKnockoutStagePoints(rules, knockoutStages)} punten</b> te verdienen.</div>
      </div>

      <h3>Deadlines</h3>
      <div style={styles.paragraph}>
        <div>Pronostieken kunnen telkens ingegeven worden tot één uur voor de eerste wedstrijd van een fase.</div>
      </div>
      
    </div>
  );

}


function ViewRules(props){
  const api = props.api;
  const prono = useContext(PronoContext);

  const rules = api.useRules(prono, {
    groupStage: {},
    groupWinners: {},
    knockoutStageTeams: {},
    homeTeamTesult: {},
    knockoutStage: {},
    totalGoals: {},
    prizes: {},
    cost: 10,
  })
  const groupStage = api.useGroupStage(prono)
  const knockoutStages = api.useKnockoutStage(prono)

  const theme = useTheme();

  return (
    <div style={{color: theme.palette.text.headers}}>
      <Rules rules={rules} groupStage={groupStage} knockoutStages={knockoutStages}/>
    </div>
  );
}

export default ViewRules;
