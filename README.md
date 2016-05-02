# <a href="http://mongotron.io/" target="_blank">Mongotron</a>

[![Build Status](https://travis-ci.org/officert/mongotron.svg?branch=master)](https://travis-ci.org/officert/mongotron)
[![Join the chat at https://gitter.im/officert/mongotron](https://badges.gitter.im/officert/mongotron.svg)](https://gitter.im/officert/mongotron?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Coverage Status](https://coveralls.io/repos/officert/mongotron/badge.svg?branch=master&service=github)](https://coveralls.io/github/officert/mongotron?branch=master)

A Mongo DB GUI built using Electron, and Angular Js.

---

![screenshot](http://mongotron.io/src/images/screenshot.png)

## Table of Contents

* [Quick start](#quick-start)

### Quick Start

* Clone the repo
* Install dependencies

```shell
npm install
```

* Start the app

```shell
npm start
```

### Tests
```shell
make test
```

###Troubleshooting

####electron command not found
If you get this error you don't have Electron installed. Go [here] (https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md) to install it.

### Releasing
this will create a release directory and package the app into an executable
```shell
gulp release
```
