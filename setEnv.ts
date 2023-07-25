// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';

// Load node modules
const fs = require('fs')
require('dotenv').config()

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   appName: '${process.env.APP_NAME}',
   version: '${process.env.VERSION}',
   production: '${process.env.PRODUCTION}',
   local: ${process.env.LOCAL},
   hasGPS: '${process.env.HAS_GPS}',
   domain: '${process.env.DOMAIN}',
   gateway: ${process.env.GATEWAY},
   bitx: '${process.env.BITX}',
   generalLogin: ${process.env.GENERAL_LOGIN}
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
