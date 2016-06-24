import ng from 'angular';
import uiRouter from 'angular-ui-router';

let moduleName = 'app.pages.restore-password';
let page = ng.module(moduleName, [uiRouter]);

class RestorePasswordCtrl {
  constructor($state, $stateParams) {
    this.code = $stateParams.code;
    
    this.onRestored = () => {
      $state.go('landing');
    }
  }
}

RestorePasswordCtrl.$inject = ['$state', '$stateParams'];

RouterConfig.$inject = ['$stateProvider'];

function RouterConfig($stateProvider) {
  $stateProvider
    .state('restore-password-with-code', {
      url: '/restore-password/:code',
      template: require('./restore-password.html'),
      controller: RestorePasswordCtrl,
      controllerAs: '$ctrl',
      title: 'Restore Password'
    })
    .state('restore-password', {
      url: '/restore-password',
      template: require('./restore-password.html'),
      controller: RestorePasswordCtrl,
      controllerAs: '$ctrl',
      title: 'Restore Password'
    });
}

page.config(RouterConfig);

export default moduleName;
