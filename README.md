# Lightning Network Bulletin Board Server

## Intro

This is an implementation of a bulletin board service over a Lightning Network Node.

The server runs on top of your node and waits for requests from nodes in the network for the bundle of services that it provides. The communication medium is the Lightning Network itself, as each request is a payment containing both the amount (e.g. the service fee) and the corresponding request data.

To consume such services over the network you can use the [Bulletin Board Client](https://github.com/GeorgeTsagk/LN-bulletinboard-client).

Both the server and the client use the [c13n API](https://docs.c13n.io/projects/api/en/latest/) to communicate over the Lightning Network.

## How to use

You need a Lightning node (only `lnd` is supported currently) and deploy the [c13n daemon](https://github.com/c13n-io/c13n-go) on top of it.

This enables a new API for your LN node, which includes data-over-lightning functionality. For more info on **data over Lightning** read [here](https://c13n.io/about/).

After launching the `c13n` daemon rename `config.sample.yaml` to `config.yaml` and fill in the required credentials for connecting to c13n.

> NOTE: Currently the BulletinBoard server doesn't support authentication & TLS over the c13n API, so you will have to comment out the related lines in `c13n-go`'s configuration file.
>
> **Until user authentication and TLS are supported, do not run with remote c13n daemon.**
```yaml
server:
  address: "localhost:9999"
  #tls:
    #cert_path: "./cert/c13n.pem"
    #key_path:  "./cert/c13n.key"
  #user: example
  # bcrypt hash of RPC password
  #pwdhash: replaceme
  graceful_shutdown_timeout: 10
```