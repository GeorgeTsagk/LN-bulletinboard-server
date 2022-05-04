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
    console.log("Attempting response")
    await delay(1000)
    messageClient.sendMessage(
        {
            discussion_id: parseInt(id),
            payload: JSON.stringify(
                text.toString()
            ),
            amt_msat: parseInt(amt_msat)
        },
        (err, res) => {
	    console.log("In callback")
            if(err) console.log(err)
            if(res) console.log(res)
        }
    )
}

module.exports = {
    respond
}
