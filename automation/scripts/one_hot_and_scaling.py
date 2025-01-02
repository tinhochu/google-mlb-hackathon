import pandas as pd
from sklearn.preprocessing import StandardScaler

# Load the cleaned dataset
input_file = "data/processed/02.drafted_players_with_stats.csv"  # Replace with your file path
df = pd.read_csv(input_file)

# Define the feature columns
feature_columns = [
    "Mi_G",           # Games played in the minor leagues
    "Mi_PA",          # Plate appearances in the minor leagues
    "Mi_AB",          # At-bats in the minor leagues
    "Mi_H",           # Hits in the minor leagues
    "Mi_HR",          # Home runs in the minor leagues
    "Mi_RBI",         # Runs batted in during the minor leagues
    "Mi_OBP",         # On-base percentage
    "Mi_SLG",         # Slugging percentage
    "Mi_OPS",         # On-base plus slugging percentage
    "Mi_Age",         # Age during minor league performance
    "Height (inches)", # Player height
    "Weight (lbs)",    # Player weight
    "Primary Position", # Player's primary position
    "Mi_League",        # Minor league affiliation
    "Batting Hand",     # Player's batting hand
    "Throwing Hand"     # Player's throwing hand
]

# Select the features
features = df[feature_columns]

# Define categorical and numerical columns
categorical_columns = ["Primary Position", "Mi_League", "Batting Hand", "Throwing Hand"]
numerical_columns = [
    "Mi_G", "Mi_PA", "Mi_AB", "Mi_H", "Mi_HR", "Mi_RBI", 
    "Mi_OBP", "Mi_SLG", "Mi_OPS", "Mi_Age", "Height (inches)", "Weight (lbs)"
]

# One-hot encode categorical columns
features_encoded = pd.get_dummies(features, columns=categorical_columns, drop_first=True)

# Scale numerical columns
scaler = StandardScaler()
features_encoded[numerical_columns] = scaler.fit_transform(features_encoded[numerical_columns])

# Save the fully preprocessed dataset to a CSV file
output_file = "data/datasets/features_encoded_scaled.csv"
features_encoded.to_csv(output_file, index=False)

print(f"One-hot encoded and scaled features dataset created and saved as '{output_file}'.")

# Preview the dataset
print(features_encoded.head())
