import pandas as pd

# Load the dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file
df = pd.read_csv(input_file)

# Rename the columns
df.rename(columns={
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

# Save the updated dataset to a new CSV file
df.to_csv(input_file, index=False)

print("Columns renamed successfully.")
print(f"Updated dataset saved to '{input_file}'.")