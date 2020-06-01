
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
| 27 May 2020 | A beta version is available |
| 29 April 2020 | Backend ready |
| 10 April 2020 | Layout acceptable |
| 04 April 2020 | A first version is pushed to github |
| 20 March 2020 | Make a copy of the original radiok |

### Bugs
* It is still hard to master the bluetooth connection on the raspberry. Actually it seems that there is a difficulty with the on-board bt device which stops working randomly after an unpredictable period of time. After having spent hours trying to fix the problem with the help of google I gave up and changed for an usb bt dongle.

### Layout
This application is split in 2 parts : the backend implementing the sound player services and the frontend giving users a nice web interface to the the services. The backend services are available by http rest requests.

### Hardware

A computer with a sound card, a loud speaker and an internet
connection are needed. A *Raspberry* is an excellent choice to implement this application.


# Backend

The backend server [README](https://github.com/jplf/radiog/tree/master/backend) gives more information.
This server provides a http interface to unix commands controlling the output of music from a linux box to a bluetooth connected loud speaker. It is implementd by the [NestJs](https://docs.nestjs.com/) library. 

# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

### Design

This application is my first attempt to build something useful with the new version of Angular. It follows the explanations provided on the Angular website for the [Heroes](https://angular.io/tutorial) demo.

### Installation

This application can run on any computer running the linux operating system.
It is primarily intended to be installed on a raspberry pi box.

It is worth reading the [tutorial](https://angular.io/tutorial/toh-pt0) since this application is very similar to the one proposed by Angular.

The target is a [Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) 1GB running Ubuntu 19.10 (Eoan Ermine).

Starting from scratch the first commands to run were :
```
node -v
npm -v
npm install @angular/cli
ng --version
cd radiog
ng new --create-application=false --skip-git --style=scss -v frontend
cd frontend
```
Versions of *node* and *npm* were checked and a new angular application was generated
This application needs also a bunch of node modules which must be installed :

```
npm install @angular-devkit/architect \
@angular-devkit/build-angular @angular-devkit/build-optimizer \
@angular-devkit/build-webpack @angular-devkit/core \
@angular-devkit/schematics @ngtools/webpack @schematics/angular \
@schematics/update rxjs typescript webpack bootstrap@4.4.1 \
@angular/compiler-cli tslib @angular/compiler  \
bootstrap bootswatch
```
Now since everything is managed by git it is sufficient to pull the code from this repository and to run
```
npm install package.json
```
to fetch the necessary node modules.

## Code scaffolding

At this point the available components are :

* `app` which is the root of the application as explained in the [Angular doc](https://angular.io/guide/bootstrapping).
* `station-list` manages the list of radio stations which are registered by the application.
* `station` manages various attributes of a radio station.
* `radio` handle the connection to a selected radio station and the output stream.
* `messages` is used to display messages when necessary.

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running the server

Run [`ng serve`](https://angular.io/cli/serve) for a development server. Then navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. It is possible to set the hostname of the server and the associated port, e.g. `ng serve --host kertugal --port 4200`

## Running unit tests and end-to-end tests

The following is not yet implemented.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

