import csv

def get_closest_id_by_draft_year(csv1_path, csv2_path, output_path):
    # Read the second CSV into a dictionary with player names as keys and their data as a list
    second_csv_dict = {}
    with open(csv2_path, 'r') as file2:
        reader = csv.reader(file2)
        for row in reader:
            if len(row) > 2:  # Ensure there is enough data
                player_id, player_name, years = row[0], row[1], row[2]
                try:
                    start_year = int(years.split('-')[0])
                except ValueError:
                    start_year = None
                if player_name not in second_csv_dict:
                    second_csv_dict[player_name] = []
                second_csv_dict[player_name].append((player_id, start_year))

    # Process the first CSV and match players based on the closest year
    output_rows = []
    with open(csv1_path, 'r') as file1:
        reader = csv.reader(file1)
        header = next(reader)  # Read header
        header.append('Second CSV ID')  # Add new column for output
        header.append('Slug Path')  # Add new column for slug path
        output_rows.append(header)

        for row in reader:
            player_name = row[1]  # Assuming Player Name is the second column
            draft_year = int(row[2]) if row[2].isdigit() else None
            
            matching_id = ""
            slug_path = ""
            if player_name in second_csv_dict and draft_year is not None:
                # Find the closest year after the draft year
                candidates = [entry for entry in second_csv_dict[player_name] if entry[1] and entry[1] >= draft_year]
                if candidates:
                    closest_entry = min(candidates, key=lambda x: x[1])
                    matching_id = closest_entry[0]
                    # Generate slug path
                    last_name_initial = player_name.split()[-1][0].lower()  # Get the first letter of the last name
                    slug_path = f"/{last_name_initial}/{matching_id}.shtml"

            row.append(matching_id)
            row.append(slug_path)
            output_rows.append(row)

    # Write the output to a new CSV
    with open(output_path, 'w', newline='') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(output_rows)

# Paths to your CSV files
csv1_path = 'data/raw/drafted_players_1990_2015.csv'  # Replace with your actual file path
csv2_path = 'data/raw/br_players_list.csv'  # Replace with your actual file path
output_path = 'data/processed/01.drafted_players_with_baseball_ids.csv'  # Replace with your desired output file path

# Run the function
get_closest_id_by_draft_year(csv1_path, csv2_path, output_path)

print(f"Output saved to {output_path}")
