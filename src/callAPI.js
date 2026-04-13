// Generic API call
// Assumes API will return JSON
async function callAPI(options) {
  try {
    let response = await fetch(options.url, {
      method: options.method,
      body: options.body,
      headers: options.headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error. status: ${response.status}`);
    } else {
      let data = await response.json();
      return data;
    }
  } catch (err) {
    console.log(err);
    throw (err);
  }
}

export default callAPI;


/*
let url = "https://httpbin.org/post";
let method = 'post';
let body = JSON.stringify({a: 1});
let headers = {'Content-Type': 'application/json'};
callAPI({
  url,
  method,
  body,
  headers
})
*/