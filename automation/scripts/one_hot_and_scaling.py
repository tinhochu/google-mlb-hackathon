import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler, LabelEncoder

def remove_column_from_csv(input_file, output_file, column_name):
    # Read the CSV file
    df = pd.read_csv(input_file)

    # check if the Column Exists
    if column_name in df.columns:
        # Remove the specified column
        df.drop(column_name, axis=1, inplace=True)
        
        # Save the modified DataFrame to a new CSV file
        df.to_csv(output_file, index=False)
    else:
        print(f"Column '{column_name}' not found in the CSV file.")

# Remove the columns
remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Last Played Date')
remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Slug Path')
remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Second CSV ID')

# Load the cleaned dataset
input_file = "data/output/updated_players.csv"  # Replace with your file path
df = pd.read_csv(input_file)

# Replace "No MLB Debut" with 0, and others with 1
df['MLB Debut'] = df['MLB Debut'].apply(lambda x: 0 if x == 'No MLB Debut' else 1)

# Initialize encoders and scaler
label_encoder = LabelEncoder()
scaler = StandardScaler()

# Handle categorical columns
categorical_cols = ['Primary Position', 'Batting Hand', 'Throwing Hand', 'Draft Team']

# Initialize a dictionary to store label mappings
label_mappings = {}

for col in categorical_cols:
    if df[col].dtype == 'object':  # Encode only if column contains strings
        df[col] = label_encoder.fit_transform(df[col])
        # Save the label mapping for the current column
        label_mappings[col] = dict(zip(label_encoder.classes_, range(len(label_encoder.classes_))))

# Save the label mappings to a CSV file
label_mappings_df = pd.DataFrame(dict([(k, pd.Series(v)) for k,v in label_mappings.items()]))
label_mappings_df.to_csv('data/output/label_mappings.csv', index=False)

# Remove the 'Draft Round' column
df.drop(['Draft Round'], axis=1, inplace=True)

# Replace problematic ERA values and convert to numeric
df['ERA'] = df['ERA'].replace({'-.--': '0', '--': '0'})
df['ERA'] = pd.to_numeric(df['ERA'], errors='coerce')

# Replace problematic WHIP values and convert to numeric
df['WHIP'] = df['WHIP'].replace({'-.--': '0', '--': '0'})
df['WHIP'] = pd.to_numeric(df['WHIP'], errors='coerce')

# Handle missing values in Career_H
df['Career_H'] = df['Career_H'].fillna(0)

# Scale numerical columns
numerical_cols = ['Height (inches)', 'Weight (lbs)', 'Pick Overall', 'G', 'AB', 'H', 'AVG', 'WHIP', 'ERA']
df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

# Drop irrelevant columns
df.drop(['Player Name', 'Player ID'], axis=1, inplace=True)

#Change Height and Weigth Columns names
df.rename(columns={'Height (inches)': 'Height', 'Weight (lbs)': 'Weight', 'Career_OPS+': 'Career_OPS_Plus'}, inplace=True)

# Change the Column Names to NOT have spaces
df.columns = df.columns.str.replace(' ', '_')

# save the datasets
df.to_csv('data/output/updated_players_scaled.csv', index=False)

# Split data into features and target
X = df.drop('MLB_Debut', axis=1)  # Features
y = df['MLB_Debut']  # Target

# Handle missing values in X
X.fillna(X.median(), inplace=True)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the logistic regression model
model = LogisticRegression(solver='saga',max_iter=5000, penalty='l2', C=1.0)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
