import pandas as pd

data = pd.read_csv("data/processed/1990_2015_drafts_with_stats.csv")

print(data.isnull().sum())