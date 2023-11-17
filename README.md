# Hermes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.6.

Angular: 13.2.6
Angular CLI: 13.2.6
Node: 12.22.5
Package Manager: npm 8.5.2


## Install node, npm

Install node preferably(V12.22.5) and npm (node package manager) in your distro

Run 'npm install' inside the project path


## Development server

Configure .env file with your parameters and run `npx ts-node setEnv.ts` to set .env values in enviroment.ts.

Run `ng serve --configuration=en` for a dev server in english, you can change the language to spanish (ng serve --configuration=es) or portuguese (ng serve --configuration=pt) if you wish. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build & Publish

Access remotly machine in port 22 with `ssh -p 22 hermes@[my_host_ip]`
type `sudo su` to admin verification 
Set origin main branch `git checkout main`
Update project `git pull`
Create an .env file like a .env.example in root directory
Check and configure .env file with your parameters DEV/PROD and run `npx ts-node setEnv.ts` to set .env values in enviroment.ts.
Remove all files in dist folder `rm -r dist/`
Run `npm run build / ng build` to build the project. The build artifacts will be stored in the `dist` directory.
Copy them in `/var/www/html/` directory
    `cp -a dist/hermes/pt /var/www/html/`
    `cp -a dist/hermes/es /var/www/html/`
    `cp -a dist/hermes/en-US/ /var/www/html/`
Done 
Navigate to [HERMES](https://[my_host_ip])


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

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







