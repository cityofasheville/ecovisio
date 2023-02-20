const getData = require('./getData');
const loadDb = require('./loadDb');
const getSecrets = require("./getSecrets");
const secrets = require("./secret.noGITHUB.js");

exports.handler = async function handler(event, context, callback) {

  const secrets = await getSecrets("eco-visio");
  if(event.getall) secrets.getall = event.getall;
  if(event.begin) secrets.begin = event.begin;
  if(event.end) secrets.end = event.end;

  const data = await getData(secrets);
  await loadDb(secrets, data);
}
