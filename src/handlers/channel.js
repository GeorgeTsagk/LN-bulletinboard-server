const resp = require('../utils/respond')
const listChannels = require('../utils/list-channels')
const config = require('../config/config-loader')

const channelHandler = (disc_id, payload, amtSat) => {
    const args = payload.split(" ")
    if (amtSat < Number(config.getConfig().options.channel_balance_price)) {
        console.log("Insufficient amount")
        return
    }
    if (args[1] == undefined) {
        console.log("No address provided")
        return
    }
    let channel_local = 0
    listChannels.getChannels().channels.forEach((elem) => {
        if (elem.remote_pubkey == args[1]) channel_local += Number(elem.local_balance)
    })
    if (channel_local == 0) {
        console.log("No channel with peer")
        return
    }
    resp.respond(disc_id, String(channel_local), 1000)
}

module.exports = {
    channelHandler
}