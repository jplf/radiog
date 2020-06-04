
## The backend server

Here is the documentation of the RadioG backend server.
The main page of [RadioG](https://github.com/jplf/radiog/blob/master/README.md) is the entry point.

## Description

The server is implemented in the [Nest](https://github.com/nestjs/nest) framework. The website is [https://nestjs.com](https://nestjs.com/)

## Bluetooth configuration

It is the difficult part. This application is designed to send the audio output to loud speakers or headset connected via bluetooth to a raspberry computer. Of course it can work on any linux box with different kind of audio device. In these cases it is much easier to set up the system.

## Installation

Installation of the code is pretty easy and follows the standard javascript principles. The necessary node modules have to be fetched and put into the *node_modules* directory.

```bash
# clone radiog from the github repository
$ cd radiog/backend
$ npm install
```

## Running the app

```bash
$ npm run start
```
