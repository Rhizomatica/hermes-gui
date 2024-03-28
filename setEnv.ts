// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';

// Load node modules
const fs = require('fs')
require('dotenv').config()

// `environment.ts` file structure
const envConfigFile = `export const environment = {
    local: ${process.env.LOCAL},
    production: ${process.env.PRODUCTION},
    domain: '${process.env.DOMAIN}',
    gateway: ${process.env.GATEWAY},
    bitx: '${process.env.BITX}',
    hasGPS: ${process.env.HAS_GPS},
    requireLogin: ${process.env.REQUIRE_LOGIN},
    emergencyEmail: '${process.env.EMERGENCY_EMAIL}'
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
