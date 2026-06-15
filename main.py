from fastapi import FastAPI
import joblib
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import subprocess

if not os.path.exists("world_cup_rf_model.pkl"):
    print("Model not found, training now...")
    subprocess.run(["python", "train.py"], check=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

loaded_model = joblib.load("world_cup_rf_model.pkl")
loaded_encoder = joblib.load("tournament_label_encoder.pkl")
loaded_home_win_rate_encoder = joblib.load("home_win_rate.pkl")
loaded_away_win_rate_encoder = joblib.load("away_win_rate.pkl")
loaded_home_goal_difference_rate_encoder = joblib.load("home_goal_diff_rate.pkl")
loaded_away_goal_difference_rate_encoder = joblib.load("away_goal_diff_rate.pkl")

class MatchInput(BaseModel):
    home_team: str
    away_team: str
    tournament: str
    
@app.post("/predict")
def predict_match(input_data: MatchInput):
    try:
        tournament_encoded = loaded_encoder.transform([input_data.tournament])[0]
    except ValueError:
        tournament_encoded = loaded_encoder.transform(["FIFA World Cup"])[0]
    
    home_win_rate_encoded = loaded_home_win_rate_encoder.get(input_data.home_team, 0.5)
    away_win_rate_encoded = loaded_away_win_rate_encoder.get(input_data.away_team, 0.5)
    home_goal_difference_rate_encoded = loaded_home_goal_difference_rate_encoder.get(input_data.home_team, 0.5)
    away_goal_difference_rate_encoded = loaded_away_goal_difference_rate_encoder.get(input_data.away_team, 0.5)
    if input_data.tournament == "FIFA World Cup" or input_data.tournament == "UEFA Euro":
        neutral = 1
    else:
        neutral = 0

    features = [[
        home_win_rate_encoded,
        away_win_rate_encoded,
        neutral,
        tournament_encoded,
        home_goal_difference_rate_encoded,
        away_goal_difference_rate_encoded
    ]]
    
    prediction = loaded_model.predict(features)[0]
    return {"predicted_winner": prediction}