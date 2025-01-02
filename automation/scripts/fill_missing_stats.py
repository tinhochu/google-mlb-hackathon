import pandas as pd

# Load the dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file
df = pd.read_csv(input_file)

# Columns to fill with 0
columns_to_fill = [
    "batting_avg", 
    "onbase_perc", 
    "slugging_perc", 
    "onbase_plus_slugging",
    "Career_H", 
    "Career_AB", 
    "Career_R", 
    "Career_HR", 
    "Career_RBI", 
    "Career_WAR", 
    "Career_BA", 
    "Career_SB", 
    "Career_OBP", 
    "Career_SLG", 
    "Career_OPS", 
    "Career_OPS+"
]

# Fill missing values in the specified columns with 0
df[columns_to_fill] = df[columns_to_fill].fillna(0)

# Save the updated dataset to a new CSV file
df.to_csv(input_file, index=False)

print(f"Missing values in {columns_to_fill} have been filled with 0.")
print(f"Updated dataset saved to '{input_file}'.")
