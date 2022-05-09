const api = require('../config/api-url')
var PROTO_PATH = __dirname + '/../rpc/rpc.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var services = grpc.loadPackageDefinition(packageDefinition).services;

var messageClient = new services.MessageService(api.apiUrl(), grpc.credentials.createInsecure())

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const respond = async (id, text, amt_msat) => {
    await delay(1000)
    messageClient.sendMessage(
        {
            discussion_id: parseInt(id),
            payload: text.toString(),
            amt_msat: parseInt(amt_msat)
        },
        (err, res) => {
            if(err) console.log(err)
            if(res){ 
                console.log("Delivered Response for:")
                console.log("\tamt_msat: ", Number(res.sent_message.amt_msat))
                console.log("\ttotal_fees_msat: ", Number(res.sent_message.total_fees_msat))
            }
        }
    )
}

module.exports = {
    respond
}
