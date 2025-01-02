import pandas as pd

# Load the dataset
df = pd.read_csv("data/processed/02.drafted_players_with_stats.csv")

# Check for missing values in each column
missing_values = df.isnull().sum()

missing_columns = missing_values[missing_values > 0]

print("Columns with Missing Values:")
print(missing_columns)
