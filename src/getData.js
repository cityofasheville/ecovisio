/* eslint-disable no-console */
import callAPI from './callAPI.js';

async function getToken(secrets) {
  const options = {};
  options.url = secrets.api_url + secrets.auth_endpoint;
  options.method = 'post';
  options.body = 'grant_type=client_credentials';
  options.headers = {
    Authorization: `Basic ${secrets.api_key}`, // this key is base64 of username:password
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const x = await callAPI(options);
  return x;
}

async function getSiteList(secParam) {
  const secrets = secParam;
  const options = {};
  options.url = secrets.api_url + secrets.list_sites_endpoint;
  options.method = 'get';
  options.body = null;
  options.headers = {
    Authorization: `Bearer ${secrets.tokenObj.access_token}`,
  };
  const x = await callAPI(options);
  return x;
}

async function getOneSite(site, secParam) {
  const secrets = secParam;
  const options = {};
  const returnObj = {};
  if (secrets.getall) {
    secrets.begin = site.firstData;
  }
  const getparams = new URLSearchParams([
    ['begin', secrets.begin],
    ['end', secrets.end],
    ['step', '15m'],
  ]);
  secrets.paramstring = getparams.toString();

  options.url = `${secrets.api_url + secrets.data_endpoint}/${site.id}?${secrets.paramstring}`;
  options.method = 'get';
  options.body = null;
  options.headers = {
    Authorization: `Bearer ${secrets.tokenObj.access_token}`,
  };
  returnObj.id = site.id;
  returnObj.name = site.name;
  returnObj.latitude = site.latitude;
  returnObj.longitude = site.longitude;
  returnObj.photos = site.photos;

  const results = await callAPI(options);
  returnObj.results = results.map((res) => ({ isoDate: res.isoDate, counts: res.counts }));
  if (site.channels) { // each counter has 4 channels, recursively call
    returnObj.channels = await Promise.all(site.channels.map(
      async (chn) => getOneSite(chn, secrets),
    ));
  }
  return returnObj;
}

async function getData(secParam) {
  const secrets = secParam;
  try {
    if (!secrets.begin) { secrets.begin = `${new Date(new Date().setHours(-24, 0, 0, 0)).toISOString().substring(0, 11)}00:00:00.000`; } // yesterday midnight
    if (!secrets.end) { secrets.end = `${new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 11)}00:00:00.000`; } // today midnight

    secrets.tokenObj = await getToken(secrets);
    const sites = await getSiteList(secrets);
    // console.log("sites", JSON.stringify(sites,null,2));
    const data = await Promise.all(sites.map(async (site) => getOneSite(site, secrets)));
    console.log(`Downloaded ${data.length} Sites`);
    return data;
  } catch (err) {
    console.log(err);
    throw (err);
  }
}

export default getData;
