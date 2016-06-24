class RestorePasswordForm {
  constructor(Auth, $log) {
    this.Auth = Auth;
    this.$log = $log;
    this.model = {
      email: ''
    };
  }

  restore() {
    this.Auth.restorePassword(this.model)
      .then( data => {
        if (this.onRestored) {
          this.onRestored();
        }
        this.$log.info(data);
      })
      .catch( err => {
        this.$log.error(err);
      });
  }
}

RestorePasswordForm.$inject = ['Auth', '$log'];

export default {
  template: ( require('./restore-password-form.less'), require('./restore-password-form.html') ),
  transclude: true,
  bindings: {
    onRestored: '<',
    code: '<'
  },
  controller: RestorePasswordForm
};
