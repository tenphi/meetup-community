import util from './util';
import passport from 'passport';

export default class Controller {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.user = req.user;

    Object.assign(this, util.requireIntoObject('./models'));
  }

  _authRequired() {
    if (!this.req.isAuthenticated()) {
      throw 'auth required';
    }
  }

  _isAuthenticated() {
    return this.req.isAuthenticated();
  }
};
