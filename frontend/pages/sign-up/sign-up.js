import ng from 'angular';
import uiRouter from 'angular-ui-router';

let moduleName = 'app.pages.sign-up';
let page = ng.module(moduleName, [uiRouter]);

RouterConfig.$inject = ['$stateProvider'];

function RouterConfig($stateProvider) {
  $stateProvider
    .state('sign-up', {
      url: '/sign-up',
      template: require('./sign-up.html'),
      title: 'Sign Up'
    });
}

page.config(RouterConfig);

export default moduleName;
