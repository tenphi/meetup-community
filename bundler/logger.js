import bunyan from 'bunyan';
import bformat from 'bunyan-format';

let formatOut = bformat({ outputMode: 'short' });

export default class Logger {
  constructor(name) {
    this.instance = bunyan.createLogger({
      name: name || 'logger',
      streams: [{
        level: 'debug',
        stream: formatOut
      }]
    });
  }

  trace(...args) {
    return this.instance.trace(...args);
  }

  debug(...args) {
    return this.instance.debug(...args);
  }

  info(...args) {
    return this.instance.info(...args);
  }

  error(...args) {
    return this.instance.error(...args);
  }

  fatal(...args) {
    return this.instance.fatal(...args);
  }
}
