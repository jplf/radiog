
## The backend server

Here is the documentation of the RadioG backend server.
The main page of [RadioG](https://github.com/jplf/radiog/blob/master/README.md) is the entry point.

## Description

The server is implemented in the [Nest](https://github.com/nestjs/nest) framework. The website is [https://nestjs.com](https://nestjs.com/)

## Bluetooth configuration

It is the difficult part. This application is designed to send the audio output to loud speakers or headset connected via bluetooth to a raspberry computer. Of course it can work on any linux box with different kind of audio device. In these cases it is much easier to set up the system.

On RPi it is a nightmare to make the on-board bluetooth and the pulseaudio server working reliably together. When the configuration seems to be ok the connection to the audio device randomly falls down after a certain period of time. Without a full reboot it is impossible to reenable the audio system. After hours of googling the problem it turns out that the only robust solution is not to use the embedded bt device but to take a usb dongle instead. It's what I did and I managed to get something working without trouble.

To avoid having more than one bt controller the boot config has to be fixed :
```
# To disable the on-board wifi and bluetooth
echo "dtoverlay=disable-wifi" >> /boot/config.txt
echo "dtoverlay=disable-bt"  >> /boot/config.txt
```
After reboot `bluetoothctl` presents only one controller : the one from the usb dongle which is defined as the default.


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
