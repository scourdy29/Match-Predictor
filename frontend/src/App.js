import React, {useState} from "react";
import "./App.css";

const teams = [
  "Algeria", "Argentina", "Australia", "Austria", "Belgium", 
  "Bosnia and Herzegovina", "Brazil", "Canada", "Cape Verde",
  "Colombia", "Congo DR", "Croatia", "Curaçao", 'Czechia',
  "Ecuador", "Egypt", "England", "France", "Germany",
  "Ghana", "Haiti", "Iran", 'Iraq', "Ivory Coast", "Japan", 
  "Jordan", "Mexico","Morocco", "Netherlands", "New Zealand", 
  "Norway", "Panama", "Paraguay", "Portugal", "Qatar", "Saudi Arabia", 
  "Scotland", "Senegal", "South Africa", "South Korea", "Spain", 
  "Sweden","Switzerland", "Tunisia", "Türkiye", "United States", "Uruguay"
];

function App() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(null);
  const [headToHead, setHeadToHead] = useState([]);
 
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
 
  return (
    <div className="app">
      <div className="header">
        <div className="trophy">⚽</div>
        <h1>Match Predictor</h1>
        <p className="subtitle">FIFA World Cup 2026 · Powered by Machine Learning</p>
      </div>
 
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
    </div>
  );
}
 
export default App;