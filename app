#!/usr/bin/env node
require('babel-core/register');
require('babel-polyfill');
if (process.argv[2] === 'prod') {
  require('./server');
} else {
  require('./index');
}
