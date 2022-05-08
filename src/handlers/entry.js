const resp = require('../utils/respond')
var http = require('https');
const yaml = require('js-yaml')
const fs = require('fs')

let items = {}

const readItems = () => {
  let doc
  try {
    doc = yaml.load(fs.readFileSync(__dirname + '/../../config.yaml', 'utf8'));
    items = doc?.items
    console.log("Successfully read items: \n", items)
  } catch (e) {
    console.log(e);
  }
}

const entryPoint = (message) => {
    const msg = message?.received_message
    const payload = msg?.payload
    const disc_id = msg.discussion_id
    const amtSat = msg?.amt_msat / 1000;
    console.log("Received request:", payload)
    console.log("\tfor:", Number(Number(msg.amt_msat)/1000), "sat")
    let itemName = ""
    if(payload.startsWith("{")) {
      const msgObj = JSON.parse(payload)
      itemName = msgObj.c
    } else {
      itemName = payload
    }
    let selectedItem = {}
    items.forEach( (el) => {
      if (el.name == itemName) {
        selectedItem = el
      }
    })
    if(amtSat >= Number(selectedItem.price)) {
      resp.respond(disc_id, selectedItem.content, 1000)
    }
}

module.exports ={
    entryPoint,
    readItems
}
  
