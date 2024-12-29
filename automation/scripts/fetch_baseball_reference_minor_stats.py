import pandas as pd
import requests
from bs4 import BeautifulSoup

# Step 1: Read the CSV file
csv_file = "data/raw/drafted_players_1990_2015_with_baseball_reference_ids.csv"  # Replace with your CSV file name
data = pd.read_csv(csv_file)

# Assume the CSV has a column 'Slug Path' that contains the URLs to scrape
if 'Slug Path' not in data.columns:
    raise ValueError("The CSV file must contain a 'Slug Path' column.")

# Step 2: Scrape each URL
results = []

# Process only the first two rows
for index, row in data.head(2).iterrows():
    url = row['Slug Path']
    try:
        # Step 2.1: Send a GET request
        response = requests.get(f"https://www.baseball-reference.com/players{url}")
        
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
        response = requests.get(f"https://www.baseball-reference.com{register_url}")
        soup = BeautifulSoup(response.text, 'html.parser')

        # find a table with the id "standard_batting"
        standard_batting_table = soup.find('table', id='standard_batting')

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
        # G, PA, AB, R, H, 2B, 3B, HR, RBI, SB, CS, BB, SO, BA, OBP, SLG, OPS, TB
        
        # Add new stats to the original DataFrame
        for stat in ['G', 'PA', 'AB', ' R', 'H', '2B', '3B', 'HR', 'RBI', 'SB', 'CS', 'BB', 'SO', 'batting_avg', 'onbase_perc', 'slugging_perc', 'onbase_plus_slugging', 'TB']:
            data.at[index, stat] = first_row_dict.get(stat, None)
        
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
                
                # Add the extracted data to the DataFrame
                data.at[index, column_name] = value  # Assuming you want to store it in the same DataFrame

        # Extract data from p1, p2, and p3
        extract_career_stats(p1, index)
        extract_career_stats(p2, index)
        extract_career_stats(p3, index)

    except Exception as e:
        print(f"Error scraping {url}: {e}")
        results.append({
            'url': url,
            'title': f"Error: {e}",
        })
# rename the columns to the new stats
data.rename(columns={
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
output_file = "data/processed/drafted_players_1990_2015_with_baseball_reference_ids_and_stats.csv"
data.to_csv(output_file, index=False)

print(f"Scraping completed. Results saved to {output_file}.")
