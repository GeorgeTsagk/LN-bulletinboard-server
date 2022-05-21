const resp = require('../utils/respond')
const listChannels = require('../utils/list-channels')
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('../config/config-loader')

let items = {}

const readItems = () => {
  items = config.getConfig().items
  console.log("Successfully read items: \n", items)
}

const entryPoint = (message) => {
  const msg = message?.received_message
  const payload = msg?.payload
  const disc_id = msg.discussion_id
  const amtSat = msg?.amt_msat / 1000;
  const args = payload.split(" ")
  console.log("Received request:", args)
  console.log("\tfor:", Number(Number(msg.amt_msat) / 1000), "sat")
  if (payload == "") return undefined
  switch (args[0]) {
    case 'channel':
      if(amtSat < Number(config.getConfig().options.channel_balance_price)) {
        console.log("Insufficient amount")
        return
      }
      if(args[1] == undefined){
        console.log("No address provided")
        return
      }
      let channel_local = 0
      listChannels.getChannels().channels.forEach((elem) => {
        if (elem.remote_pubkey == args[1]) channel_local += Number(elem.local_balance)
      })
      if(channel_local == 0) {
        console.log("No channel with peer")
        return
      }
      resp.respond(disc_id, String(channel_local), 1000)
      break;
    case 'info':
      if(amtSat < 10) return
      let tempItems = []
      items.forEach((elem) => {
        tempItems.push({
          name: elem.name,
          price: elem.price
        })
      })
      let info = {
        channelBalanceService:  config.getConfig().options.activate_channel_balance_service,
        channelBalancePrice:    config.getConfig().options.channel_balance_price,
        items: tempItems
      }
      console.log("Responding: ", info)
      resp.respond(disc_id, JSON.stringify(info), 1000)
  }
  let itemName = ""
  if (payload.startsWith("{")) {
    const msgObj = JSON.parse(payload)
    itemName = msgObj.c
  } else {
    itemName = payload
  }
  let selectedItem = {}
  items.forEach((el) => {
    if (el.name == itemName) {
      selectedItem = el
    }
  })
  if (amtSat >= Number(selectedItem.price)) {
    resp.respond(disc_id, selectedItem.content, 1000)
  }
}


module.exports = {
  entryPoint,
  readItems
}

