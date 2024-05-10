import getData from './getData.js';
import loadDb from './loadDb.js';
import getSecrets from './getSecrets.js';

export async function handler(event) {
  try {
    const secrets = await getSecrets('eco-visio');
    if (event.getall) secrets.getall = event.getall;
    if (event.begin) secrets.begin = event.begin;
    if (event.end) secrets.end = event.end;
    if (event.local) secrets.db_host = 'localhost';
    // console.log(secrets);
    const data = await getData(secrets);
    const insertCount = await loadDb(secrets, data);
    return {
      statusCode: 200,
      body: {
        lambda_output: `${insertCount} rows loaded.`,
      },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: {
        lambda_output: err.toString(),
      },
    };
  }
}
