import Promise from 'bluebird';
import Webpack from 'webpack';
import webpackConfigGenerator from './webpack-config-generator.js';
import BundlerLogger from './logger';

export default class Bundler {
  constructor({ Logger, config, appConfig, publicAppConfig, port } = {}) {
    let bundleStart;

    Logger = Logger || BundlerLogger;
    this.config = config || webpackConfigGenerator(appConfig, publicAppConfig);
    this.log = new Logger('bundler');
    this.port = port || 3001;
    this.compiler = Webpack(this.config);

    this.log.info('Webpack instance created');

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
  serve() {
    let { log } = this;

    return new Promise( (resolve, reject) => {
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

        log.info('development server running on port ' + this.port);
        resolve(this.server);
      });
    });
  }
};
