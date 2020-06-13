
**RadioG** is an application used to manage an internet radio implemented
on a *Raspberry Pi*.

It is a webapp built in the framework of [Angular](https://angular.io/). It was forked from the original [RadioK](https://github.com/jplf/radiok).

The documentation of the original version is available in french from 
the [RadioK](http://www.fonteny.org/radiok) dedicated web site:
http://www.fonteny.org/radiok. For this version the documentation is now in progress.

Here is a brief summary in english of what is detailed in the full web site.

### Changelog
| Date         | Changes |
|--------------|---------|
| 08 June 2020 | The first RC version is ready |
| 27 May 2020 | A beta version is available |
| 29 April 2020 | Backend ready |
| 10 April 2020 | Layout acceptable |
| 04 April 2020 | A first version is pushed to github |
| 20 March 2020 | Make a copy of the original radiok |

### Bugs
* It is still hard to master the bluetooth connection on the raspberry. Actually it seems that there is a difficulty with the on-board bt device which stops working randomly after an unpredictable period of time. After having spent hours trying to fix the problem with the help of google I gave up and changed for an usb bt dongle.
Updated : no more any problem with a dongle.

### Layout
This application is split in 2 parts : the backend implementing the sound player services and the frontend giving users a nice web interface to the the services. The backend services are also directly available by http rest requests.

### Hardware

A computer with a sound card, a loud speaker and an internet
connection are needed. A *Raspberry* is an excellent choice to implement this application.

The target is a [Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) 1GB running Ubuntu 19.10 (Eoan Ermine).

# Backend
The backend server [README](https://github.com/jplf/radiog/tree/master/backend) gives more information.
This server provides a http interface to unix commands controlling the output of music from a linux box to a bluetooth connected loud speaker. It is implementd by the [NestJs](https://docs.nestjs.com/) library. 

# Frontend
The frontend server [README](https://github.com/jplf/radiog/tree/master/frontend) gives more information about the web interface. This webui is implemented with [Angular](https://en.wikipedia.org/wiki/Angular_(web_framework)) components.



