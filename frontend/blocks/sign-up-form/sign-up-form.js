class SignUpCtrl {
  constructor(Auth) {
    this.Auth = Auth;
    this.model = {
      username: '',
      email: '',
      password: '',
      fullName: ''
    };
  }

  submit() {
    this.Auth.signup(this.model)
      .then( data => {
        console.log(data);
      })
      .catch( err => {
        console.error(err);
      });
  }
}

SignUpCtrl.$inject = ['Auth'];

export default {
  template: ( require('./sign-up-form.less'), require('./sign-up-form.html') ),
  transclude: true,
  bindings: {},
  controller: SignUpCtrl
}
