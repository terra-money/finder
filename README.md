# Terra Finder

![banner](./terra-finder.png)

[![CircleCI](https://circleci.com/gh/terra-project/finder.svg?style=svg)](https://circleci.com/gh/terra-project/finder)

The Terra Finder is a tool to search through blocks, transactions, and accounts on the Terra blockchain.

The Finder is derived from the [Cosmos Explorer](https://github.com/cosmos/explorer).

## Run with Docker
1. Clone project: `git clone https://github.com/RBFLabs/finder.git`
2. Enter directory: `cd finder`
3. Run Docker: `docker-compose up --build`
4. Open Browser at `http://localhost:3000`

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
See `src/config/networks.ts` for the list of available networks.


### Compiles and hot-reloads for development
```
npm start
```
