// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';

// Load node modules
const fs = require('fs')
require('dotenv').config()

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   appName: '${process.env.APP_NAME}',
   apiUrl: '${process.env.API_URL}',
   production: '${process.env.PRODUCTION}',
   radioRemoteUrl: '${process.env.RADIO_REMOTE_URL}',
   webSocketUrl: '${process.env.WEBSOCKET_URL}',
   radioRemoteWSUrl: '${process.env.RADIO_REMOTE_WS_URL}'
};`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);

fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        throw console.error(`Error while Angular environment.ts file generating: ${err} \n`);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
    }
});