import React, { useState } from "react";
import "./App.css";

const teams = [
  "Algeria", "Argentina", "Australia", "Austria", "Belgium", 
  "Bosnia and Herzegovina", "Brazil", "Canada", "Cape Verde",
  "Colombia", "Congo DR", "Croatia", "Curaçao", "Czechia",
  "Ecuador", "Egypt", "England", "France", "Germany",
  "Ghana", "Haiti", "Iran", "Iraq", "Ivory Coast", "Japan", 
  "Jordan", "Mexico", "Morocco", "Netherlands", "New Zealand", 
  "Norway", "Panama", "Paraguay", "Portugal", "Qatar", "Saudi Arabia", 
  "Scotland", "Senegal", "South Africa", "South Korea", "Spain", 
  "Sweden", "Switzerland", "Tunisia", "Türkiye", "United States", "Uruguay"
];

const groups = {
  A: ["Mexico", "South Africa", "South Korea", "Czechia"],
  B: ["Canada", "Switzerland", "Qatar", "Bosnia and Herzegovina"],
  C: ["Brazil", "Morocco", "Scotland", "Haiti"],
  D: ["United States", "Paraguay", "Australia", "Türkiye"],
  E: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"],
  F: ["Netherlands", "Japan", "Tunisia", "Sweden"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Norway", "Iraq"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Colombia", "Uzbekistan", "Congo DR"],
  L: ["England", "Croatia", "Ghana", "Panama"]
};

async function predictMatch(home, away) {
  const res = await fetch('https://match-predictor-kv3y.onrender.com/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ home_team: home, away_team: away, tournament: "FIFA World Cup" })
  });
  const data = await res.json();
  if (data.predicted_winner === "home_win") return home;
  if (data.predicted_winner === "away_win") return away;
  // For draws in knockout, pick higher confidence team (home wins tiebreak)
  return home;
}

async function simulateGroupStandings() {
  const allStandings = {};

  for (const [group, groupTeams] of Object.entries(groups)) {
    const standings = {};
    groupTeams.forEach(t => standings[t] = { points: 0, played: 0, group });

    for (let i = 0; i < groupTeams.length; i++) {
      for (let j = i + 1; j < groupTeams.length; j++) {
        const home = groupTeams[i];
        const away = groupTeams[j];
        const res = await fetch('https://match-predictor-kv3y.onrender.com/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ home_team: home, away_team: away, tournament: "FIFA World Cup" })
        });
        const data = await res.json();
        standings[home].played++;
        standings[away].played++;
        if (data.predicted_winner === "home_win") standings[home].points += 3;
        else if (data.predicted_winner === "away_win") standings[away].points += 3;
        else { standings[home].points += 1; standings[away].points += 1; }
      }
    }

    const sorted = Object.entries(standings)
      .sort((a, b) => b[1].points - a[1].points)
      .map(([team, stats]) => ({ team, ...stats }));

    allStandings[group] = sorted;
  }

  return allStandings;
}

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [headToHead, setHeadToHead] = useState([]);
  const [activeTab, setActiveTab] = useState("predictor");
  const [groupResults, setGroupResults] = useState({});
  const [simulating, setSimulating] = useState(false);
  const [bracket, setBracket] = useState(null);
  const [simulatingTournament, setSimulatingTournament] = useState(false);
  const [tournamentStatus, setTournamentStatus] = useState("");

  function formatPrediction(pred) {
    if (pred === "home_win") return `🏆 ${homeTeam} Wins!`;
    if (pred === "away_win") return `🏆 ${awayTeam} Wins!`;
    if (pred === "draw") return "🤝 It's a Draw!";
    return pred;
  }

  function fetchHeadToHead(home, away) {
    if (!home || !away) return;
    fetch(`https://match-predictor-kv3y.onrender.com/head-to-head?home_team=${encodeURIComponent(home)}&away_team=${encodeURIComponent(away)}`)
      .then(res => res.json())
      .then(data => setHeadToHead(data.head_to_head || []))
      .catch(err => console.error(err));
  }

  function handlePredict() {
    fetch('https://match-predictor-kv3y.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam, tournament: "FIFA World Cup" })
    })
    .then(response => response.json())
    .then(data => {
      setPrediction(data.predicted_winner);
      setConfidence(data.confidence);
    })
    .catch(error => console.error("Error:", error));
  }

  async function simulateGroups() {
    setSimulating(true);
    const allStandings = await simulateGroupStandings();
    setGroupResults(allStandings);
    setSimulating(false);
  }

  async function simulateTournament() {
    setSimulatingTournament(true);
    setBracket(null);

    setTournamentStatus("Simulating group stage...");
    const allStandings = await simulateGroupStandings();

    // Get top 2 from each group
    const qualifiers = {};
    const thirdPlace = [];
    for (const [group, standings] of Object.entries(allStandings)) {
      qualifiers[group] = { first: standings[0].team, second: standings[1].team };
      thirdPlace.push({ team: standings[2].team, points: standings[2].points, group });
    }

    // Best 8 third place teams
    const best8Third = thirdPlace
      .sort((a, b) => b.points - a.points)
      .slice(0, 8)
      .map(t => t.team);

    // Build Round of 32 (simplified pairing)
    setTournamentStatus("Simulating Round of 32...");
    const r32Teams = [];
    for (const group of Object.keys(groups)) {
      r32Teams.push(qualifiers[group].first);
      r32Teams.push(qualifiers[group].second);
    }
    best8Third.forEach(t => r32Teams.push(t));

    const r32Results = [];
    const r16Teams = [];
    for (let i = 0; i < r32Teams.length; i += 2) {
      const winner = await predictMatch(r32Teams[i], r32Teams[i + 1]);
      r32Results.push({ home: r32Teams[i], away: r32Teams[i + 1], winner });
      r16Teams.push(winner);
    }

    setTournamentStatus("Simulating Round of 16...");
    const r16Results = [];
    const qfTeams = [];
    for (let i = 0; i < r16Teams.length; i += 2) {
      const winner = await predictMatch(r16Teams[i], r16Teams[i + 1]);
      r16Results.push({ home: r16Teams[i], away: r16Teams[i + 1], winner });
      qfTeams.push(winner);
    }

    setTournamentStatus("Simulating Quarter Finals...");
    const qfResults = [];
    const sfTeams = [];
    for (let i = 0; i < qfTeams.length; i += 2) {
      const winner = await predictMatch(qfTeams[i], qfTeams[i + 1]);
      qfResults.push({ home: qfTeams[i], away: qfTeams[i + 1], winner });
      sfTeams.push(winner);
    }

    setTournamentStatus("Simulating Semi Finals...");
    const sfResults = [];
    const finalTeams = [];
    for (let i = 0; i < sfTeams.length; i += 2) {
      const winner = await predictMatch(sfTeams[i], sfTeams[i + 1]);
      sfResults.push({ home: sfTeams[i], away: sfTeams[i + 1], winner });
      finalTeams.push(winner);
    }

    setTournamentStatus("Simulating the Final...");
    const champion = await predictMatch(finalTeams[0], finalTeams[1]);
    const finalResult = { home: finalTeams[0], away: finalTeams[1], winner: champion };

    setBracket({ r32: r32Results, r16: r16Results, qf: qfResults, sf: sfResults, final: finalResult, champion });
    setTournamentStatus("");
    setSimulatingTournament(false);
  }

  function RoundDisplay({ title, matches }) {
    return (
      <div className="round">
        <h3 className="round-title">{title}</h3>
        {matches.map((m, i) => (
          <div key={i} className="bracket-match">
            <span className={m.winner === m.home ? "team winner" : "team loser"}>{m.home}</span>
            <span className="vs-small">vs</span>
            <span className={m.winner === m.away ? "team winner" : "team loser"}>{m.away}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <div className="trophy">⚽</div>
        <h1>Match Predictor</h1>
        <p className="subtitle">FIFA World Cup 2026 · Powered by Machine Learning</p>
      </div>

      <div className="tabs">
        <button className={activeTab === "predictor" ? "tab active" : "tab"} onClick={() => setActiveTab("predictor")}>
          Predictor
        </button>
        <button className={activeTab === "groups" ? "tab active" : "tab"} onClick={() => setActiveTab("groups")}>
          Groups
        </button>
        <button className={activeTab === "tournament" ? "tab active" : "tab"} onClick={() => setActiveTab("tournament")}>
          Tournament
        </button>
      </div>

      {activeTab === "predictor" && (
        <div className="card">
          <div className="form-group">
            <label>Home Team</label>
            <select value={homeTeam} onChange={(e) => {
              setHomeTeam(e.target.value);
              fetchHeadToHead(e.target.value, awayTeam);
            }}>
              <option value="">Select Home Team</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div className="vs">VS</div>

          <div className="form-group">
            <label>Away Team</label>
            <select value={awayTeam} onChange={(e) => {
              setAwayTeam(e.target.value);
              fetchHeadToHead(homeTeam, e.target.value);
            }}>
              <option value="">Select Away Team</option>
              {teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <button className="predict-btn" onClick={handlePredict}>
            Predict Match
          </button>

          {prediction && (
            <div className="result">
              <p className="result-label">Prediction</p>
              <h2>{formatPrediction(prediction)}</h2>
              <p className="confidence">{confidence}% confident</p>
            </div>
          )}

          {headToHead.length > 0 && (
            <div className="h2h">
              <p className="result-label">Last {headToHead.length} Head-to-Head Results</p>
              {headToHead.map((match, i) => (
                <div key={i} className="h2h-row">
                  <span className="h2h-date">{match.date}</span>
                  <span>{match.home_team} {match.home_score} - {match.away_score} {match.away_team}</span>
                  <span className="h2h-tournament">{match.tournament}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "groups" && (
        <div className="card">
          <button className="predict-btn" onClick={simulateGroups} disabled={simulating}>
            {simulating ? "Simulating..." : "⚽ Simulate All Groups"}
          </button>

          {Object.entries(groupResults).map(([group, standings]) => (
            <div key={group} className="group-table">
              <h3 className="group-title">Group {group}</h3>
              {standings.map((s, i) => (
                <div key={s.team} className={`group-row ${i < 2 ? "qualify" : ""}`}>
                  <span className="group-pos">{i + 1}</span>
                  <span className="group-team">{s.team}</span>
                  <span className="group-played">{s.played} played</span>
                  <span className="group-pts">{s.points} pts</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {activeTab === "tournament" && (
        <div className="card">
          <button className="predict-btn" onClick={simulateTournament} disabled={simulatingTournament}>
            {simulatingTournament ? tournamentStatus || "Simulating..." : "🏆 Simulate Entire Tournament"}
          </button>

          {bracket && (
            <>
              <div className="champion-box">
                <p className="result-label">🏆 World Cup Champion</p>
                <h2 className="champion-name">{bracket.champion}</h2>
              </div>
              <RoundDisplay title="Final" matches={[bracket.final]} />
              <RoundDisplay title="Semi Finals" matches={bracket.sf} />
              <RoundDisplay title="Quarter Finals" matches={bracket.qf} />
              <RoundDisplay title="Round of 16" matches={bracket.r16} />
              <RoundDisplay title="Round of 32" matches={bracket.r32} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;