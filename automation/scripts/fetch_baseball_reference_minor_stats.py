import argparse
import pandas as pd
import requests
from bs4 import BeautifulSoup
from utils.proxy_scraper import fetch_with_proxy
from tqdm import tqdm
import os

scraped_file = "data/processed/01.drafted_players_with_baseball_ids.csv"

def fetch_player_stats(original_data):
    """
    Scrapes player stats from baseball-reference.com and returns a DataFrame.

    Parameters:
    - original_data: DataFrame containing player data including 'Slug Path' and 'Primary Position'.
    - fetch_with_proxy: Function to fetch URLs with proxy.

    Returns:
    - DataFrame with updated player stats.
    """
    scraped_data = original_data.copy()
    
    for index, row in tqdm(scraped_data.iterrows(), total=scraped_data.shape[0], desc="Scraping URLs"):
        url = row['Slug Path']

        if pd.isna(url):
            continue

        try:
            response = fetch_with_proxy(f"https://www.baseball-reference.com/players{url}")
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            inner_nav = soup.find('div', id='inner_nav')
            register_link = inner_nav.find('a', href=lambda href: href and '/register' in href)

            if not register_link:
                continue

            register_url = register_link['href']
            response = fetch_with_proxy(f"https://www.baseball-reference.com{register_url}")
            soup = BeautifulSoup(response.text, 'html.parser')
            standard_batting_table = soup.find('table', id='standard_batting')

            if standard_batting_table is None:
                continue

            first_row = standard_batting_table.find('tbody').find('tr')
            first_row_dict = {td.get('data-stat'): td.text for td in first_row.find_all('td')}

            # Add new stats to the DataFrame
            stats = [
                'level', 'age', 'age_diff', 'lg_ID', 'G', 'PA', 'AB', 'R', 'H', '2B', '3B', 
                'HR', 'RBI', 'SB', 'CS', 'BB', 'SO', 'batting_avg', 'onbase_perc', 
                'slugging_perc', 'onbase_plus_slugging', 'TB'
            ]
            
            for stat in stats:
                value = first_row_dict.get(stat, None)
                scraped_data.at[index, stat] = float(value) if value and value != '' else None

            stats_pullout = soup.find('div', class_='stats_pullout')
            
            if stats_pullout:
                for section in ['p1', 'p2', 'p3']:
                    div = stats_pullout.find('div', class_=section)
                    if div:
                        for stat_div in div.find_all('div'):
                            column_name = f"Career_{stat_div.find('strong').text}"
                            value = stat_div.find('p').text
                            scraped_data.at[index, column_name] = float(value) if value and value != '' else 0
                            
        except Exception as e:
            print(f"Error scraping {url}: {e} (URL: {url})")

    return scraped_data


def main():
    # read the scraped file
    original_data = pd.read_csv(scraped_file)
    # original_data['Career_H'] = None
    # original_data['Career_AB'] = None
    # original_data['Career_R'] = None
    # original_data['Career_H'] = None
    # original_data['Career_HR'] = None
    # original_data['Career_RBI'] = None

    # get first the players that have in the column 'stats_available' the value False
    players_without_stats = original_data[original_data['stats_available'] == False]

    filled_stats_players = fetch_player_stats(players_without_stats)

    print(filled_stats_players.head())
    
    # with the players_without_stats, get the to fetch those stats

    

# Add this block to call the main function
if __name__ == "__main__":
    main()