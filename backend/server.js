import Promise from 'bluebird';
import express from 'express';
import path from 'path';
import Logger from './logger';
import fs from 'fs';
import ApiGenerator from './vendor/express-api-generator';
import db from './db';
import Auth from './auth';
import requireDir from 'require-dir';
import util from './util';
import MongoSessionStore from './mongo-session-store';

let log = new Logger('server');

export default class Server {
  constructor(config) {
    let conf = Object.assign({}, config);
    delete conf.salt;
    log.info('config', conf);

    let instance = this.instance = express();
    this.config = config;

    this.db = db.init(config.db.main);

    MongoSessionStore.init(instance, config.sessions);

    instance.use(require('body-parser').json());
    instance.use(require('cookie-parser')(config.salt));
  }

  async init() {
    log.info('initializing...');

    // async loading of modules is kind of a hack
    // 'cause they won't work in sync-loading way
    let data = util.requireIntoObject('./models');
    let services = util.requireIntoObject('./services');

    data.config = this.config;

    let promises = Object.keys(services)
      .map( async name => {
        Object.assign(services[name], data);
        return services[name].init && services[name].init(data);
      });

    Auth.init(this.instance);

    return Promise.all(promises)
      .then( () => Object.assign(this, services) )
      .catch( error => log.error(error) );
  }

  routes() {
    this.instance.use(express.static(this.config.paths.public));

    log.info('routes');
    let api = new ApiGenerator(
      util.requireIntoArray('./controllers'),
      { Logger }
    );

    api.bind(this.instance);
  }

  fallback() {
    this.instance.get('/*', (req, res) => {
      res.sendFile(path.resolve(this.config.paths.assets, 'index.html'));
    });
  }

  async run() {
    return new Promise( (resolve, reject) => {
      this.instance.listen(this.config.port, (err) => {
        if (err) {
          return reject(err);
        }

        log.info('Server running on port ' + this.config.port);
        resolve();
      });
    });
  }
}
