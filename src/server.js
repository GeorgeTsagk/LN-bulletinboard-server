const api = require('./config/api-url')
const entry = require('./handlers/entry')

const listChannels = require('./utils/list-channels')

var PROTO_PATH = __dirname + '/rpc/rpc.proto';
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

let serverError = false

const openServer = async () => {
    serverError = false
    console.log("Reading Bulletin Board Items")
    entry.readItems();
    console.log("Openning stream")
    let call = messageClient.SubscribeMessages({});
    call.on("data", (data) => {
        entry.entryPoint(data)
    })
    call.on("error", (err) => {
        serverError = true
        console.log("Subscription Stream Error")
    })
    call.on("status", (s) => {
        console.log(s)
    })
    call.on("end", () => {
        serverError = true
    })
    while(!serverError){
        listChannels.updateChannels()
        await sleep(30000)
    }
    console.log('Server Exit')
}

module.exports = {
    openServer
}