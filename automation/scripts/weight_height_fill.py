import pandas as pd

df = pd.read_csv("data/processed/01.drafted_players.csv")


# Calculate the mean for Height and Weight
mean_height = round(df['Height (inches)'].mean(), 2)
mean_weight = round(df['Weight (lbs)'].mean(), 2)

# Fill missing values with the mean
df['Height (inches)'].fillna(mean_height, inplace=True)
df['Weight (lbs)'].fillna(mean_weight, inplace=True)

df.to_csv("data/processed/01.drafted_players.csv", index=False)