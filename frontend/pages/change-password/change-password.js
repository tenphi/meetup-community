import ng from 'angular';
import uiRouter from 'angular-ui-router';

let moduleName = 'app.pages.change-password';
let page = ng.module(moduleName, [uiRouter]);

class ChangePasswordCtrl {
  constructor($state, $stateParams) {
    this.code = $stateParams.code;
    
    this.onChanged = () => {
      $state.go('landing');
    }
  }
}

ChangePasswordCtrl.$inject = ['$state', '$stateParams'];

RouterConfig.$inject = ['$stateProvider'];

function RouterConfig($stateProvider) {
  $stateProvider
    .state('change-password', {
      url: '/change-password/:code',
      template: require('./change-password.html'),
      controller: ChangePasswordCtrl,
      controllerAs: '$ctrl',
      title: 'Restore Password'
    });
}

page.config(RouterConfig);

export default moduleName;
