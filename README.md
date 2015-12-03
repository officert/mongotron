# <a href="http://mongotron.io/" target="_blank">Mongotron</a>

[![Build Status](https://travis-ci.org/officert/mongotron.svg?branch=master)](https://travis-ci.org/officert/mongotron)

A Mongo DB GUI built using Electron, and Angular Js.

---

![screenshot](https://github.com/officert/mongotron/blob/master/docs/images/screenshot.png)

## Table of Contents

* [Quick start](#quick-start)

### Quick Start

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
