
### Warning : the work is in progress and the code is not yet ready

## The backend server

Here is the documentation of the RadioG backend server.
The main page of [RadioG](https://github.com/jplf/radiog/blob/master/README.md) is the entry point.

## Description

The server is implemented in the [Nest](https://github.com/nestjs/nest) framework. The website is [https://nestjs.com](https://nestjs.com/).

### Changelog
| Date         | Changes |
|--------------|---------|
| 21 June 2022 | Backend is ready to be tagged 2.2 |
| 10 February 2022 | Backend is ready to be tagged 2.0 |
| 31 January 2022 | working udev rules enabled at last ! |
| 20 January 2022 | Connections are made over TLS |
| 10 January 2022  | Udev rules differ on my Dell slackware and on Rpi ubuntu |
| 09 December 2021  | Bluetooth udev config almost ready |
| 09 November 2021 | Branch *Version_1.0* created, based on code from *2021-05-01 0:0* |
| 29 October 2021 | Branches messed up. *used* renamed *Version_messy* |
| 15 October 2021 | At last promises seem to be resolved |
| 07 September 2021 | Development on branch *master* |
| 07 September 2021 | Branch *used* created and ~~running~~ on the RPi |
| 07 September 2021 | Tag 1.1 created |
| 07 September 2021 | Git status being fixed |

## Installation

Installation of the code is pretty easy and follows the standard javascript principles. The necessary node modules have to be fetched and put into the *node_modules* directory. More information about [NestJs](https://docs.nestjs.com) is available online.

```bash
# clone radiog from the github repository
$ cd radiog/backend
$ npm install
```
More things to do:

```bash
# Edit and copy the udev rules to /etc
cp radiog/etc/50-bluetooth.rules /etc/udev/rules.d/

# Create and install the hostname certificate pair
cp my-host.cert.pem my-host.key.pem radiog/etc/
chmod go-rwx radiog/etc/my-host.key.pem

```
### Backend configuration

The configuration is read from :
1. the file `$RADIOG_CONF` usually `$HOME/etc/radiog.conf`
2. the file `$RADIOG_HOME/etc/radiog.conf`

The first setting of a variable takes precedence.
The backend version is set in the file `package.json`.
See the [doc](https://docs.npmjs.com/cli/v7/configuring-npm/package-json).

The git package is tagged with the *major.minor* version ident. 


### X509 Certificates

Since the frontend server is now working on TLS it is necessary to have the backend server using https as well.
However it is not mandatory to have a complete certificate for this internal component. A self-signed certificate is sufficient.

```bash
# Create a self-signed certificate in the etc directory
cd etc
openssl req -new -x509 -sha256 -newkey rsa:2048 -nodes \
    -keyout $HOSTNAME.key.pem -days 365 -out $HOSTNAME.cert.pem
```

### Updating

It is strongly advised to update the code regularly, otherwise it is really hard to migrate a too old version to a recent one.

```bash
# Checking version
npm update
npm ls --depth=0
npm view jest version

# Install ncu
npm install -g npm-check-updates

# Update the packages in backend directory
ncu
ncu -u
npm install
```
### Udev usage
A rule has been defined to automatically stop or start the radio connection when the bluetooth device is switched off or on. Without this rule the connection had to be killed by a manual call to the backend api with *curl* or the frontend interface. Otherwise, even if there is no sound, the stream keeps flowing from the radio station.

With a correct udev rule enabled it is no longer necessary to stop manually both the device and the connection. The rule is triggered automatically when the device is switched on or off. Unfortunately it is not straightforward to configure the rules on a raspberry : i.e. the list of attributes available to the scripts is extremely limited.

Some rules are kept in the *etc* directoy and have to be installed in */etc/udev/rules.d*. To help debugging messages are printed in the *run* directory. See also *udev(7)* to find out which commands may be of interest.

Finally the implementation is slightly different on a raspberry and on a deskop. Two files are available : one for a rpi - *51-bluetooth-rules* - and another one for a desktop - *50-bluetooth-rules*.

Some useful commands :
```
To check that udev is working
systemctl status udev
# To guess the path of the on-board device
udevadm info --path=/devices/platform/soc/3f201000.serial/tty/ttyAMA0/hci0 --attribute-walk
# To update the set of rules
udevadm control --reload
# To see what happens when a device is connected or disconnected
udevadm monitor
```

### Testing

First read the NestJs [documentation](https://docs.nestjs.com/fundamentals/testing) to have a presentation of the framework then look at the Jest [pages](https://jestjs.io/docs/en/getting-started) to start implementing tests. 
To execute the tests launch:

```
npm test -- --watch
```
To investigate more easily some files try:

```bash
# Running only one test file
npm test -- --silent=false src/device/device.service.spec.ts
# change temporarily it() to it.only()
```

### Code quality

Install and configure [ESlint](https://eslint.org/), run
`npx eslint . --ext .js,.ts`

Then scan the package with SonarQube.

## Running the app

This application needs 2 environment variables :
* _RADIOG_HOME_ which gives the path to the top directory where the code is installed, e.g. `/home/myself/git/radiog`
* _RADIOG_CONF_ which defines the path to the configuration file, e.g. `/home/myself/etc/radiog.conf`

The configuration file provides the necessary parameters about a specific installation. It is straightforward to change them.
Values are found in the environment then in the local configuration file and finally in the default file. Once a value is found it is not overidden.
A default file is kept in the `RADIOG_HOME/etc` directory. The list of known radio stations is also in a json file in this directory. Note that at this point only the `key, name, stream` attributes are used.

```bash
$ npm run start
```
Look at the messages printed on the console to see if the server is started without errors. Then try something like:
```
curl -sk https://localhost:3000/player | jq
```
A couple of parameters should be displayed in json format.
Once the output device is configured it is possible to use the player:

```
curl -sk https://localhost:3000/player/station?key=11
curl -sk https://localhost:3000/player/on
curl -sk https://localhost:3000/player/play?file=10/Miles_Davis-Doxy.mp3
curl -sk https://localhost:3000/player/off
curl -sk https://localhost:3000/player/listen/10
```
If the audio system is already configured there is nothing special to do. However if the audio output is linked by bluetooth to the computer it may be necessary to read the remarks below.

## Bluetooth configuration

It is the difficult part. This application is designed to send the audio output to loud speakers or headset connected via bluetooth to a raspberry computer. Of course it can work on any linux box with different kind of audio device. In these cases it is likely much easier to set up the system.

On RPi it was a nightmare to make the on-board bluetooth and the pulseaudio server working reliably together. Nowadays it's much easier.

To avoid having more than one bt controller the boot config may be fixed :
```
# To disable the on-board wifi and bluetooth
echo "dtoverlay=disable-wifi" >> /boot/config.txt
echo "dtoverlay=disable-bt"  >> /boot/config.txt
```

There is not good modern API to manage the bluetooth connection. To interact with the system from a javascript application it is necessary to spawn a unix command like :
```
echo info 11:22:33:44:AA:BB | /usr/bin/bluetoothctl
```
The command `info` about the device specified by its address is sent to `bluetoothctl(1)`. It is not elegant but it does the job.

To update the bluetooth configuration the file _info_ in the directory _/var/lib/bluetooth/controller:mac:addr/device:mac:addr_ has to be edited : in the _[General]_ section _Alias=my-own-alias_ the line is to be inserted.

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
directory
Four services are implemented :
1. `stations` which loads the list of stations managed by the application. This list is provided as a json file in the `etc` directory. The list gives the URL from where to get the stream. Other properties may be defined when they are known.
1. `journal` which implements logging. For now it is minimalist but it could be more sophisticated if necessary.
1. `device` which takes care of the bluetooth connection.
1. `player` which runs the `mpg123` command.

To access the main services controllers are defined. They allow to access the services by http requests.

To manage the player one can call these end points :

* `/player` : returns the status
* `/player/on` : switches on the sound output
* `/player/off`: switches off the sound
* `/player/station-list` : gets the list of radio stations
* `/player/station?key=nn` : gets info about a specific station
* `/player/set?volume=12` : changes the output volume
* '/player/play?file=some-file.mp3`: plays a mp3 file
* `/player/listen/nn` : listens to a radio station

And for the bluetooth connection :

* `/device` : gets the status of the connection
* `/device/info` : gets the status
* `/device/connect` : enables the connection to the device
* `/device/disconnect` : disables the connection to the device

To access these points just run `curl http://localhost:port/`, when the response is a json chunk pipe the call into `jq` to pretty print the result.
