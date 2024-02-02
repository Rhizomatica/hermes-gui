# HERMES GUI

This project is a friendly user interface for HERMES - High-frequency Emergency and Rural Multimedia Exchange System. Telecommunications system that provides digital telecommunications. It's being developed by [Rhizomatica](https://www.rhizomatica.org/).

![HERMES-GUI Home Screenshot](/src/assets/img/hermes-gui-home-readme.png)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.12.

angular-devkit/architect: 0.1402.12
angular-devkit/build-angular: 14.2.12
angular-devkit/core: 14.2.12
angular-devkit/schematics: 14.2.12
angular/cli: 14.2.12
schematics/angular: 14.2.12
rxjs: 6.6.7
typescript: 4.8.4

Angular CLI: 14.2.12
Node: 18.17.1
Package Manager: npm 9.6.7 


## Install node, npm

- Install node preferably(v18.17.1) and npm (node package manager) in your distro.
- Run 'npm install' inside the project path.


## Environments file (.env) configuration

Create an `.env` file like a `.env.example` in root directory.
Check and configure `.env` file with your parameters and run `npx ts-node setEnv.ts` to set `.env` values in `enviroment.ts`.


> [!TIP]
> Environments (.env) parameters explanation 


- LOCAL (boolean)
    - If running local you can easily change the `serverIP` in `global-constants.ts` used for local or remote HTTP requests / Websocket connection.

- PRODUCTION (boolean)
    - If production (true), angular core will activate `enableProdMode()` script.
    - And also used by [hermes-installer](https://github.com/Rhizomatica/hermes-installer) project. Runing installer it will clone the `main` branch if production (true). If production (false) it will clone `development` branch. 

- DOMAIN (string)
    - Used to nomination and identification of the HERMES station (station.hermes.radio).

- GATEWAY (boolean)
    - When HERMES station is a gateway machine (true) it will enable the schedules and stations information modules.

- BITX (string)
    - Hardware version - UBITX (U) or SBITX (S)
    - SBITX includes voice and dual frequency options (phony and data transmission).

- HAS_GPS (boolean)
    - Used for GPS calibration function in the radio configuration screen.

- REQUIRE_LOGIN (boolean)
    - Required login (true) forces authentication for HERMES GUI system access.

- EMERGENCY_EMAIL (string)
    - Configure emergency email address. Available in the email screen and used for SOS Emergency function.

## Development server

Run `ng serve --configuration=en` for a dev server in english (en), you can change the language to spanish (es), portuguese (pt) or french (fr) if you wish. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build & Publish

Access remotly machine in port 22 with `ssh -p 22 hermes@[my_host_ip]`
type `sudo su` to admin verification 
Set origin main branch `git checkout main`
Update project `git pull`

Remove all files in dist folder `rm -r dist/`
Run `ng build --configuration production` to build the project.

To publish your artifacts copy the files stored in the `/dist` to `/var/www/html/` directory.

`cp -a dist/hermes/pt /var/www/html/`
`cp -a dist/hermes/es /var/www/html/`
`cp -a dist/hermes/en-US/ /var/www/html/`

Done

Navigate to [HERMES](https://[my_host_ip])

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Interface Contents

Inside the folder `src` you will find the angular templates for the system's interface. 

On style.less there are the styling code, writen in [less](https://lesscss.org/).

Inside the app folder, you will find the template components. The app-routing module.ts file is responsible for linking the templates to url adressess. and the app.component, the aplication root template.

For every system component, there will be a folder with the component.html, component.less, and component.ts. On the .html file there is the html angular template, and on the component.ts you will find typescript code related to that component.

Also inside the app folder, there is the _services foder, where you can find common services shared between the components to access the [station-api] (https://github.com/DigitalHERMES/station-api).

On assets folder you find links to svgs and image files used on the interface design.

On the locale folder there are the xlf files for translation. For the translations, we are using i18n angular module. To generate translations, you need to use `ng extract-i18n --output-path src/locale/` to generate the messages,xlf file and then `xliffmerge --profile xliffmerge.json pt es fr ar` to transpose the new data to both messages.es.xlf and messages.pt.xlf, where you can input the new tranlation tokens. 







