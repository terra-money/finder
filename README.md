# Terra Finder

![banner](./terra-finder.png)

[![CircleCI](https://circleci.com/gh/terra-project/finder.svg?style=svg)](https://circleci.com/gh/terra-project/finder)

The Terra Finder is a tool to search through blocks, transactions, and accounts on the Terra blockchain.

The Finder is derived from the [Cosmos Explorer](https://github.com/cosmos/explorer).

## Project setup

```
** NOTE: Make sure you are using Node 16 **
```
```
npm install
```

### Configure the environement variables

If required, edit `.env.development`.
For local development you might want to use this configuration:

```
HOST=localhost
HTTPS=false
BROWSER=none
REACT_APP_DEFAULT_NETWORK=localterra
```

`REACT_APP_DEFAULT_NETWORK` is the default selected network that finder will use.
See [https://assets.terra.money/chains.json](https://assets.terra.money/chains.json) for the list of available networks.


### Compiles and hot-reloads for development
```
npm start
```
