import Controller from '../controller';
import Logger from '../logger';
import passport from 'passport';
import Email from '../services/email';
import uuid from 'uuid';
import util from '../../universal/util';

let log = new Logger('auth-ctrl');

export default class AuthCtrl extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  login({ rememberMe }) {
    let { req, res } = this;

    return new Promise( (resolve, reject) => {
      passport.authenticate('local', {}, (err, user, info) => {
        if(err) return reject(err);

        if(!user) return reject('user not found');

        req.logIn(user, err => {
          if (err) return reject(err);

          if (rememberMe) {
            req.session.cookie.maxAge = 30*24*60*60*1000 ; //Remember user for 30 days
          } else {
            req.session.cookie.expires = false;
          }

          resolve(user.getProfile());
        });
      })(req, res);
    });
  }

  async signup({ email, username, password, fullName }) {
    let User = this.User;
    let user = await User.findOne({ email });

    if (user) {
      throw 'email exists';
    }

    user = await User.findOne({ username });

    if (user) {
      throw 'username exists';
    }

    user = new User({ email, username, password, fullName });

    await user.save();
    await Email.send({
      template: 'Confirmation',
      to: email,
      data: {
        code: user.confirmationCode
      }
    });

    return user;
  }

  logout() {
    this._authRequired();
    this.req.logout();
  }

  profile() {
    if (this._isAuthenticated()) {
      return this.user.getProfile();
    } else {
      return {}
    }
  }

  async getConfirmation(id) {
    let User = this.User;
    let user = await User.findOne({ confirmationCode: id });

    if (!user) {
      this.res.redirect('/notfound');
    } else {
      user.confirmed = true;
      user.confirmationCode = '';
      await user.save();
      this.res.redirect('/');
    }
  }
  
  async restorePassword({ email }) {
    let { User } = this;
    let user = await User.findOne({ email });

    if (!user) {
      throw 'user not found';
    } else {
      user.confirmationCode = uuid.v4();

      await user.save();
      await Email.send({
        template: 'RestorePassword',
        to: email,
        data: {
          code: user.confirmationCode
        }
      });
    }
  }

  async changePassword({ code, password }) {
    let { User } = this;
    let user = await User.findOne({ confirmationCode: code });

    if (!user) {
      throw 'user not found';
    } else {
      if (code !== user.confirmationCode) {
        throw 'wrong code';
      }

      let test = util.testPasswordStrength(password);

      if (!test.strong) {
        throw test;
      }

      user.confirmationCode = '';
      user.password = password;
      await user.save();
    }
  }
};