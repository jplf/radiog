
**RadioG** is an application used to manage an internet radio implemented
on a *Raspberry Pi*.

It is a webapp built in the framework of [Angular](https://angular.io/). It was forked from the original [RadioK](https://github.com/jplf/radiok).

The documentation of the original version is available in french from 
the [RadioK](http://www.fonteny.org/radiok) dedicated web site:
http://www.fonteny.org/radiok. For this version the documentation will be issued later.

Here is a brief summary in english of what is detailed in the full web site.

### Changelog
| Date         | Changes |
|--------------|---------|
| 10 April 2020 | Layout acceptable |
| 04 April 2020 | A first version is pushed to github |
| 20 March 2020 | Make a copy of the original radiok |

### Hardware

A computer with a sound card, a loud speaker and an internet
connection are needed. A *Raspberry* is an excellent choice to implement this application.

### Design

This application is my first attempt to build something useful with the new version of Angular. It follows the explanations provided on the Angular website for the [Heroes](https://angular.io/tutorial) demo.

### Installation

This application can run on any computer running the linux operating system.
It is primarily intended to be installed on a raspberry pi box.

It is worth reading the [tutorial](https://angular.io/tutorial/toh-pt0) since this application is very similar to the one proposed by the Angular.

The target is a [Raspberry Pi 3 Model B](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) 1GB running Ubuntu 19.10 (Eoan Ermine).

### Directories

# Gontrol

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run [`ng serve`](https://angular.io/cli/serve) for a development server. Then navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. It is possible to set the hostname of the server and the associated port, e.g. `ng serve --host kertugal --port 4200`

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

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
