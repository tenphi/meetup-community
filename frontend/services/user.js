User.$inject = ['Auth', '$rootScope'];

function User(Auth, $rootScope) {
  let user = {
    logged: false,
    profile: {}
  };

  let profile = user.profile;

  function clearProfile() {
    Object.keys(profile)
      .forEach( key => delete profile[key] );
  }

  function updateProfile(newProfile) {
    clearProfile();
    Object.assign(profile, newProfile);
    user.profile.logged = !!profile.email;
    $rootScope.$applyAsync();
    return profile;
  }

  user.login = (model) => {
    model.rememberMe = true;
    return Auth.login(model)
      .then(profile => updateProfile(profile));
  };

  user.logout = () => Auth.logout()
    .finally( user.getProfile );

  user.signup = (...args) => Auth.signup(...args);

  user.getProfile = () => Auth.profile()
    .then( profile => updateProfile(profile) );

  user.getProfile();

  return user;
}

export default User;
