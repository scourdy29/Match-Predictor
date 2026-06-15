import React, {useState} from "react";
import "./App.css";

const teams = [
  "Argentina", "Australia", "Belgium", "Brazil", "Cameroon",
  "Canada", "Chile", "Colombia", "Costa Rica", "Croatia",
  "Ecuador", "Egypt", "England", "France", "Germany",
  "Ghana", "Honduras", "Hungary", "Indonesia", "Iran",
  "Italy", "Japan", "Kenya", "Malaysia", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria", "Panama",
  "Paraguay", "Peru", "Poland", "Portugal", "Qatar",
  "Republic of Ireland", "Romania", "Saudi Arabia", "Senegal", "Serbia",
  "Slovenia", "South Korea", "Spain", "Switzerland", "Tunisia",
  "Ukraine", "United States", "Uruguay"
];

const tournaments = ["FIFA World Cup"]

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [tournament, setTournament] = useState("");
  const [prediction, setPrediction] = useState("");

  function formatPrediction(pred) {
    if (pred === "home_win") return `🏆 ${homeTeam} Wins!`;
    if (pred === "away_win") return `🏆 ${awayTeam} Wins!`;
    if (pred === "draw") return "🤝 It's a Draw!";
    return pred;
  }

  function handlePredict() {
    fetch('https://match-predictor-kv3y.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam, tournament })
    })
    .then(response => response.json())
    .then(data => setPrediction(data.predicted_winner))
    .catch(error => console.error("Error:", error));
  }

  return (
    <div className="app">
      <div className="header">
        <div className="trophy">⚽</div>
        <h1>Match Predictor</h1>
        <p className="subtitle">Powered by Machine Learning</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Home Team</label>
          <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
            <option value="">Select Home Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="vs">VS</div>

        <div className="form-group">
          <label>Away Team</label>
          <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)}>
            <option value="">Select Away Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Tournament</label>
          <select value={tournament} onChange={(e) => setTournament(e.target.value)}>
            <option value="">Select Tournament</option>
            {tournaments.map((t) => (
              <option key={t} value={t}>{t}</option>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;