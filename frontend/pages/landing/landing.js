import ng from 'angular';
import uiRouter from 'angular-ui-router';

let moduleName = 'app.pages.landing';
let page = ng.module(moduleName, [uiRouter]);

RouterConfig.$inject = ['$stateProvider'];

function RouterConfig($stateProvider) {
  $stateProvider
    .state('landing', {
      url: '/',
      template: require('./landing.html'),
      title: ''
    });
}

page.config(RouterConfig);

export default moduleName;
