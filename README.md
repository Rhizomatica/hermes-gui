# HERMES GUI

This project is a friendly user interface for HERMES - High-frequency Emergency and Rural Multimedia Exchange System. Telecommunications system that provides digital telecommunications. It's being developed by [Rhizomatica](https://www.rhizomatica.org/).

![HERMES-GUI Home Screenshot](/src/assets/img/hermes-gui-home-readme.png)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.12.

@angular-devkit/architect: 0.1402.12  
@angular-devkit/build-angular: 14.2.12  
@angular-devkit/core: 14.2.12  
@angular-devkit/schematics: 14.2.12  
@angular/cli: 14.2.12  
@schematics/angular: 14.2.12  
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
    - SBITX includes voice and dual frequency options (voice and data transmission).

- HAS_GPS (boolean)
    - Used for enable GPS Geolocation module component
    - Track and store your current geolocation

- REQUIRE_LOGIN (boolean)
    - Required login (true) forces authentication for HERMES GUI system access.

- EMERGENCY_EMAIL (string)
    - Configure emergency email address. Available in the email screen and used for SOS Emergency function.

- LOCALE_ID (string)
    - Configure the locale id for translation and style adaptations (eg. ar-styles.less)


## Development server

Run `ng serve --configuration=en` for a dev server in english (en), you can change the language to spanish (es), portuguese (pt) or french (fr) if you wish. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build & Publish

Access remotly machine in port 22 with `ssh -p 22 hermes@[my_host_ip]`
type `sudo su` to admin verification 
Set origin main branch `git checkout main`
Update project `git pull`

Remove all files in dist folder `rm -r dist/`
Run `ng build --configuration production` to build the project.

To publish your artifacts copy the files stored in the `/dist` to `/var/www/html/` directory  
`cp -a dist/hermes/pt /var/www/html/`  
`cp -a dist/hermes/es /var/www/html/`  
`cp -a dist/hermes/en-US/ /var/www/html/`

Done

Navigate to [HERMES](https://[my_host_ip])


## Publish and Run HERMES as PWA APP (SERVICE WORKER)

For running HERMES as a service run `http-server -p 9000 -c-l dist/hermes`

**Note: The angular-pwa (service worker) must access an API and Web Socket from the same ORIGIN. It means they must to be hosted in the same server. And also the HERMES angular-pwa version requires a SSL Certificate for production environment.

For more details read [Angular Service Worker](http://angular.io/guide/service-worker-getting-started)

E.g. 
angular-pwa app running at `http://127.0.0.1:9000/en-US/home` or `localhost:9000/en-US/home`
so on the global-constants.ts the API Server IP should be defined with the same IP Address (ORIGIN) from the angular-pwa app : `http://127.0.0.1:8080/api` or `localhost:8080/api`

Avoid run the HERMES as a service during your development.
Running HERMES locally as a service (service worker) the angular live reloads does not work.
So build your project again running `ng build` after change your code and run `http-server -p 9000 -c-l dist/hermes`
to restart the project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## GITHUB Actions runner, Build & Delivery 

First you need the self-hosted runner installed, follow the link for more details. 

[GITHUB - Managing access to self-hosted runners using groups](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/managing-access-to-self-hosted-runners-using-groups)


1. Configure your self-hosted runner.
    - Configure it as default
        - group: default
        - runner: $machine_name

    . Access the ./actions-runner Folder
    After configuration, you'll need to be in the actions-runner directory to run the runner.

    Linux/macOS: cd /path/to/your/actions-runner

2. Run the Work with ./run.sh
Once you're in the actions-runner directory, this command will start the runner application. It will then connect to GitHub and wait for jobs to be assigned.

    - Linux/macOS: ./run.sh

    Important: Running this command directly in your terminal will keep the runner active as long as the terminal window is open. For a more robust, persistent setup, especially in production, you should configure the runner as a service (e.g., using systemd for Linux, launchd for macOS, or a Windows Service).

    Triggering Your Build and Delivery Workflow
    Now that your runner is ready, let's look at the development and delivery process.

3. Make a Pull Request to the main Branch
This is standard practice for contributing code:

    Create a new branch from main to work on your changes (e.g., git checkout -b my-new-feature).
    Implement your changes and commit them to your new branch.
    Push your branch to GitHub (git push origin my-new-feature).
    Create a Pull Request from your feature branch to the main branch of Rhizomatica/hermes-gui.
    Once your Pull Request is reviewed and approved (and typically merged into main), your self-hosted runner will spring into action!

    Monitoring Your Build and Delivery
    Your GitHub Actions workflow, defined in build.yml, will automatically trigger. Your self-hosted runner will pick up this job and execute the build and publish process.

    You can monitor the progress of your build and delivery workflow in real-time here:
    [GITHUB BUILD AND DELIVERY](https://github.com/Rhizomatica/hermes-gui/actions/workflows/build.yml)

    Tip: If your build is successful, the artifact (e.g., your compiled application, distribution files) will be generated and made available for download directly from the workflow run details page on GitHub.

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

if `xliffmerge` library not installed please visit (https://www.npmjs.com/package/ngx-i18nsupport)






