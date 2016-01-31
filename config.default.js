import env from './bundler/env';

let ssl = env.get('ssl') || false;
let host = env.get('host') || (env.isProduction ? 'example.com' : 'localhost');
let port = env.get('port') || (env.isProduction ? 8080 : 3000);

let server = {
  env: env.isProduction ? 'production' : 'development',
  host,
  port,
  ssl,
  url: 'http' + (ssl ? 's' : '') + '://' + host + (env.isProduction ? '' : ':' + port) + '/'
};

let publicConfig = {};

['env', 'host', 'port', 'ssl', 'url'].forEach( key => publicConfig[key] = server[key] );

export { publicConfig };
export default server;
