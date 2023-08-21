# Terra Finder

![banner](./terra-finder.png)

Terra Finder is a tool to search through blocks, transactions, and accounts on the Terra blockchain.

Finder is derived from the [Cosmos Explorer](https://github.com/cosmos/explorer).

## Project setup

```
** NOTE: Make sure you are using Node 16 **
```
```
npm install
```

### Configure the environment variables

If required, edit `.env.development`.
For local development, you might want to use the following configuration:

```
HOST=localhost
HTTPS=false
BROWSER=none
REACT_APP_DEFAULT_NETWORK=localterra
```

`REACT_APP_DEFAULT_NETWORK` is the default selected network that Finder will use.
See [https://assets.terra.dev/chains.json](https://assets.terra.dev/chains.json) for the list of available networks.


### Run in Dev Mode with Hot Reloading
```
npm start
```
