from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os
from utils.proxy_scraper import fetch_with_proxy

load_dotenv()


mongo_uri = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(mongo_uri)
db = client["mlbHackathon"] # Replace with your database name
collection = db["seasonLeagueStats"] # Replace with your collection name

# Example: Insert Data
def insert_stats(data):
    """
    Insert league stats into MongoDB.

    Args:
        data (list of dict): List of league stats dictionaries.
    """
    result = collection.insert_many(data)
    print(f"Inserted {len(result.inserted_ids)} documents.")

# Example: Fetch Data
def fetch_all_stats():
    """
    Fetch all league stats from MongoDB.
    """
    stats = list(collection.find())
    for stat in stats:
        print(stat)

# Example Usage
if __name__ == "__main__":
    # Iterate from 1990 to 2015, 
    for year in range(1990, 2016):
        url = f"https://www.baseball-reference.com/register/league.cgi?year={year}"
        response = fetch_with_proxy(url)

        soup = BeautifulSoup(response.text, 'html.parser')

        # # find the table with the id "league_batting"
        table = soup.find('table', id='league_batting')

        # Initialize a list to hold all documents for the current year
        documents = []
        ranker = None  # Initialize ranker before the loop
        for row in table.find('tbody').find_all('tr'):
            # bail early if this row doesn't have data attribute or has spacer class
            if 'spacer' in row.get('class', []):
                continue

            document = {}

            for index, column in enumerate(row.find_all(recursive=False)):
                data_stat = column.get('data-stat', None)  # Get data-stat once
                
                key = None
                value = None

                if index == 0:
                    ranker = column.text
                elif index == 1:
                    key = data_stat
                    value = column.find('a').text.replace(u'\xa0', u' ') if column.find('a') else None
                else:
                    key = data_stat
                    value = column.text.replace(u'\xa0', u' ')

                # Convert value to float if it's a number, otherwise keep it as is
                if value is not None:
                    try:
                        value = float(value)  # Attempt to convert to float
                    except ValueError:
                        pass  # If conversion fails, keep the original string value

                if key is not None:  # Check if key is not None before adding to document
                    document[key] = value
                
                document['ranker'] = float(ranker) if ranker is not None else None
                document['year'] = float(year)
            
            documents.append(document)

        insert_stats(documents)
