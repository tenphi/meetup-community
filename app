#!/usr/bin/env babel-node
process.env.NODE_ENV = 'production';
import Bundler from './bundler';
import yargs from 'yargs';
import Config from './config.default';
import Server from './backend/server';

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
    server = new Server(config);
    bundler.serve(server);
    break;
  default:
    console.log(`command not found`);
}
