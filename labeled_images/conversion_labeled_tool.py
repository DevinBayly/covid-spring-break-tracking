## this script changes the results in result.json to a file that has gps data for kiri
import subprocess as sp
import json
import pandas as pd

with open("../results.json","r") as phile:
    contents = json.loads(phile.read())



i = 0
for ele in contents:
    if ele.get("filename",-1) == -1:
        continue
    image_name = ele["filename"]
    res = sp.run("identify -verbose /home/lil/Documents/mona_public_health_project/labeled_images/{} | grep GPS.*".format(image_name),shell=True,stdout=sp.PIPE)
    ele["GPSdata"]= res.stdout.decode()
    print("gps data ",ele["GPSdata"])
    i+=1


## update the gps elements

df = pd.DataFrame(contents)
print(df)
df.to_csv("covid_data_for_map.csv",index=False)