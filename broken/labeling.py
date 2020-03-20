import os

os.chdir("/home/lil/Documents/mona_public_health_project/broken")
command = 'exif -gpslatitude="{0}" -gpslatituderef="{0}" -gpslongitude="{1}" -gpslongituderef="{1}" "{2}"'
os.listdir()
for f in os.listdir():
    os.system("eog {}".format(f))
    lat = input("lat")
    lng = input("lng")
    os.system(command.format(lat,lng,"fix"+f))

