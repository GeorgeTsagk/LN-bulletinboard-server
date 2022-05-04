const api = require('./config/api-url')
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

const server = require('./server')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

var nodeInfoClient = new services.NodeInfoService(api.apiUrl(), grpc.credentials.createInsecure())


nodeInfoClient.GetSelfInfo(
    {},
    (err, res) => {
        console.log('err:', err)
        console.log('res:', res)
    }
)

const start = async () => {
    while(true){
        await sleep(1000)
        try{
            await server.openServer()
        } catch (e) { 
            console.log(e)
        }
    }
}

start()

