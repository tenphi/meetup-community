class RestorePasswordForm {
  constructor(Auth, $log) {
    this.Auth = Auth;
    this.$log = $log;
    this.model = {
      email: '',
      password: '',
      code: this.code || ''
    };
  }

  change() {
    this.Auth.changePassword(this.model)
      .then( data => {
        if (this.onChanged) {
          this.onChanged();
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
  template: ( require('./change-password-form.less'), require('./change-password-form.html') ),
  transclude: true,
  bindings: {
    onChanged: '<',
    code: '<'
  },
  controller: RestorePasswordForm
};
