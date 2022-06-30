
**RadioG** is an application used to manage an internet radio implemented
on a *Raspberry Pi*.

It is a webapp built in the framework of [Angular](https://angular.io/). It was forked from the original [RadioK](https://github.com/jplf/radiok).

The documentation of the original version is available in french from 
the [RadioK](http://www.fonteny.org/radiok) dedicated web site:
http://www.fonteny.org/radiok. For this new version the documentation is now in progress.

Here is a brief summary in english of what is detailed in the full web site.

### Changelog
| Date         | Changes |
|--------------|---------|
| 27 June 2022 | General update achieved |
| 20 January 2022 | Progress on TLS configurations |
| 11 January 2022 | First attempt to make a proper installation on each hosts |
| 27 April 2021 | The frontend is now served by nginx |
| 02 December 2020 | The backend can also be used by RadioK |
| 23 November 2020 | Code cleaned up |
| 09 September 2020 | Runtime configuration implementation refixed |
| 25 August 2020 | Runtime configuration implementation fixed |
| 30 June 2020 | Screen layout updated |
| 26 June 2020 | Documentation updated |
| 08 June 2020 | The first RC version is ready |
| 27 May 2020 | A beta version is available |
| 29 April 2020 | Backend ready |
| 10 April 2020 | Layout acceptable |
| 04 April 2020 | A first version is pushed to github |
| 20 March 2020 | Make a copy of the original radiok |

### Bugs
* It is still hard to master the bluetooth connection on the raspberry. Actually it seems that there is a difficulty with the on-board bt device which stops working randomly after an unpredictable period of time. After having spent hours trying to fix the problem with the help of google I gave up and changed for an usb bt dongle.
Updated : no more any problem with a dongle.
* Udev rules are not fully understood on Rpi Ubuntu. Output bluetooth device mac address is not provided.
* When the frontend server is accessed from different clients weird things may happen since the web pages are not kept in sync on these running clients.
* Starting the application may take a long time since the code has to be recompiled. Message telling that the server is online is not correct.

### Layout
This application is split in 2 parts : the backend implementing the sound player services and the frontend giving users a nice web interface to the the services. The backend services are also directly available by http rest requests.

### Hardware

A computer with a sound card, a loud speaker and an internet
connection are needed. A *Raspberry* is an excellent choice to implement this application.

The target is a [Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) 1GB running Ubuntu 19.10 (Eoan Ermine).

## Usage
There is a collection of scripts in the `bin` directory. Read them and change whatever needs to be fixed.
Two environment variables must be set, i.e :
```
RADIOG_HOME=$HOME/radiog
RADIOG_CONF=$HOME/etc/radiog.conf
```
Then, to start the application just run `bin/start.sh`. Actually the best is to start the app into a `screen(1)` session.
The runtime configuration management is far from being perfect. Make sure that the URL and specifically the port numbers are correctly set in the backend, frontend configuration files and in the script `start.sh`.

The frontend configuration is defined in `assets/radiog-conf.json` which can be replaced by a file whose name is defined in `environment.ts`.

To stop the application run `bin/stop.h`. This script kills with no mercy all RadioG processes.

A new version will be available soon : connections to the servers will be managed over TLS. 

## General Updating

After a reboot, as root update the distrib:
```
apt update
apt list --upgradable
apt upgrade
apt autoremove
apt clean
reboot
systemctl --failed
ufw status verbose
service --status-all
```
Then, also as root, update the nodejs system libraries:
```
npm cache clean -f
n latest
npm update
reboot
```
As myself:
```
cd $RADIOG_HOME
git pull
# 
cd backend/
npm update
ncu
ncu -u
npm install
#
cd frontend/
ncu
ng update
```

## Backend
The backend server [README](https://github.com/jplf/radiog/tree/master/backend) gives more information.
This server provides a http interface to unix commands controlling the output of music from a linux box to a bluetooth connected loud speaker. It is implementd by the [NestJs](https://docs.nestjs.com/) library. 

## Frontend
The frontend server [README](https://github.com/jplf/radiog/tree/master/frontend) gives more information about the web interface. This webui is implemented with [Angular](https://en.wikipedia.org/wiki/Angular_(web_framework)) components.



