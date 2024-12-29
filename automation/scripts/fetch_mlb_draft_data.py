import requests
import pandas as pd
import os

# API endpoint URL (replace `{year}` with the year variable in the loop)
API_URL_TEMPLATE = "https://statsapi.mlb.com/api/v1/draft/{year}"  # Replace with your actual API URL

# Function to convert height from feet and inches to total inches
def convert_height(height_str):
    try:
        # Remove the double quote and split the height string
        feet, inches = map(int, height_str.replace('"', '').split("' "))
        return feet * 12 + inches  # Return as an integer without decimal
    except:
        return None

# Function to process a single player's data
def process_player_data(player, year):
    person = player.get("person", {})
    school = player.get("school", {})
    team = player.get("team", {})
    return {
        "Player ID": int(person.get("id", 0)),
        "Player Name": person.get("fullName", None),
        "Draft Year": year,
        "Draft Round": player.get("pickRound", None),
        "Pick Overall": player.get("pickNumber", None),
        "Birth Date": person.get("birthDate", None),
        "Birth City": person.get("birthCity", None),
        "Birth State/Province": person.get("birthStateProvince", None),
        "Birth Country": person.get("birthCountry", None),
        "Height (inches)": convert_height(person.get("height", "")),
        "Weight (lbs)": person.get("weight", None),
        "Primary Position": person.get("primaryPosition", {}).get("abbreviation", None),
        "Batting Hand": person.get("batSide", {}).get("code", None),
        "Throwing Hand": person.get("pitchHand", {}).get("code", None),
        "Draft Team": team.get("name", "Unknown"),
        "MLB Debut": person.get("mlbDebutDate", "No MLB Debut"),
        "Last Played Date": person.get("lastPlayedDate", "No Last Played Date"),
        "School": school.get("name", "Unknown"),
    }

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
    all_draft_data = []  # List to store data for all years

    # Create the directory if it doesn't exist
    output_dir = "data/raw"
    os.makedirs(output_dir, exist_ok=True)  # Create directory

    # Loop through all years from 1990 to 2015
    for year in range(1990, 2016):
        print(f"Fetching data for the year {year}...")
        year_data = fetch_draft_data_for_year(API_URL_TEMPLATE, year)
        all_draft_data.extend(year_data)  # Append the year's data to the master list

    # Convert to DataFrame
    if all_draft_data:
        df = pd.DataFrame(all_draft_data)

        # Save to CSV
        csv_file = os.path.join(output_dir, "drafted_players_1990_2015.csv")  # Use os.path.join for better path handling
        df.to_csv(csv_file, index=False)
        print(f"Data for all years saved to {csv_file}")

        # Display sample of the DataFrame
        print(df.head())
    else:
        print("No draft data was fetched or processed.")
