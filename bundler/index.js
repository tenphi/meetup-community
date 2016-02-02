import Promise from 'bluebird';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackConfigGenerator from './webpack-config-generator.js';
import BundlerLogger from './logger';
import request from 'request';
import httpProxy from 'http-proxy';

export default class Bundler {
  constructor({ Logger, config, appConfig, publicAppConfig, port } = {}) {
    let bundleStart;

    Logger = Logger || BundlerLogger;
    this.config = config || webpackConfigGenerator(appConfig, publicAppConfig);
    this.log = new Logger('bundler');
    this.port = port || 3001;
    this.compiler = Webpack(this.config);

    this.compiler.plugin('compile', () => {
      this.log.info('Bundling started...');
      bundleStart = Date.now();
    });

    this.compiler.plugin('done', () => {
      this.log.info('Bundling completed in ' + (Date.now() - bundleStart) + 'ms!');
    });
  }

  compile() {
    return new Promise( (resolve, reject) => {
      this.compiler.run( (err, stats) => err ? reject(err) : resolve(stats) );
    });
  }

  /* TODO: serve() */
  serve(appServer) {
    let { log } = this;

    return (new Promise( (resolve, reject) => {
      this.server = new WebpackDevServer(this.compiler, {
        // We need to tell Webpack to serve our bundled application
        // from the assets path when proxying.
        publicPath: '/assets/',

        // Configure hot replacement
        hot: true,

        historyApiFallback: true,

        // The rest is terminal configurations
        quiet: false,
        noInfo: true,
        stats: {
          colors: true
        }
      });

      // We fire up the development server and give notice in the terminal
      // that we are starting the initial bundle
      this.server.listen(this.port, 'localhost', (err) => {
        if (err) {
          return reject(err);
        }

        log.info('Development server running on port ' + this.port);
        resolve(this.server);
      });
    })).then( () => {
      if (appServer) {
        return this.bindServer(appServer);
      }
    });
  }

  bindServer(server) {
    let proxy = httpProxy.createProxyServer();

    proxy.on('error', e => {
      log.error('Could not connect to proxy, please try again...');
    });

    server.instance.all(
      ['/assets/*', '*.hot-update.json'],
      (req, res) => {
        proxy.web(req, res, {
          target: `http://localhost:${this.port}`
        });
      }
    );

    server.routes();

    server.instance.all('/*', (req, res) => {
      request(
        `http://localhost:${this.port}/assets/index.html`,
        (error, response, body) => {
          if (!error && response.statusCode == 200) {
            res.send(body);
          } else {
            res.end();
          }
        }
      );
    });


    return server.run();
  }
};
