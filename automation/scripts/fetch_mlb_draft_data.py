import requests
import pandas as pd
import os
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed

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
    if person_id is None:
        return {}, False  # Return empty stats and failure flag

    url = f"https://statsapi.mlb.com/api/v1/people/{person_id}/stats?stats=yearByYear,career,yearByYearAdvanced,careerAdvanced&leagueListId=milb_all"
    stats = requests.get(url).json().get("stats", [])
    
    if stats:
        return stats[0], True  # Return stats and success flag
    else:
        return {}, False  # Return empty stats and failure flag

# Function to process a single player's data
def process_player_data(player, year):
    person = player.get("person", {})
    team = player.get("team", {})
    stats, fetched = fetch_player_stats(person.get("id"))  # Capture the fetched status

    # Safely access stats and splits
    splits = stats.get('splits', [])
    stats = splits[0].get('stat', {}) if splits else {}

    player_stats = {
        "stats_available": stats != {},
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
        "Stats Fetched": fetched,  # Add the fetched status
    }

    # Fill missing batter stats with 0
    player_stats.update({key: 0 for key in BATTER_KEYS.keys()})
    # Fill missing pitcher stats with 0
    player_stats.update({key: 0 for key in PITCHER_KEYS.keys()})

    if player_stats["Is_Pitcher"]:
        player_stats.update({key: stats.get(stat_key, 0 if key not in ["ERA", "AVG", "WHIP"] else 0.0) for key, stat_key in PITCHER_KEYS.items()})
    else:
        player_stats.update({key: stats.get(stat_key, 0 if key not in ["AVG", "OBP", "SLG", "OPS"] else 0.0) for key, stat_key in BATTER_KEYS.items()})

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
            for player in round_data.get("picks", []):
                players.append((player, year))  # Return the raw player data and year
        return players
    else:
        print(f"Failed to fetch data for {year}. Status code: {response.status_code}")
        return []

# Parallel processing for players
def process_players_in_parallel(players):
    results = []
    with ThreadPoolExecutor() as executor:
        future_to_player = {executor.submit(process_player_data, player, year): (player, year) for player, year in players}  # Limit to 20 players

        for future in tqdm(as_completed(future_to_player), total=len(players), desc="Processing players"):
            try:
                results.append(future.result())
            except Exception as e:
                print(f"Error processing player: {e}")

    return results

# Main script execution
if __name__ == "__main__":
    all_players = []
    all_draft_data = []
    output_dir = "data/raw"
    os.makedirs(output_dir, exist_ok=True)

    for year in tqdm(range(1990, 2016), desc="Fetching draft data"):
        players = fetch_draft_data_for_year(API_URL_TEMPLATE, year)
        all_players.extend(players)

    if all_players:
        all_draft_data = process_players_in_parallel(all_players)

    if all_draft_data:
        df = pd.DataFrame(all_draft_data)
        csv_file = os.path.join(output_dir, "drafted_players_1990_2015.csv")
        df.to_csv(csv_file, index=False)
        print(f"Data for all years saved to {csv_file}")
    else:
        print("No draft data was fetched or processed.")