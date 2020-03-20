import pandas as pd
import numpy as np
import json
import os


df = pd.read_csv("modified_res.csv")
df = df[pd.notna(df['lat'])]

outerlist = []
print(df.columns)
def applyfun(r):
    if r["lng"] == " " or pd.isna(r["text"]): 
        return "done"
    print("r is ,",r)
    propdict= dict(text=r["text"],url=r["url"])
    ## order is long lat
    geodict = dict(type="Point",coordinates=[r["lng"].strip(),r["lat"].strip()])

    outerlist.append(dict(
        type="Feature",
        properties=propdict,
        geometry=geodict
    ))
    return "done"

df.apply(applyfun,axis=1)
## make outerlist into full geojson
geo = dict(type="FeatureCollection",features=outerlist)
print(json.dumps(geo)[6000-20:6010])
with open("geo_json.json","w") as phile:
    phile.write(json.dumps(geo))