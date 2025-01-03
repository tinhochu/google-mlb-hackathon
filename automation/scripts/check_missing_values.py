import pandas as pd

# Load the dataset
df = pd.read_csv("data/processed/01.drafted_players.csv")

# Check for missing values in each column
missing_values = df.isnull().sum()

missing_columns = missing_values[missing_values > 0]

print("Columns with Missing Values:")
print(missing_columns)
