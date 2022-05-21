const resp = require('../utils/respond')
const config = require('../config/config-loader')

let items = {}
items = config.getConfig().items
console.log("Successfully read items: \n", items)

const getItems = () => {
    return items
}

const itemsHandler = (disc_id, payload, amtSat) => {
    let args
    let itemName = ""
    if (payload.startsWith("{")) {
        const msgObj = JSON.parse(payload)
        args = msgObj.c.split(" ")
        itemName = args[1]
    } else {
        args = payload.split(" ")
        itemName = args[1]
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
    itemsHandler,
    getItems
}