import gdown
import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE

print("Downloading data from Google Drive...")
url = "https://drive.google.com/uc?export=download&id=1xDsOM11o5edXUxJAlj3ICycLt6FmL2q0"
gdown.download(url, "results_cleaned.csv", quiet=False)

print("Loading and preparing data...")
df = pd.read_csv("results_cleaned.csv")

# Feature engineering
home_games = df.groupby("home_team").size()
home_wins = df[df["result"] == "home_win"].groupby("home_team").size()
home_win_rate = (home_wins / home_games).fillna(0)

away_games = df.groupby("away_team").size()
away_wins = df[df["result"] == "away_win"].groupby("away_team").size()
away_win_rate = (away_wins / away_games).fillna(0)

home_goal_difference = df.groupby("home_team")["home_score"].sum() - df.groupby("home_team")["away_score"].sum()
home_goal_diff_rate = home_goal_difference / home_games

away_goal_difference = df.groupby("away_team")["away_score"].sum() - df.groupby("away_team")["home_score"].sum()
away_goal_diff_rate = away_goal_difference / away_games

df["home_team_win_rate"] = df["home_team"].map(home_win_rate)
df["away_team_win_rate"] = df["away_team"].map(away_win_rate)
df["home_team_goal_difference_rate"] = df["home_team"].map(home_goal_diff_rate)
df["away_team_goal_difference_rate"] = df["away_team"].map(away_goal_diff_rate)

df = df.dropna(subset=["home_team_win_rate", "away_team_win_rate", "home_team_goal_difference_rate", "away_team_goal_difference_rate"])

features = ["home_team_win_rate", "away_team_win_rate", "neutral", "tournament", "home_team_goal_difference_rate", "away_team_goal_difference_rate"]
target = "result"

X = df[features].copy()
y = df[target]

le_tournament = LabelEncoder()
X["tournament"] = le_tournament.fit_transform(X["tournament"])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Applying SMOTE...")
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

print("Training model...")
rf_model = RandomForestClassifier(random_state=42)
rf_model.fit(X_train_resampled, y_train_resampled)

print("Saving model and encoders...")
joblib.dump(rf_model, "world_cup_rf_model.pkl")
joblib.dump(le_tournament, "tournament_label_encoder.pkl")
joblib.dump(home_win_rate, "home_win_rate.pkl")
joblib.dump(away_win_rate, "away_win_rate.pkl")
joblib.dump(home_goal_diff_rate, "home_goal_diff_rate.pkl")
joblib.dump(away_goal_diff_rate, "away_goal_diff_rate.pkl")

print("Done! Model and encoders saved.")