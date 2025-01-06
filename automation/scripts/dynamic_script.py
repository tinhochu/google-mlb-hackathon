import pandas as pd

def remove_column_from_csv(input_file, output_file, column_name):
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    # Remove the specified column
    df.drop(column_name, axis=1, inplace=True)
    
    # Save the modified DataFrame to a new CSV file
    df.to_csv(output_file, index=False)


# df = pd.read_csv('data/output/updated_players.csv')
# df['MLB Debut'] = df['MLB Debut'].apply(lambda x: 0 if x == 'No MLB Debut' else 1)
# df.to_csv('data/output/updated_players.csv', index=False)


# Example usage
remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Last Played Date')
# remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Slug Path')
# remove_column_from_csv('data/output/updated_players.csv', 'data/output/updated_players.csv', 'Second CSV ID')