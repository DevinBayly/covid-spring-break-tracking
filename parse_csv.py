import requests
import json
import subprocess as sp
import re
import time

padleturl = "https://padlet.com/manand2/5jfh0gizfg6y"
padletapi = "dd294c35ed781b84fa91c9042742e7d72aa30c322777552b1351c5bfd4bd5362"

with open("Padlet - COVID19 Public Health in Action.csv","r") as phile:
    contents = phile.read()

images = []
for line in contents.split("\n"):
    if "div" in line:
        info_front = line.find("<div>")
        info_end = line.find("</div>")
        text = line.split(",")[0] +"--"+ re.sub("\<.*?\>","",line[info_front:info_end])
    else :
        text = line.split(",")[0]
    http_front = line.find("https:")
    http_end = line[http_front:].find(",")
    image_url = line[http_front:http_end+http_front]
    images.append(dict(url = image_url,text = text))

print(images)



    

i = 0
for image in images:
    if "https" in image["url"]:
        print("starting",image)
        req = requests.get(image["url"],allow_redirects= True)
        file_type = image["url"].split(".")[-1]
        with open("image{}.{}".format(i,file_type),"wb") as phile:
            phile.write(req.content)
        ## include the gps scraper
        res = sp.run("identify -verbose /home/lil/Documents/mona_public_health_project/image{}.{} | grep GPS.*".format(i,file_type),shell=True,stdout=sp.PIPE)
        image["GPSdata"]= res.stdout.decode()
        image["filename"] = "image{}.{}".format(i,file_type)
        time.sleep(2)
        print("complete",image)
        i+=1


with open("results.json","w") as phile:
    phile.write(json.dumps(images))

print("done overall")