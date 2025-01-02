import pandas as pd

# Load the dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file
df = pd.read_csv(input_file)

# Calculate the mean of the 'age_diff' column
age_diff_mean = df["age_diff"].mean()

# Fill missing values in 'age_diff' with the mean
df["age_diff"].fillna(age_diff_mean, inplace=True)

# Save the updated dataset to a new CSV file

df.to_csv(input_file, index=False)

print(f"Missing values in 'age_diff' have been filled with the mean: {age_diff_mean:.2f}")
print(f"Updated dataset saved to '{input_file}'.")
