# Hermes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.2.

## Install node, npm
Install node and npm (node package manager) in your distro

Run 'npm install' inside the project path


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Interface Roadmap

Messages:
- record audio
ok - delete messages
- ifinite scroll and results pagination
ok - browse in messages

admin:

ok - authentication

ok - network administration

- detailed log (what is that?)

- admin management
    - change what is visible with each status
        - ok
    - feedback when submit action
        - ok
    - validate username

    (question - automatic email when creating username)

- message administration 
    - bulk delete messages


- data do sistema
- aviso de pré-falha de disco
- aviso de revisão
- habilitar e desabiitar upa

ok - consertar stations
ok - botão de apagar só com admin
- infos na mensagem

ok - reload user list

ok - configure who can send messages
    - allowFile : all, user, admin

ok - set radio conf  pegar valor atual  
ok - shutdownw /reboot
- reset to default alert
ok - range values for frequency, bfo and masteracal

- message too big
ok - shut down button to the right
ok - remove stations from create users

ok - range para frequencias

ok - don't update username
ok - pegar email do aip service no create user

- senha forte min 8 char;
- review dos logs do console;
- network info https://192.168.0.109/api/sys/status
- standalone download for deltachat


* comandos para atualizar frontend na estação
10.8.0.3 kurupira2 k2.hermes.radio (VPN) 
192.168.0.103? kurupira2 (rede local ariane)

** atualizar web-gui angular por ssh (tem ansible)


 ssh hermes@ip rede local ou vpn (10.8.0.3)
 entra na pasta:
 cd ~/install/angular

 compila o código angular:
 npm run build

 copia para a pasta www
sudo cp -r dist/hermes/* /var/www/html

* atualizar web-gui 
 compilar local e copiar por sftp todo o conteúdo da pasta local dist/hermes/ para a pasta /var/www/html/ da estação

 npm run build 
 gera arquivos em dist/hermes
 
 * identificar ip interno da rede
 - ssh por vpn: 
 ssh hermes@10.8.0.3
 - listar as interfaces de rede (procurar pelo ip da enp3s0)
 ip a







