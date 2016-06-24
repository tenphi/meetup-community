import Bundler from './bundler';
import yargs from 'yargs';
import Config from './config';
import Server from './backend/server';
import Logger from './backend/logger';
import util from './backend/util';
import fs from 'fs';

import ApiGenerator from './backend/vendor/express-api-generator';

let log = new Logger('main');
let argv = yargs.argv;
let bundler, config, publicConfig, server, api, nodemon;
let publicConfigFile = './frontend/config.json';

switch(argv._[0]) {
  case 'build':
    config = new Config('production');
    publicConfig = new Config('production', true);
    api = new ApiGenerator(util.requireIntoArray('./controllers'), { Logger });
    publicConfig.api = api.routes;
    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });
    bundler.compile();
    break;
  case 'serve':
    config = new Config('development');
    publicConfig = new Config('development', true);
    api = new ApiGenerator(util.requireIntoArray('./controllers'), { Logger });
    publicConfig.api = api.routes;

    fs.writeFileSync('./frontend/config.json', JSON.stringify(publicConfig), 'utf-8');

    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });

    bundler.serve();

    nodemon = require('nodemon');

    nodemon({
      exec: './app',
      ignore: [],
      args: ['rundev'],
      watch: ['backend/*', 'universal/*', 'node_modules/*', 'config.js', 'frontend/index.html'],
      ext: 'js',
      env: process.env
    }).on('restart', function () {
      log.info('Server files changed. restarting...');
    });

    break;
  case 'rundev':
    config = new Config('development');
    publicConfig = new Config('development', true);
    api = new ApiGenerator(util.requireIntoArray('./controllers'), { Logger });
    publicConfig.api = api.routes;

    let tmp = fs.readFileSync(publicConfigFile, 'utf-8');

    // rewrite public config only if it's changed
    if (JSON.stringify(publicConfig) !== tmp) {
      fs.writeFileSync(publicConfigFile, JSON.stringify(publicConfig), 'utf-8');
    }

    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });

    server = new Server(config);

    server.init()
      .then( () => bundler.bindServer(server) );

    break;
  default:
    console.log(`command not found`);
}
