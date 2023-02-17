const callAPI = require("./callAPI");

async function getToken(secrets) {
  let options = {};
  options.url = secrets.api_url + secrets.auth_endpoint;
  options.method = 'post';
  options.body = 'grant_type=client_credentials';
  options.headers = {
    'Authorization': 'Basic ' + secrets.api_key, //this key is base64 of username:password
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  return await callAPI(options);
}

async function getSiteList(secrets) {
  let options = {};
  options.url = secrets.api_url + secrets.list_sites_endpoint;
  options.method = 'get';
  options.body = null;
  options.headers = {
    'Authorization': 'Bearer ' + secrets.tokenObj.access_token
  };
  return await callAPI(options);
}

async function getOneSite(site, secrets) {
  let options = {};
  let returnObj = {};
  if (secrets.getall) {
    secrets.begin = site.firstData;
  }
  getparams = new URLSearchParams([
    ['begin', secrets.begin],
    ['end', secrets.end],
    ['step', '15m'],
  ]);
  secrets.paramstring = getparams.toString();

  options.url = secrets.api_url + secrets.data_endpoint + '/' + site.id + '?' + secrets.paramstring;
  options.method = 'get';
  options.body = null;
  options.headers = {
    'Authorization': 'Bearer ' + secrets.tokenObj.access_token
  };
  returnObj.id = site.id;
  returnObj.name = site.name;
  returnObj.latitude = site.latitude;
  returnObj.longitude = site.longitude;
  returnObj.photos = site.photos;

  let results = await callAPI(options);
  returnObj.results = results.map(res => { return { isoDate: res.isoDate, counts: res.counts }; });
  if(site.channels) { // each counter has 4 channels, recursively call
    returnObj.channels = await Promise.all(site.channels.map(async chn => {
      return getOneSite(chn, secrets);
    }));
  }
  return returnObj;
}

async function getData(secrets) {
  try {
    if (!secrets.begin) { secrets.begin = new Date(new Date().setHours(-24, 0, 0, 0)).toISOString().substring(0, 11) + '00:00:00.000' }; // yesterday midnight
    if (!secrets.end) { secrets.end = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 11) + '00:00:00.000' }; // today midnight

    secrets.tokenObj = await getToken(secrets);
    let sites = await getSiteList(secrets);
    // console.log("sites", JSON.stringify(sites,null,2));
    let data = await Promise.all(sites.map(async site => {
      return getOneSite(site, secrets);
    }));
    return data;
  } catch (err) {
    console.log(err)
  }
}

module.exports = getData
