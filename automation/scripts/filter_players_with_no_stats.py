import pandas as pd

# Read the CSV file
df = pd.read_csv('data/raw/drafted_players_1990_2015.csv')

# Filter the DataFrame where the first column is False
filtered_df = df[df['stats_available'] == True]

# Save the filtered DataFrame to a new CSV file
filtered_df.to_csv('data/processed/01.drafted_players.csv', index=False)
