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
- Test locally: npm start (Notice the database calls are idempotent so they can be tested without breaking anything.)
- Deploy: npm run deploy
- Clean: npm run clean (removes local temp files)
- Destroy: npm run destroy (removes all objects from AWS)

