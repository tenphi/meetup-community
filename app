#!/usr/bin/env babel-node
import Bundler from './bundler';
import yargs from 'yargs';
import config from './config.default';
import { publicConfig } from './config.default';

let argv = yargs.argv;

switch(argv._[0]) {
  case 'build':
    let bundler = new Bundler({
      appConfig: config,
      publicAppConfig: publicConfig
    });
    bundler.compile();
    break;
  default:
    console.log(`command not found`);
}
