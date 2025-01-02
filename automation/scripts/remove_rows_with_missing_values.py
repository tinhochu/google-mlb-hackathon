import pandas as pd

# Load the dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file
df = pd.read_csv(input_file)

# Remove rows where 'G' column has missing values
df_cleaned = df.dropna(subset=["G"])

# Save the cleaned dataset to a new CSV file
output_file = "data/processed/02.drafted_players_with_stats.csv"
df_cleaned.to_csv(output_file, index=False)

print(f"Rows with missing values in the 'G' column have been removed.")
print(f"Cleaned dataset saved to '{output_file}'.")