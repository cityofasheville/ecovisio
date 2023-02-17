const fetch = require("node-fetch"); // using "npm install node-fetch@2" for now to avoid ES Modules

async function getToken(secrets) {
  let response = await fetch(secrets.api_url + secrets.auth_endpoint, {
    method: 'POST',
    body: `grant_type=client_credentials`,
    headers: {
      'Authorization': 'Basic ' + secrets.api_key, //this key is base64 of username:password
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  let json;
  if (!response.ok) {
    throw new Error(`HTTP error fetching token. status: ${response.status}`);
  } else {
    json = await response.json();
    return json;
  }
}

async function getCounts(secrets) {
  try {
    let startdate = new Date(new Date().setHours(-24, 0, 0, 0)).toISOString().substring(0, 11) + '00:00:00.000'; // yesterday midnight
    let enddate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substring(0, 11) + '00:00:00.000'; // today midnight

    let tokenObj = await getToken(secrets);

    let response = await fetch(secrets.api_url + secrets.list_sites_endpoint, {
      method: 'GET',
      headers: { 
        'Authorization': 'Bearer ' + tokenObj.access_token
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error. status: ${response.status}`)
    } else {
      let data = await response.json()
      console.log( data[0].id)
      return data
    }
  } catch (err) {
    console.log(err)
  }

        // if (startdate && enddate) {
      //   let querystring = '?FromDate=' + startdate + '&ToDate=' + enddate
      //   apiurl = apiurl.concat(querystring)
      // }
}

module.exports = getCounts
