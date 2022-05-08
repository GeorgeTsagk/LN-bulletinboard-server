const fs = require('fs');
const yaml = require('js-yaml')
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const loaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

let doc
let node_url
let mac_path
let tls_path
try {
doc = yaml.load(fs.readFileSync(__dirname + '/../../config.yaml', 'utf8'));
node_url = doc?.lightning?.url
mac_path = doc?.lightning?.macaroon_path
tls_path = doc?.lightning?.tls_path
} catch (e) {
console.log(e);
}

let channels = {}


const packageDefinition = protoLoader.loadSync('src/utils/lightning.proto', loaderOptions);
const lnrpc = grpc.loadPackageDefinition(packageDefinition).lnrpc;
const macaroon = fs.readFileSync(mac_path).toString('hex');
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA';
const lndCert = fs.readFileSync(tls_path);
const sslCreds = grpc.credentials.createSsl(lndCert);
const macaroonCreds = grpc.credentials.createFromMetadataGenerator(function(args, callback) {
  let metadata = new grpc.Metadata();
  metadata.add('macaroon', macaroon);
  callback(null, metadata);
});
let creds = grpc.credentials.combineChannelCredentials(sslCreds, macaroonCreds);
let lightning = new lnrpc.Lightning(node_url, creds);

const updateChannels = () => {
    lightning.listChannels({}, function(err, response) {
        if(err) console.error(err)
        if(response) channels = response
    });
}

module.exports ={
    updateChannels,
    channels
}
