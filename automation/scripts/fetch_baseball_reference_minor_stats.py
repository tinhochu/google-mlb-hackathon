import pandas as pd
from bs4 import BeautifulSoup
from utils.proxy_scraper import fetch_with_proxy
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import sys

# File path for the scraped data
SCRAPED_FILE = "data/output/final.drafted_players.csv"

def fetch_player_stats(players):
    """
    Fetch career statistics for players using their Baseball-Reference URLs.
    
    Args:
        players (pd.DataFrame): DataFrame containing player information.
        
    Returns:
        pd.DataFrame: Updated DataFrame with fetched statistics.
    """

    def fetch_stat(url, index, retries=5):
        """Fetch player stats from Baseball-Reference using the provided URL with retry logic."""
        for attempt in range(retries):
            try:
                if pd.isna(url):  # Check if the URL is NaN
                    return index, None
                
                response = fetch_with_proxy(f"https://www.baseball-reference.com/players{url}")
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')
                stats_pullout = soup.find('div', class_='stats_pullout')
                return index, stats_pullout
            
            except Exception as e:
                if attempt == retries - 1:
                    print(f"Failed to fetch stats for {url}")
                    return index, None

    def parse_stats(stats_pullout):
        """Extract stats from the stats pullout section."""
        stats = {}
        for section in ['p1', 'p2', 'p3']:
            div = stats_pullout.find('div', class_=section)
            if div:
                for stat_div in div.find_all('div'):
                    key = f"Career_{stat_div.find('strong').text.strip()}"
                    value = stat_div.find('p').text.strip()
                    stats[key] = float(value) if value.replace('.', '', 1).isdigit() and value.count('.') <= 1 else 0
        return stats

    updated_players = players.copy()

    with ThreadPoolExecutor() as executor:
        futures = {executor.submit(fetch_stat, row['Slug Path'], index): index for index, row in players.iterrows()}
        
        for future in tqdm(as_completed(futures), total=len(futures), desc="Scraping URLs"):
            index, stats_pullout = future.result()
            if stats_pullout:
                stats = parse_stats(stats_pullout)
                for key, value in stats.items():
                    updated_players.at[index, key] = float(value)

    return updated_players

def initialize_player_stats(data):
    """
    Initialize career statistics columns for players in the DataFrame.
    
    Args:
        data (pd.DataFrame): Original player data.
        
    Returns:
        pd.DataFrame: DataFrame with initialized stats columns.
    """
    stat_columns = {
        # Pitchers
        'Career_WAR': 0.0, 'Career_W': 0.0, 'Career_L': 0.0, 'Career_ERA': 0.0,
        'Career_G': 0.0, 'Career_GS': 0.0, 'Career_SV': 0.0, 'Career_IP': 0.0,
        'Career_SO': 0.0, 'Career_WHIP': 0.0,
        # Hitters
        'Career_AB': 0.0, 'Career_HR': 0.0, 'Career_BA': 0.0, 'Career_R': 0.0,
        'Career_RBI': 0.0, 'Career_SB': 0.0, 'Career_OBP': 0.0, 'Career_SLG': 0.0,
        'Career_OPS': 0.0, 'Career_OPS+': 0.0
    }
    for col, default_value in stat_columns.items():
        data[col] = default_value
    return data

def main():
    """Main function to scrape and update player stats."""
    # Load scraped file
    try:
        original_data = pd.read_csv(SCRAPED_FILE)
    except FileNotFoundError:
        print(f"Error: File {SCRAPED_FILE} not found.")
        return
    
    # Initialize stats columns
    initialized_data = initialize_player_stats(original_data)
    
    # Fetch player stats and update the DataFrame
    updated_data = fetch_player_stats(initialized_data)  # Only the first row of the DataFrame
    
    # Save updated DataFrame
    updated_data.to_csv("data/output/updated_players.csv", index=False)
    print("Player stats successfully updated and saved.")
    
    sys.exit()

if __name__ == "__main__":
    main()
