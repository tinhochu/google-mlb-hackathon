import argparse
import pandas as pd
import requests
from bs4 import BeautifulSoup
from utils.proxy_scraper import fetch_with_proxy
from tqdm import tqdm
import os

scraped_file = "data/processed/02.drafted_players_with_stats.csv"

'''
# rename the columns to the new stats
        data.rename(columns={
            'level': 'Mi_level',
            'age': 'Mi_Age',
            'age_diff': 'Mi_Age_diff',
            'lg_ID': 'Mi_League',
            'G': 'Mi_G',
            'PA': 'Mi_PA',
            'AB': 'Mi_AB',
            'R': 'Mi_R',
            'H': 'Mi_H',
            '2B': 'Mi_2B',
            '3B': 'Mi_3B',
            'HR': 'Mi_HR',
            'RBI': 'Mi_RBI',
            'SB': 'Mi_SB',
            'CS': 'Mi_CS',
            'BB': 'Mi_BB',
            'SO': 'Mi_SO',
            'batting_avg': 'Mi_BA',
            'onbase_perc': 'Mi_OBP',
            'slugging_perc': 'Mi_SLG',
            'onbase_plus_slugging': 'Mi_OPS',
            'TB': 'Mi_TB',
        }, inplace=True)

        # Step 3: Save the results to a new CSV file
        output_file = "data/processed/02.1990_2015_drafts_with_stats.csv"
'''

def evaluate_and_fill_csv():
    filled_csv = "data/processed/02.1990_2015_drafts_with_stats.csv"
    data = pd.read_csv(filled_csv)

    # filter the data that dont have Mi_G
    data = data[data['Mi_G'].isna()]

    # # save the data to same csv file    
    data.to_csv("data/processed/02.1.small_batch.csv", index=False)

    # # Now, read again the csv file and add the stats to the original csv file
    data = pd.read_csv("data/processed/02.1990_2015_drafts_with_stats.csv")
    
    # # remove the rows where Mi_G is not nan
    data = data[data['Mi_G'].isna()]

    # # add the stats to the original csv file
    data.to_csv("data/processed/02.1990_2015_drafts_with_stats.csv", index=False)



def main():
    parser = argparse.ArgumentParser(description='Process baseball stats.')
    parser.add_argument('--fill', action='store_true', help='Flag to indicate whether to evaluate the final CSV file.')
    args = parser.parse_args()

    # if fill is true, evaluate and fill the same csv file
    if args.fill:
        evaluate_and_fill_csv()
    # if fill is false, just scrape the data
    else:
        # if the file exists, skip to scraping
        if not os.path.exists(scraped_file):
            # Step 1: Read the CSV file
            csv_file = "data/processed/01.drafted_players_with_baseball_ids.csv"  # Replace with your CSV file name
            original_data = pd.read_csv(csv_file)

            # Assume the CSV has a column 'Slug Path' that contains the URLs to scrape
            if 'Slug Path' not in original_data.columns:
                raise ValueError("The CSV file must contain a 'Slug Path' column.")

            # add new columns to the original data and save the file
            original_data['level'] = None
            original_data['age'] = None
            original_data['age_diff'] = None
            original_data['lg_ID'] = None
            original_data['G'] = None
            original_data['PA'] = None
            original_data['AB'] = None
            original_data['R'] = None
            original_data['H'] = None
            original_data['2B'] = None
            original_data['3B'] = None
            original_data['HR'] = None
            original_data['RBI'] = None
            original_data['SB'] = None
            original_data['CS'] = None
            original_data['BB'] = None
            original_data['SO'] = None
            original_data['batting_avg'] = None
            original_data['onbase_perc'] = None
            original_data['slugging_perc'] = None
            original_data['onbase_plus_slugging'] = None
            original_data['TB'] = None
            original_data['Career_H'] = None
            original_data['Career_AB'] = None
            original_data['Career_R'] = None
            original_data['Career_H'] = None
            original_data['Career_HR'] = None
            original_data['Career_RBI'] = None

            # save the new csv file
            original_data.to_csv(scraped_file, index=False)
        else:
            # read the scraped file
            original_data = pd.read_csv(scraped_file)

        original_data['lg_ID'] = original_data['lg_ID'].astype('object')
        original_data['level'] = original_data['level'].astype('object')

        # Process only the first two rows
        for index, row in tqdm(original_data.iterrows(), total=original_data.shape[0], desc="Scraping URLs"):
            url = row['Slug Path']

            # skip if url is None
            if url is None:
                continue

            # skip if url is nan
            if pd.isna(url):
                continue

            # skip pitchers
            if row['Primary Position'] == 'P':
                continue

            # skip this row if we have already data from minor league stats
            if not pd.isna(row['G']):
                continue

            try:
                # Step 2.1: Send a GET request
                response = fetch_with_proxy(f"https://www.baseball-reference.com/players{url}")
                
                response.raise_for_status()  # Raise an exception for HTTP errors
                
                # Step 2.2: Parse the HTML
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Step 2.3: Extract data (customize this part based on your needs)
                # Example: Extract the title of the page
                # Get the div with ID "inner_nav"
                inner_nav = soup.find('div', id='inner_nav')

                # find in the inner_nav the link that href contains "/register"
                register_link = inner_nav.find('a', href=lambda href: href and '/register' in href)

                # get that href and navigate to it
                register_url = register_link['href']
                response = fetch_with_proxy(f"https://www.baseball-reference.com{register_url}")
                soup = BeautifulSoup(response.text, 'html.parser')

                # find a table with the id "standard_batting"
                standard_batting_table = soup.find('table', id='standard_batting')

                # if the table is not found, continue
                if standard_batting_table is None:
                    continue

                # and get the first row of the tbody
                first_row = standard_batting_table.find('tbody').find('tr')

                # make all those values an object, where the data-stat from each td is the key and the text is the value
                first_row_dict = {td.get('data-stat'): td.text for td in first_row.find_all('td')}

                # Now, need to add this stats to a new file combining the original csv with the new stats
                # the new stats are in first_row_dict
                # the original csv is in data
                # the new file should be called "drafted_players_1990_2015_with_baseball_reference_ids_and_stats.csv"
                # the new file should have the same columns as the original csv plus the new stats
                # the new stats are:
                # level, age, age_diff, lg_ID, G, PA, AB, R, H, 2B, 3B, HR, RBI, SB, CS, BB, SO, BA, OBP, SLG, OPS, TB
                
                # Add new stats to the original DataFrame
                for stat in ['level', 'age', 'age_diff', 'lg_ID', 'G', 'PA', 'AB', 'R', 'H', '2B', '3B', 'HR', 'RBI', 'SB', 'CS', 'BB', 'SO', 'batting_avg', 'onbase_perc', 'slugging_perc', 'onbase_plus_slugging', 'TB']:
                    value = first_row_dict.get(stat, None)
                    
                    if stat == 'lg_ID' or stat == 'level':
                        # Extract lg_ID from the anchor tag
                        value = first_row_dict.get(stat, None)
                        
                        # convert this string to float64
                        value = str(value)    
                        
                        original_data.at[index, stat] = value

                    else:
                        # Check if the value is a valid number before converting
                        if value == '':
                            original_data.at[index, stat] = None
                        
                        else:
                            original_data.at[index, stat] = float(value)
                
                # Get also the careers stats. find in the soup a div with class "stats_pullout"
                stats_pullout = soup.find('div', class_='stats_pullout')
                p1 = stats_pullout.find('div', class_='p1')
                p2 = stats_pullout.find('div', class_='p2')
                p3 = stats_pullout.find('div', class_='p3')

                def extract_career_stats(div, index):
                    for div in div.find_all('div'):
                        # Extract the column name and value
                        column_name = f"Career_{div.find('strong').text}"  # Get the text inside <strong> and prepend "Career_"
                        value = div.find('p').text  # Get the text inside <p>
                        
                        # Check if value is None or NaN, and set to 0 if true
                        if value is None or pd.isna(value) or value == '':
                            original_data.at[index, column_name] = 0
                        else:
                            original_data.at[index, column_name] = float(value)  # Convert to float before storing

                # Extract data from p1, p2, and p3
                extract_career_stats(p1, index)
                extract_career_stats(p2, index)
                extract_career_stats(p3, index)

                # save the new csv file
                original_data.to_csv(scraped_file, index=False)

            except Exception as e:
                print(f"Error scraping {url}: {e} (URL: {url})")
        
        print(f"Scraping completed.")

# Add this block to call the main function
if __name__ == "__main__":
    main()