import pandas as pd

# Load the dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file
df = pd.read_csv(input_file)

# Fill missing 'Birth State/Province' with the value from 'Birth City'
df["Birth State/Province"].fillna(df["Birth City"], inplace=True)

# Save the updated dataset to a new CSV file
output_file = "data/processed/02.drafted_players_with_stats.csv"
df.to_csv(output_file, index=False)

print("Missing 'Birth State/Province' values have been filled with 'Birth City'.")
print(f"Updated dataset saved to '{output_file}'.")
