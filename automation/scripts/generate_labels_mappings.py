import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Path to the dataset used for training
input_file = 'data/output/updated_players.csv'

# Load the dataset
df = pd.read_csv(input_file)

# Specify the categorical columns
categorical_cols = ['Primary Position', 'Batting Hand', 'Throwing Hand', 'Draft Team']

# Initialize a dictionary to store label mappings
label_mappings = {}

# Generate and save mappings for each categorical column
for col in categorical_cols:
    # Check if the column exists in the dataset
    if col in df.columns:
        label_encoder = LabelEncoder()
        df[col] = label_encoder.fit_transform(df[col])
        
        # Create a DataFrame for the mapping
        mapping_df = pd.DataFrame({
            'Original Value': label_encoder.classes_,
            'Encoded Value': range(len(label_encoder.classes_))
        })
        
        # Save the mapping to a CSV file
        mapping_file = f'data/output/{col}_mapping.csv'
        mapping_df.to_csv(mapping_file, index=False)
        
        # Store the mapping in the dictionary for reference
        label_mappings[col] = mapping_df
        
        print(f"Mapping for '{col}' saved to {mapping_file}")
    else:
        print(f"Column '{col}' not found in the dataset.")

print("Label mappings generated successfully!")
