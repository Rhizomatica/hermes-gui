# HERMES GUI

This project is a friendly user interface for HERMES - High-frequency Emergency and Rural Multimedia Exchange System. Telecommunications system that provides digital telecommunications. It's being developed by [Rhizomatica](https://www.rhizomatica.org/).

![HERMES-GUI Home Screenshot](/src/assets/img/hermes-gui-home-readme.png)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21 and has been migrated to Angular 18.

@angular-devkit/build-angular: 18.2.21  
@angular/cli: 18.2.21  
@angular/compiler-cli: 18.2.14  
rxjs: 7.8.2  
typescript: 5.2.2  

Angular CLI: 18.2.21  
Node: v20.20.0  
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

Run `ng serve --configuration=en` for a dev server in English (en). You can change the language to Spanish (es), Portuguese (pt), French (fr), or Arabic (ar) if you wish. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Alternatively, use the npm script:
```bash
npm start -- --configuration=en
```


## Build & Publish

Access remote machine in port 22 with `ssh -p 22 hermes@[my_host_ip]`
Type `sudo su` for admin verification 
Set origin to main branch `git checkout main`
Update project `git pull`

Remove all files in dist folder `rm -r dist/`
Run `ng build --configuration production` to build the project with all locales enabled (en-US, es, pt, fr, ar).

To publish your artifacts, copy the files stored in the `/dist/hermes` to `/var/www/html/` directory:  
```bash
cp -a dist/hermes/* /var/www/html/
```

Alternatively, use npm script:
```bash
npm run build-i18n
```

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

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io). This uses Jasmine for testing and generates coverage reports.

Alternatively, use the npm script:
```bash
npm test
```

## Running end-to-end tests

TODO

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

The `locale` folder contains the XLF (XLIFF) files for translations. HERMES GUI uses Angular's i18n module for internationalization. Supported locales are English (en), Spanish (es), Portuguese (pt), French (fr), and Arabic (ar).

### Extracting and updating translations:

1. **Extract new translation keys:**
   ```bash
   ng extract-i18n --output-path src/locale/
   ```
   This generates or updates the `messages.xlf` file with new translation tokens.

2. **Merge translations to locale files:**
   ```bash
   npm run extract-i18n
   ```
   This command runs both extraction and merges new keys into `messages.es.xlf`, `messages.pt.xlf`, `messages.fr.xlf`, and `messages.ar.xlf`.

3. **Add translations:**
   Edit the corresponding `messages.[locale].xlf` files to add translations for new tokens.

For more details on ngx-i18nsupport, visit: https://www.npmjs.com/package/ngx-i18nsupport

### Building with translations:

Run the build with localization:
```bash
npm run build-i18n
```
This creates locale-specific builds in the dist folder for each configured language.






