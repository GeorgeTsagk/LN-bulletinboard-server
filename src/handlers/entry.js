const resp = require('../utils/respond')
const listChannels = require('../utils/list-channels')
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('../config/config-loader')
const items = require('./items')
const channel = require('./channel')

const infoHandler = (disc_id, payload, amtSat) => {
  if (amtSat < 10) return
  let tempItems = []
  items.getItems().forEach((elem) => {
    tempItems.push({
      name: elem.name,
      price: elem.price
    })
  })
  let info = {
    channelBalanceService: config.getConfig().options.activate_channel_balance_service,
    channelBalancePrice: config.getConfig().options.channel_balance_price,
    items: tempItems
  }
  console.log("Responding: ", info)
  resp.respond(disc_id, JSON.stringify(info), 1000)
}

let handlers = {}

const addServiceHandler = (serviceName, handler) => {
  handlers[serviceName] = handler
}

addServiceHandler("info", infoHandler)
addServiceHandler("item", items.itemsHandler)
addServiceHandler("channel", channel.channelHandler)

const entryPoint = (message) => {
  const msg = message?.received_message
  const payload = message?.received_message?.payload
  const disc_id = message?.received_message?.discussion_id
  const amtSat = message?.received_message?.amt_msat / 1000;
  const args = payload.split(" ")
  console.log("Received request:", args)
  console.log("\tfor:", Number(Number(msg.amt_msat) / 1000), "sat")
  if (payload == "") return undefined

  if (args[0] in handlers
    && typeof handlers[args[0]] == "function") {
      handlers[args[0]](disc_id, payload, amtSat)
  }
}

module.exports = {
  entryPoint,
  addServiceHandler
}
