import md5 from 'md5';

class AccountWidgetCtrl {
  constructor(User) {
    this.User = User;
    this.profile = User.profile;
    window.md5 = md5;
  }

  getAvatarUrl() {
    if (this.profile) {
      return `https://gravatar.com/avatar/${md5(this.profile.email)}`;
    }
  }

  logout() {
    this.User.logout();
  }
}

AccountWidgetCtrl.$inject = ['User'];

export default {
  template: ( require('./account-widget.less'), require('./account-widget.html') ),
  bindings: {
    type: '@'
  },
  controller: AccountWidgetCtrl
}
