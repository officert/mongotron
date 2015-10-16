# Mongotron
A Mongo DB GUI that doesn't suck. Built using Electron, and Angular Js.

[![Build Status](https://travis-ci.org/officert/mongotron.svg?branch=master)](https://travis-ci.org/officert/mongotron)

## Development

### Getting Started

1. Clone the repo
2. Install dependencies
```shell
npm install
```
```shell
bower install
```
3. Create symlinks
```shell
make postinstall
```
4. Start the app
```shell
gulp serve
```

###Troubleshooting

####electron command not found
If you get this error you don't have Elecron installed. Go [here] (https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md) to install it.

### Releasing
this will create a release directory and package the app into an executable
```shell
gulp release
```
