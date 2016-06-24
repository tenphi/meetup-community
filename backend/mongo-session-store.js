import Logger from './logger';
import session from 'express-session';
import connectMongoDBSession from 'connect-mongodb-session';

export default {
  init(server, config) {
    let log = new Logger('mongo-session-store');
    let dbConfig = config.db;
    let MongoDBStore = connectMongoDBSession(session);
    let connectString = `mongodb://${dbConfig.host || 'localhost'}:${dbConfig.port || 27017}/${dbConfig.name || 'sessiondb'}`;
    let store = new MongoDBStore(
      {
        uri: connectString,
        collection: 'sessions'
      });

    // catch errors
    store.on('error', err => log.error(err) );

    server.use(session({
      secret: config.salt,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      },
      store: store
    }));
  }
}