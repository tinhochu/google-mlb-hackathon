import pandas as pd

def remove_column_from_csv(input_file, output_file, column_name):
    # Read the CSV file
    df = pd.read_csv(input_file)
    
    # Remove the specified column
    df.drop(column_name, axis=1, inplace=True)
    
    # Save the modified DataFrame to a new CSV file
    df.to_csv(output_file, index=False)

# Example usage
# remove_column_from_csv('data/output/final.drafted_players.csv', 'data/output/final.drafted_players.csv', 'Stats Fetched')
remove_column_from_csv('data/output/final.drafted_players.csv', 'data/output/final.drafted_players.csv', 'stats_available')
