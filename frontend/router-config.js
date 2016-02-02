import { Inject } from 'angular-decorators';
import LandingCtrl from './pages/landing/landing.ctrl';

function RouterConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('landing', {
      url: '/',
      template: require('./pages/landing/landing.html'),
      controller: LandingCtrl,
      title: ''
    });
}

export default ['$stateProvider', '$urlRouterProvider', '$locationProvider', RouterConfig];