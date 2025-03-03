# ecovisio
Connect to Eco-Visio API and load pedestrian and bicycle counts into db.

Run daily to pull bicycle and pedestrian counts and load them into database.

Plan is to publicly display on a dashboard.

## Date parameters:
Run without parameters for yesterday's data.
These parameters can be added to Lambda in test mode:
#### Set specific start or end date 
{
  "begin": "2023-02-17T00:00:00.000Z",
  "end":   "2023-02-18T00:00:00.000Z"
}
#### If getall, begin date is set to firstData for each counter. For initial load.
{
  "getall": true
}

## Secrets
The secret eco-visio is added to AWS Secrets Manager
{
  "api_url": "https://apieco.eco-counter-tools.com/",
  "auth_endpoint": "token",
  "api_key": '',
  "list_sites_endpoint": "api/1.0/site",
  "data_endpoint": "api/1.0/data/site",
  "db_host": "",
  "db_user": "",
  "db_port": "5432",
  "db_password": "",
  "db_database": "",
}

## deploy
A file named .env is required in the root dir. The format required is shown in env.example.

### Commands
First run ```npm install```

- Test Locally: 
  - ```npm start``` (or for a Python program: ```npm run startpy```)
- Deploy: 
  - ```npm run deploy```
- Destroy: (removes all objects from AWS)
  - ```npm run destroy```
- Clean: 
  - ```npm run clean``` (removes local temp files)

The Deploy/Destroy commands use the name of the active GitHub branch when creating AWS resources.
For example, if the active GitHub branch is "feature" and the name of the resource is "template", the resource is named "template_feature". For API gateway domains, it's "feature-template.ashevillenc.gov". Production (or main) branches do not get a prefix/suffix.

