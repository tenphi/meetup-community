import Config from './config';
import Server from './backend/server';
import Logger from './backend/logger';

let log = new Logger('main');
let config, server;

log.info('Starting production server...');

config = new Config('production');
server = new Server(config);

server.init()
  .then( () => {
    server.routes();
    server.fallback();
    server.run()
      .catch( err => log(err) );
  });