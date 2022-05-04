# Lightning Network Bulletin Board Server

## Intro

This is an implementation of a "bulletin board"-like service over a Lightning Network Node.

It is using the [c13n API](https://docs.c13n.io/projects/api/en/latest/).

## How to use

You need a Lightning node (only `lnd` is supported currently) and deploy the [c13n daemon](https://github.com/c13n-io/c13n-go) on top of it.

This enables a new API for your LN node, which includes data-related functionality. For more info on **data over Lightning** read [here](https://c13n.io/about/).

After launching the `c13n` daemon rename `config.sample.yaml` to `config.yaml` and fill in the required credentials for connecting to c13n.