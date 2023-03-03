const getData = require('./getData');
const loadDb = require('./loadDb');
const getSecrets = require("./getSecrets");

exports.handler = async function handler(event, context, callback) {
  try {
    const secrets = await getSecrets("eco-visio");
    if(event.getall) secrets.getall = event.getall;
    if(event.begin) secrets.begin = event.begin;
    if(event.end) secrets.end = event.end;
    const data = await getData(secrets);
    const insertCount = await loadDb(secrets, data);
    return {
      statusCode: 200,
      body: {
        lambda_output: `${insertCount} rows loaded.`,
      },
    };
  } catch(err) {
    return {
      statusCode: 500,
      body: {
        lambda_output: err.toString(),
      },
    };
  }
}
