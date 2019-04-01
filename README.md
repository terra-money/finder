# Terra Finder 

![banner](./terra-finder.png)

The Terra Finder is a tool to search through blocks, transactions, and accounts on the Terra blockchain. 

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Docker
```
docker build -t terra/finder .
docker run -it  -e rpcUrl=http://localhost:46657 terra/finder
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
