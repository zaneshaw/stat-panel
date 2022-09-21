# stat-panel
A NodeJS web server for monitoring basic system information in a clean, readable format

## Roadmap
- [ ] Skeleton loading
- [ ] Compiled version
- [ ] Basic system information (system, os, etc)
- [ ] Battery information
- [ ] Audio information
- [ ] Toggleable stat cards
- [ ] Multiple storage devices
- [ ] Customisation options
- [ ] Network interface caching
- [ ] Live-updating stats (ram, cpu)
- [ ] Reload button (storage, network)
- [ ] Copy button icon (private/public ip)

## Installation
Optionally, you can download the pre-compiled release
### Clone repository
```
git clone https://github.com/squidee100/stat-panel.git
```

### Install required dependencies
```
npm install
```
or
```
yarn install
```

### Build styles
```
npm run build:css
```

## Usage
### Open command line
...

### Navigate to the source directory
```
cd ./stat-panel
```

### Run web server
```
node main.js
```

## Run as a daemon (optional)
### Install `pm2`
```
sudo npm install pm2@latest -g
```

### Start service instance
```
pm2 start main.js
```

### Save configuration
```
pm2 save
```

## Run on startup (optional)
### https://pm2.keymetrics.io/docs/usage/startup/
