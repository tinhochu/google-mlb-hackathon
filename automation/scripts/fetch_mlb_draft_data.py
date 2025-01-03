import requests
import pandas as pd
import os
from tqdm import tqdm

# API endpoint URL (replace `{year}` with the year variable in the loop)
API_URL_TEMPLATE = "https://statsapi.mlb.com/api/v1/draft/{year}"  # Replace with your actual API URL

# Constants for player stats keys
PITCHER_KEYS = {
    "W": "wins",
    "L": "losses",
    "ERA": "era",
    "G": "gamesPlayed",
    "GS": "gamesStarted",
    "CG": "completeGames",
    "SV": "saves",
    "SVO": "saveOpportunities",
    "IP": "inningsPitched",
    "H": "hits",
    "R": "runs",
    "ER": "earnedRuns",
    "HR": "homeRuns",
    "HB": "hitByPitch",
    "BB": "baseOnBalls",
    "IBB": "intentionalWalks",
    "SO": "strikeOuts",
    "AVG": "avg",
    "WHIP": "whip",
}

BATTER_KEYS = {
    "G": "gamesPlayed",
    "AB": "atBats",
    "R": "runs",
    "H": "hits",
    "TB": "totalBases",
    "2B": "doubles",
    "3B": "triples",
    "HR": "homeRuns",
    "RBI": "rbi",
    "BB": "baseOnBalls",
    "IBB": "intentionalWalks",
    "SO": "strikeOuts",
    "SB": "stolenBases",
    "CS": "caughtStealing",
    "AVG": "avg",
    "OBP": "obp",
    "SLG": "slg",
    "OPS": "ops",
}

# Function to convert height from feet and inches to total inches
def convert_height(height_str):
    try:
        feet, inches = map(int, height_str.replace('"', '').split("' "))
        return feet * 12 + inches
    except (ValueError, TypeError):
        return None

# Function to fetch player stats
def fetch_player_stats(person_id):
    # bail early if person_id is None
    if person_id is None:
        return {}

    url = f"https://statsapi.mlb.com/api/v1/people/{person_id}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&leagueListId=milb_all"
    stats = requests.get(url).json().get("stats", [])
    return stats[0] if stats else {}  # Return an empty dict if stats list is empty

# Function to process a single player's data
def process_player_data(player, year):
    person = player.get("person", {})
    team = player.get("team", {})
    stats = fetch_player_stats(person.get("id"))

    player_stats = {
        "Player ID": int(person.get("id", 0)),
        "Player Name": person.get("fullName", None),
        "Draft Year": year,
        "Draft Round": player.get("pickRound", None),
        "Pick Overall": player.get("pickNumber", None),
        "Height (inches)": convert_height(person.get("height", "")),
        "Weight (lbs)": person.get("weight", None),
        "Primary Position": person.get("primaryPosition", {}).get("abbreviation", None),
        "Batting Hand": person.get("batSide", {}).get("code", None),
        "Throwing Hand": person.get("pitchHand", {}).get("code", None),
        "Draft Team": team.get("name", "Unknown"),
        "MLB Debut": person.get("mlbDebutDate", "No MLB Debut"),
        "Last Played Date": person.get("lastPlayedDate", "No Last Played Date"),
        "Is_Pitcher": person.get("primaryPosition", {}).get("abbreviation", "") == "P",
    }

    if player_stats["Is_Pitcher"]:
        player_stats.update({key: stats.get(stat_key, 0 if key not in ["ERA", "AVG", "WHIP"] else 0.0) for key, stat_key in PITCHER_KEYS.items()})
    else:
        player_stats.update({key: stats.get(stat_key, 0 if key not in ["AVG", "OBP", "SLG", "OPS"] else 0.0) for key, stat_key in BATTER_KEYS.items()})
        # Add missing pitcher stats with default values
        player_stats.update({key: 0 for key in PITCHER_KEYS.keys()})

    return player_stats

# Fetch draft data for a specific year
def fetch_draft_data_for_year(api_url, year):
    url = api_url.format(year=year)
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()  # Parse the JSON response
        rounds = data.get("drafts", {}).get("rounds", [])
        players = []
        for round_data in rounds:
            for player in round_data.get("picks", []):  # Iterate over players in each round
                players.append(process_player_data(player, year))
        return players
    else:
        print(f"Failed to fetch data for {year}. Status code: {response.status_code}")
        return []

# Main script execution
if __name__ == "__main__":
    all_draft_data = []
    output_dir = "data/raw"
    os.makedirs(output_dir, exist_ok=True)

    for year in tqdm(range(1990, 1991), desc="Fetching data for years 1990-2015"):
        year_data = fetch_draft_data_for_year(API_URL_TEMPLATE, year)
        all_draft_data.extend(year_data)

    if all_draft_data:
        df = pd.DataFrame(all_draft_data)
        csv_file = os.path.join(output_dir, "drafted_players_1990_2015.csv")
        df.to_csv(csv_file, index=False)
        print(f"Data for all years saved to {csv_file}")
        print(df.head())
    else:
        print("No draft data was fetched or processed.")
