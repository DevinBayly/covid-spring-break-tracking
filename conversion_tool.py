## this script changes the results in result.json to a file that has gps data for kiri
import pandas as pd

import json

with open("results.json","r") as phile:
    contents = json.loads(phile.read())

df = pd.DataFrame(contents)
print(df)
df.to_csv("covid_data_for_map.csv",index=False)