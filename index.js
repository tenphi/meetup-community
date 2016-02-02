import Bundler from './bundler';
import yargs from 'yargs';
import Config from './config.default';
import Server from './backend/server';
import Logger from './backend/logger';

let log = new Logger('main');
let argv = yargs.argv;
let bundler, config, publicConfig, server;

switch(argv._[0]) {
  case 'build':
    config = new Config('production');
    publicConfig = new Config('production', true);
    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });
    bundler.compile();
    break;
  case 'serve':
    config = new Config('development');
    publicConfig = new Config('development', true);
    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });

    bundler.serve();

    let nodemon = require('nodemon');

    nodemon({
      exec: './app',
      ignore: [],
      args: ['rundev'],
      watch: ['backend/*', 'universal/*', 'node_modules/*'],
      ext: 'js',
      env: process.env
    }).on('restart', function () {
      log.info('Server files changed. restarting...');
    });

    break;
  case 'rundev':
    config = new Config('development');
    publicConfig = new Config('development', true);
    bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });
    server = new Server(config);

    bundler.bindServer(server);
    break;
  default:
    console.log(`command not found`);
}
