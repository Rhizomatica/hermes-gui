// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';

// Load node modules
const fs = require('fs')
require('dotenv').config()

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   appName: '${process.env.APP_NAME}',
   appKey: '${process.env.APP_KEY}',
   appDebug: '${process.env.APP_DEBUG}',
   appLogLevel: '${process.env.APP_LOG_LEVEL}',
   appUrl: '${process.env.APP_URL}',
   apiBaseUrl: '${process.env.API_BASE_URL}',
   apiUrl: '${process.env.API_URL}',
   nodeEnv: '${process.env.NODE_ENV}',
   production: '${process.env.PRODUCTION}'
};
`;

console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile);


//TODO - DEFINIR APENAS UM ARQUIVO ENVIROMENT
fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(`Error while Angular environment.ts file generating: ${err} \n`);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});

fs.writeFile(targetPathProd, envConfigFile, function (err) {
    if (err) {
        throw console.error(`Error while Angular environment.ts file generating: ${err} \n`);
    } else {
        console.log(`Angular environment.ts file generated correctly at ${targetPathProd} \n`);
    }
 });