import env from './bundler/env';

export default class Config {
  constructor(mode, isPublic) {
    let sessionSalt = 'p[7`UHGZ5^5W>[:Et|>=!}U#_1}+S=NAF)P$hp9>m#lU,+=fQ}*_Rp84kR>cudz/';
    let ssl = env.get('ssl') || false;
    let host = env.get('host') || (mode === 'production' ? 'rhythim.co' : 'localhost');
    let port = env.get('port') || (mode === 'production' ? 8080 : 3000);

    this.env = mode;
    this.host = host;
    this.port = port;
    this.ssl = ssl;
    this.url = `http${(ssl ? 's' : '')}://${host}${(mode === 'production' ? '' : ':' + port)}/`;
    this.title = 'Rhythim';

    if (!isPublic) {
      this.paths = {
        backend: './backend',
        frontend: './frontend',
        universal: './universal',
        public: './public',
        assets: './public/assets'
      };

      this.db = {
        main: {
          host: 'localhost',
          port: 27017,
          name: 'rhythim'
        }
      };

      this.sessions = {
        db: {
          host: 'localhost',
          port: 27017,
          name: 'rhythim_sessions'
        },
        salt: sessionSalt
      }
    }
  }
};
