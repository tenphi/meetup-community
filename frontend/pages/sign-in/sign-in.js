import ng from 'angular';
import uiRouter from 'angular-ui-router';

let moduleName = 'app.pages.sign-in';
let page = ng.module(moduleName, [uiRouter]);

class AuthCtrl {
  constructor($state) {
    this.onLogged = () => {
      $state.go('landing');
    }
  }
}

AuthCtrl.$inject = ['$state'];

RouterConfig.$inject = ['$stateProvider'];

function RouterConfig($stateProvider) {
  $stateProvider
    .state('sign-in', {
      url: '/sign-in',
      template: require('./sign-in.html'),
      controller: AuthCtrl,
      controllerAs: '$ctrl',
      title: 'Sign In'
    });
}

page.config(RouterConfig);

export default moduleName;
