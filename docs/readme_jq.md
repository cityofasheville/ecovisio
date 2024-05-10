## Using jq command line to flatten data

cat xxxdata.json | jq '.[] | {id, name, latitude, longitude, isodate: .results[].isoDate, counts: .results[].counts } ' > res.json

cat xxxdata.json | jq '.[] | {id, name, latitude, longitude, photos } ' > res.json