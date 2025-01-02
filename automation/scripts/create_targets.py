import pandas as pd

# Load the cleaned dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file path
df = pd.read_csv(input_file)

# Define target columns
binary_target = "MLB Debut"  # For binary classification (MLB debut prediction)
regression_targets = ["Career_WAR", "Career_BA", "Career_OBP"]  # For career impact prediction

# Extract target variables
y_binary = df[binary_target].notnull().astype(int)  # Convert MLB debut to 1 (debuted) or 0 (not debuted)
y_regression = df[regression_targets]

# Check for missing values in regression targets
print("Missing values in regression targets:")
print(y_regression.isnull().sum())

# Fill missing values for regression targets (if needed)
y_regression = y_regression.fillna(0)  # Example: fill with 0s or choose another strategy

# Save the target datasets
y_binary.to_csv("data/datasets/binary_target.csv", index=False, header=["MLB_Debut"])
y_regression.to_csv("data/datasets/regression_targets.csv", index=False)

print("Target datasets created and saved as 'binary_target.csv' and 'regression_targets.csv'.")
