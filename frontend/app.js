require('./app.less');
require('./blocks/all.less');

window.CONFIG = require('./config.json');

import ng from 'angular';
import RouterConfig from './router-config';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import ngBem from 'angular-bem';
import ApiGenerator from './vendor/api-generator';

// pages
import LandingPage from './pages/landing/landing';
import SignUpPage from './pages/sign-up/sign-up';
import SignInPage from './pages/sign-in/sign-in';
import RestorePasswordPage from './pages/restore-password/restore-password';
import ChangePasswordPage from './pages/change-password/change-password';

// components
import signUpFormBlock from './blocks/sign-up-form/sign-up-form';
import signInFormBlock from './blocks/sign-in-form/sign-in-form';
import restorePasswordFormBlock from './blocks/restore-password-form/restore-password-form';
import changePasswordFormBlock from './blocks/change-password-form/change-password-form';
import inputBlock from './blocks/input/input';
import btnBlock from './blocks/btn/btn';
import accountWidget from './blocks/account-widget/account-widget';

// services
import AuthService from './services/auth';
import UserService from './services/user';

ng.module('app', [
  uiRouter,
  ngAnimate,
  ApiGenerator,
  ngBem,
  LandingPage,
  SignUpPage,
  SignInPage,
  RestorePasswordPage,
  ChangePasswordPage
])
  .service('Auth', AuthService)
  .service('User', UserService)
  .component('uiInput', inputBlock)
  .component('uiSignUpForm', signUpFormBlock)
  .component('uiSignInForm', signInFormBlock)
  .component('uiRestorePasswordForm', restorePasswordFormBlock)
  .component('uiChangePasswordForm', changePasswordFormBlock)
  .component('uiBtn', btnBlock)
  .component('uiAccountWidget', accountWidget)
  .config(['APIProvider', '$logProvider', function(APIProvider, $logProvider) {
    APIProvider.debug(CONFIG.env === 'development');
    APIProvider.config(CONFIG.api);

    $logProvider.debugEnabled(CONFIG.env === 'development');
  }])

  .config(RouterConfig)

  .run(['$rootScope', 'User', function($rootScope, User) {
    $rootScope.$config = CONFIG;
    $rootScope.$user = User.profile;
  }]);
