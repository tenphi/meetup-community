class SignInCtrl {
  constructor(User, $log) {
    this.User = User;
    this.$log = $log;
    this.model = {
      email: '',
      password: ''
    };
  }

  login() {
    this.User.login(this.model)
      .then( data => {
        if (this.onLogged) {
          this.onLogged();
        }
        this.$log.info(data);
      })
      .catch( err => {
        this.$log.error(err);
      });
  }
}

SignInCtrl.$inject = ['User', '$log'];

export default {
  template: ( require('./sign-in-form.less'), require('./sign-in-form.html') ),
  transclude: true,
  bindings: {
    onLogged: '<'
  },
  controller: SignInCtrl
}
