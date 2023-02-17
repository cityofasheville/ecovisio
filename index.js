const getData = require('./getData');
const getSecrets = require("./getSecrets");
const secrets = require("./secret.noGITHUB.js");

// exports.handler = async function handler(event, context, callback) 

async function x() {
  // console.log("event", event);

  // const secrets = await getSecrets("eco-visio");


  let data = await getData(secrets);
  // let db_result;
  // if(newPayroll === undefined) {
  //     db_result = {"recordsets": [],"output": {},"rowsAffected": [0]};
  // }else{
  //     db_result = await payroll_db(newPayroll, secrets);
  // }

  console.log(JSON.stringify(data,null,2));
}

x()
