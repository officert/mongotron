# Mongotron
A Mongo DB GUI that doesn't suck. Built using Electron, and Angular Js.

## Development

### Getting Started

1. Clone the repo
2. Install dependencies
```shell
npm install
```
```shell
bower instsall
```
3. Create symlinks
```shell
make postinstall
```
4. Start the app
```shell
gulp run
```

###Troubleshooting

####electron command not found
If you get this error you don't have Elecron installed. Go [here] (https://github.com/atom/electron/blob/master/docs/tutorial/quick-start.md) to install it.

### Releasing
this will create a release directory and package the app into an executable
```shell
gulp release
```
