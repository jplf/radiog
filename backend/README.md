
## The backend server

Here is the documentation of the RadioG backend server.
The main page of [RadioG](https://github.com/jplf/radiog/blob/master/README.md) is the entry point.

## Description

The server is implemented in the [Nest](https://github.com/nestjs/nest) framework. The website is [https://nestjs.com](https://nestjs.com/)

## Installation

Installation of the code is pretty easy and follows the standard javascript principles. The necessary node modules have to be fetched and put into the *node_modules* directory. More information about [NestJs](https://docs.nestjs.com) is available online.

```bash
# clone radiog from the github repository
$ cd radiog/backend
$ npm install
```
## Running the app

This application needs 2 environment variables :
* _RADIOG_HOME_ which gives the path to the top directory where the code is installed, e.g. `/home/myself/git/radiog`
* _RADIOG_CONF_ which defines the path to the configuration file, e.g. `/home/myself/etc/radiog.conf`

The configuration file provides the necessary parameters about a specific installation. It is straightforward to change them.

```bash
$ npm run start
```
Look at the messages printed on the console to see if the server is started without errors. Then try something like:
```
curl -s localhost:18300/player | jq
```
A couple of parameters should be displayed in json format.
Once the output device is configured it is possible to use the player :
```
curl -s localhost:18300/player/station?key=11
curl -s localhost:18300/player/on
```

## Bluetooth configuration

It is the difficult part. This application is designed to send the audio output to loud speakers or headset connected via bluetooth to a raspberry computer. Of course it can work on any linux box with different kind of audio device. In these cases it is likely much easier to set up the system.

On RPi it is a nightmare to make the on-board bluetooth and the pulseaudio server working reliably together. When the configuration seems to be ok the connection to the audio device randomly falls down after a certain period of time. Without a full reboot it is impossible to reenable the audio system. After hours of googling the problem it turns out that the only robust solution is not to use the embedded bt device but to take a usb dongle instead. It's what I did and I managed to get something working without trouble. In the future with a new version of the RPi we may hope to have something usable.

To avoid having more than one bt controller the boot config has to be fixed :
```
# To disable the on-board wifi and bluetooth
echo "dtoverlay=disable-wifi" >> /boot/config.txt
echo "dtoverlay=disable-bt"  >> /boot/config.txt
```
After reboot `bluetoothctl` presents only one controller : the one from the usb dongle which is defined as the default.

There is not good modern API to manage the bluetooth connection. To interact with the system from a javascript application it is necessary to spawn a unix command like :
```
echo info 11:22:33:44:AA:BB | /usr/bin/bluetoothctl
```
The command `info` about the device specified by its address is sent to `bluetoothctl(1)`. It is not elegant but it does the job.

## Pulseaudio configuration

I read this [warning](https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/WhatIsWrongWithSystemWide/) but decided it was not relevant to my case. I'm developping a sort of radio box designed to be implemented on a RPi with no screen, no keyboard, no interative user. In this situation it makes sense to configure pulseaudio as a [system service](https://www.freedesktop.org/wiki/Software/PulseAudio/Documentation/User/SystemWide/).

The pulse audio systemd service is defined as :
```
[Unit]
Description=My RPi pulseAudio system server

[Service]
Type=notify
ExecStart=pulseaudio --system

[Install]
WantedBy=multi-user.target
```
A more sophisticated script could be prepared but this simple one works.

Then, basically, something like :
```
# Update groups
usermod -a -G bluetooth pulse
usermod -a -G pulse-access root
usermod -a -G pulse-access jaypee

# Update systemd configuration
systemctl --system enable pulseaudio.service
systemctl --system start pulseaudio.service
```
The pulseaudio configuration, `daemon.conf` must have these settings, or something similar :
```
daemonize = no
allow-module-loading = yes
allow-exit = no
system-instance = yes
load-default-script-file = yes
default-script-file = /etc/pulse/default.pa
log-target = file:/var/log/pulse.log
```
Actually it is worth using the `default.pa` instead of the `system.pa` even in a system wide environment.

## Design

This application is based on the simple unix programme: [`mpg123`](https://www.mpg123.de/) which plays either a radio stream or a mp3 file. The output volume is controlled by the command [`amixer`](https://linux.die.net/man/1/amixer).

From the NestJs javascript code these commands are executed by the [child_process](https://nodejs.org/api/child_process.html) module coming with the [nodejs](https://nodejs.org/api/synopsis.html) library. To successfully get things working one has to figure out how to use asynchronous callback functions. It may take some time.

Four services are implemented :
1. `stations` which loads the list of stations managed by the application. This list is provided as a json file in the `etc` directory. The list gives the URL from where to get the stream. Other properties may be defined when they are known.
1. `journal` which implements logging. For now it is minimalist but it could be more sophisticated if necessary.
1. `device` which takes care of the bluetooth connection.
1. `player` which runs the `mpg123` command.

To access the 2 main services controllers are defined. They allow to access the service by http requests.

To manage the player one can call these end points :

* `/player` : returns the status
* `/player/on` : switches on the sound output
* `/player/off`: switches off the sound
* `/player/station-list` : gets the list of radio stations
* `/player/station?key=nn` : gets info about a specific station
* `/player/set?volume=12` : changes the output volume
* /`player/play?file=some-file.mp3`: plays a mp3 file
* `/player/listen/nn` : listens to a radio station

And for the bluetooth connection :

* `/device` : gets the status of the connection
* `/device/info` : gets the status
* `/device/connect` : enables the connection to the device
* `/device/disconnect` : disables the connection to the device

To access these points just run `curl http://localhost:4200/`, when the response is a json chunk pipe the call into `jq` to pretty print the result.
