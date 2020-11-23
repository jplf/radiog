
**RadioG** is an application used to manage an internet radio implemented
on a *Raspberry Pi*. Here are some notes about the frontend server.

The main page displays the top [README](https://github.com/jplf/radiog/blob/master/README.md).

### Design

This application was my first attempt to build something useful with the new version of Angular. It follows the explanations provided on the Angular website for the [Heroes](https://angular.io/tutorial) demo.

It is meant to be the user interface to the [backend server](https://github.com/jplf/radiog/blob/master/backend/README.md).
This backend provides services which can be accessed by http requests.

### Installation

This application can run on any computer running the linux operating system.
It is primarily intended to be installed on a raspberry pi box.

It is worth reading the [tutorial](https://angular.io/tutorial/toh-pt0) since this application is very similar to the one proposed by the Angular.

The first commands to run are :
```
node -v
npm -v
git remote add origin git@github.com:jplf/radiog.git
git pull
cd radiog/frontend
npm install
npm install @angular/cli
ng --version
```
These commands should be executed in the `frontend` directory. The code of the application is fetched from github.
Versions of *node* and *npm* are checked. The `PATH` must be updated to give access to the content of `node_modules/.bin/`, i.e. `ng`.

It is also possible to rebuild the application from scratch.
```
ng new --create-application=false --skip-git --style=scss -v radiog
cd radiog
git init
```

This application may also need a bunch of node modules which are installed by :

```
npm install @angular-devkit/architect \
@angular-devkit/build-angular @angular-devkit/build-optimizer \
@angular-devkit/build-webpack @angular-devkit/core \
@angular-devkit/schematics @ngtools/webpack @schematics/angular \
@schematics/update rxjs typescript webpack bootstrap@4.4.1 \
@angular/compiler-cli tslib @angular/compiler  \
bootstrap bootswatch
```
Finally try `ng serve --host my-hostname --port my-port` to make sure everything is ok.

### Code scaffolding

At this point the available components are :

* `app` which is the root of the application as explained in the [Angular doc](https://angular.io/guide/bootstrapping).
* `station-list` manages the list of radio stations which are registered by the application.
* `station` manages various attributes of a radio station.
* `radio` handle the connection to a selected radio station and the output stream.
* `messages` is used to display messages when necessary.

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### Components

* the home page is specified in the `src` directory. It defines the style based on [bootstrap](https://getbootstrap.com/), the well know javascript library, and a theme chosen from the [bootswatch](https://bootswatch.com/) collection.

* the topmost component, named `app`, is defined in `src/app`. It follows the Angular principles. The html page displays a navigation bar, the list of radio stations managed by the backend and a couple of controls to start and stop the radio.

* `station-list` retrieves the list of stations. The list is fetched from the backend server. The html component displays this list alongside with radio button widgets allowing to select one particular station. A callback is executed when a button is pressed.
The main point to consider is the way the list is retrieved since the request to the backend server is asynchronous : the component _subscribes_ to the function _fetchStationList()_ and parses the json response to build the list.

* `station` provides the service managing the list of radio stations. It implements a couple of useful methods working on the collection.

* `radio` is the component interacting with the backend player. It allows to switch the radio on or to stop it. The volume may also be changed thanks to the range widget.

* `messages` actually provides 2 different services : `message` which display information messages on the html page and `logger` which prints technical messages on the browser console. 

### Code quality

To clean up the code try `ng lint` then scan the package with SonarQube.

### Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestio.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
