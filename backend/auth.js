import passport from 'passport';
import passportLocal from 'passport-local';
import Logger from './logger';

let Strategy = passportLocal.Strategy;
let log = new Logger('auth');

export default {
  init(server) {
    let User = require('./models/user').default;

    passport.use(new Strategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      (email, password, cb) => {
        User.findOne({ email }, function(err, user) {
          if (err) return cb(err);
          if (!user) return cb('user not found');
          if (!user.confirmed) return cb('email not confirmed');

          user.verifyPassword(password)
            .then( isMatch => cb( !isMatch ? 'wrong password' : null, isMatch ? user : false) )
            .catch(cb);
        });
      }));

    passport.serializeUser( (user, cb) => {
      cb(null, user._id.toString());
    });

    passport.deserializeUser( (id, cb) => {
      User.findOne({ _id: id }, cb);
    });

    server.use(passport.initialize());
    server.use(passport.session());
  }
};