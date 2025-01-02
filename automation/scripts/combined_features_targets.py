import pandas as pd

# Load the features and targets datasets
features_file = "data/datasets/features_encoded_scaled.csv"  # Replace with your features file path
binary_target_file = "data/datasets/binary_target.csv"       # Replace with your binary target file path
regression_target_file = "data/datasets/regression_targets.csv"  # Replace with your regression targets file path

# Load datasets
features = pd.read_csv(features_file)
binary_target = pd.read_csv(binary_target_file)
regression_targets = pd.read_csv(regression_target_file)

# Combine features and targets into one DataFrame
combined_data = pd.concat([features, binary_target, regression_targets], axis=1)

# Save the combined dataset
output_file = "data/datasets/combined_features_targets.csv"
combined_data.to_csv(output_file, index=False)

print(f"Features and targets combined and saved as '{output_file}'.")

# Preview the combined dataset
print(combined_data.head())
