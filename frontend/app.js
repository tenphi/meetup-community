require('./app.less');

import angular from 'angular';
import { Module } from 'angular-decorators';
import RouterConfig from './router-config';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';

Module('app', [
  uiRouter,
  ngAnimate
])
  .config(RouterConfig);
