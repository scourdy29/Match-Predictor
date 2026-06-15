import React, {useState} from "react";
import "./App.css";

const teams = ['Abkhazia', 'Afghanistan', 'Albania', 'Alderney', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Arameans Suryoye', 'Argentina', 'Armenia', 'Artsakh', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barawa', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Biafra', 'Bolivia', 'Bonaire', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brittany', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cascadia', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chameria', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Corsica', 'Costa Rica', 'County of Nice', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Czechoslovakia', 'DR Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Délvidék', 'Ecuador', 'Egypt', 'El Salvador', 'Ellan Vannin', 'England', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Felvidék', 'Fiji', 'Finland', 'France', 'French Guiana', 'Frøya', 'Gabon', 'Gambia', 'Georgia', 'German DR', 'Germany', 'Ghana', 'Gibraltar', 'Gotland', 'Gozo', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Hitra', 'Hmong', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Iraqi Kurdistan', 'Isle of Man', 'Isle of Wight', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kernow', 'Kosovo', 'Kurdistan', 'Kuwait', 'Kyrgyzstan', 'Kárpátalja', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mapuche', 'Martinique', 'Matabeleland', 'Mauritania', 'Mauritius', 'Mayotte', 'Menorca', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'North Vietnam', 'Northern Cyprus', 'Northern Ireland', 'Northern Mariana Islands', 'Norway', 'Occitania', 'Oman', 'Orkney', 'Padania', 'Pakistan', 'Palestine', 'Panama', 'Panjab', 'Papua New Guinea', 'Paraguay', 'Parishes of Jersey', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Provence', 'Puerto Rico', 'Qatar', 'Quebec', 'Raetia', 'Republic of Ireland', 'Republic of St. Pauli', 'Rhodes', 'Romania', 'Russia', 'Rwanda', 'Réunion', 'Saare County', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Saudi Arabia', 'Scotland', 'Senegal', 'Serbia', 'Seychelles', 'Shetland', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'Somaliland', 'South Africa', 'South Korea', 'South Ossetia', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Székely Land', 'Sápmi', 'São Tomé and Príncipe', 'Tahiti', 'Taiwan', 'Tajikistan', 'Tamil Eelam', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Koreans in Japan', 'United States', 'United States Virgin Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Vietnam Republic', 'Wales', 'Wallis Islands and Futuna', 'Western Armenia', 'Western Australia', 'Western Isles', 'Western Sahara', 'Yemen', 'Ynys Môn', 'Yugoslavia', 'Zambia', 'Zanzibar', 'Zimbabwe', 'Åland Islands'];

const tournaments = ['ABCS Tournament', 'AFC Asian Cup', 'AFC Asian Cup qualification', 'AFC Challenge Cup', 'AFC Challenge Cup qualification', 'AFC Solidarity Cup', 'AFF Championship', 'AFF Championship qualification', 'ASEAN Championship', 'ASEAN Championship qualification', 'African Cup of Nations', 'African Cup of Nations qualification', 'African Friendship Games', 'Afro-Asian Games', 'Al Ain International Cup', 'All-African Games', 'Amílcar Cabral Cup', 'Arab Cup', 'Arab Cup qualification', 'Asian Games', 'Atlantic Cup', 'Atlantic Heritage Cup', 'Balkan Cup', 'Baltic Cup', 'Beijing International Friendship Tournament', 'Bolivarian Games', 'Brazil Independence Cup', 'British Home Championship', 'CAFA Nations Cup', 'CCCF Championship', 'CECAFA Cup', 'CFU Caribbean Cup', 'CFU Caribbean Cup qualification', 'CONCACAF Championship', 'CONCACAF Championship qualification', 'CONCACAF Nations League', 'CONCACAF Nations League qualification', 'CONCACAF Series', 'CONIFA Africa Football Cup', 'CONIFA Asia Cup', 'CONIFA European Football Cup', 'CONIFA South America Football Cup', 'CONIFA World Cup qualification', 'CONIFA World Football Cup', 'CONIFA World Football Cup qualification', 'CONMEBOL–UEFA Cup of Champions', 'COSAFA Cup', 'COSAFA Cup qualification', 'Canadian Shield', 'Central American and Caribbean Games', 'Central European International Cup', 'ConIFA Challenger Cup', 'Confederations Cup', 'Copa América', 'Copa América qualification', 'Copa Artigas', "Copa Bernardo O'Higgins", 'Copa Carlos Dittborn', 'Copa Chevallier Boutell', 'Copa Confraternidad', 'Copa Félix Bogado', 'Copa Juan Pinto Durán', 'Copa Lipton', 'Copa Newton', 'Copa Oswaldo Cruz', 'Copa Paz del Chaco', 'Copa Premio Honor Argentino', 'Copa Premio Honor Uruguayo', 'Copa Ramón Castilla', 'Copa Rio Branco', 'Copa Roca', 'Copa del Pacífico', 'Corsica Cup', "Coupe de l'Outre-Mer", 'Cup of Ancient Civilizations', 'Cyprus International Tournament', 'Dakar Tournament', 'Diamond Jubilee International Football Tournament', 'Dragon Cup', 'Dunhill Cup', 'Dynasty Cup', 'EAFF Championship', 'EAFF Championship qualification', 'ELF Cup', 'East Asian Games', 'FIFA 75th Anniversary Cup', 'FIFA Series', 'FIFA World Cup', 'FIFA World Cup qualification', 'FIFI Wild Cup', 'Far Eastern Championship Games', 'Four Nations Tournament', "Four Nations' Cup", 'GaNEFo', 'Gold Cup', 'Gold Cup qualification', 'Great Wall Cup', 'Guangzhou International Friendship Tournament', 'Gulf Cup', 'Hungary Heritage Cup', 'Indian Ocean Island Games', 'Indonesia Tournament', 'Inter Games', 'Inter-Allied Games', 'Intercontinental Cup', 'International Tournament of Peoples, Cultures and Tribes', 'Island Games', 'Joe Robbie Cup', 'Jordan International Tournament', 'King Hassan II Tournament', "King's Cup", 'Kirin Challenge Cup', 'Kirin Cup', 'Korea Cup', 'Kuneitra Cup', 'Lunar New Year Cup', "MSG Prime Minister's Cup", 'Mahinda Rajapaksa Cup', 'Malta International Tournament', 'Mapinduzi Cup', 'Marianas Cup', 'Marlboro Cup', 'Matthews Cup', 'Mauritius Four Nations Cup', 'Melanesia Cup', 'Merdeka Tournament', 'Merlion Cup', 'Miami Cup', 'Millennium Cup', 'Morocco, Capital of African Football', 'Mukuru 4 Nations', 'Mundialito', 'Muratti Vase', 'NAFC Championship', 'NAFU Championship', 'Nations Cup', 'Navruz Cup', 'Nehru Cup', 'Niamh Challenge Cup', 'Nile Basin Tournament', 'Nordic Championship', 'OSN Cup', 'Oceania Nations Cup', 'Oceania Nations Cup qualification', 'Olympic Games', 'Open International Championship', 'Outrigger Challenge Cup', 'Pacific Games', 'Pacific Mini Games', 'Palestine Cup', 'Palestine International Championship', 'Pan American Championship', 'Peace Cup', 'Philippine Peace Cup', 'Phillip Seaga Cup', "Prime Minister's Cup", 'Real Madrid 75th Anniversary Cup', 'Rous Cup', 'SAFF Cup', 'SKN Football Festival', 'Scania 100 Tournament', 'Simba Tournament', 'Soccer Ashes', 'South Asian Games', 'South Asian Super Cup', 'South Pacific Games', 'South Pacific Mini Games', 'Southeast Asian Games', 'Southeast Asian Peninsular Games', 'Superclásico de las Américas', 'TIFOCO Tournament', 'The Other Final', 'Three Nations Cup', 'Tournament Burkina Faso', 'Tournoi de France', 'Trans-Tasman Cup', 'Tri Nation Tournament', 'Tri-Nations Cup', 'Tri-Nations Series', 'Tynwald Hill Tournament', 'UDEAC Cup', 'UEFA Euro', 'UEFA Euro qualification', 'UEFA Nations League', 'UNCAF Cup', 'UNIFFAC Cup', 'USA Cup', 'United Arab Emirates Friendship Tournament', 'Unity Cup', 'VFF Cup', 'Vietnam Independence Cup', 'Viva World Cup', 'WAFF Championship', 'West African Cup', 'Windward Islands Tournament', 'World Unity Cup', 'Zambian Independence Tournament', 'Évence Coppée Trophy'];

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