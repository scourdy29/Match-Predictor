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

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [headToHead, setHeadToHead] = useState([]);
  const [activeTab, setActiveTab] = useState("predictor");
  const [groupResults, setGroupResults] = useState({});
  const [simulating, setSimulating] = useState(false);

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
    const results = {};

    for (const [group, groupTeams] of Object.entries(groups)) {
      const standings = {};
      groupTeams.forEach(t => standings[t] = { points: 0, played: 0 });

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

      results[group] = Object.entries(standings)
        .sort((a, b) => b[1].points - a[1].points)
        .map(([team, stats]) => ({ team, ...stats }));
    }

    setGroupResults(results);
    setSimulating(false);
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
          Match Predictor
        </button>
        <button className={activeTab === "groups" ? "tab active" : "tab"} onClick={() => setActiveTab("groups")}>
          Group Stage
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
            {simulating ? "Simulating... (this may take a moment)" : "⚽ Simulate All Groups"}
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
    </div>
  );
}

export default App;