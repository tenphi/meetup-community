let argv = require('yargs').argv;

function toUpperCase(str) {
  return str.replace(/\-/g, '_').toUpperCase();
}

let env = {
  get(name) {
    return argv[name] || process['APP_' + toUpperCase(name)];
  }
};

env.isProduction = argv.production || process.NODE_ENV === 'production';
env.isDevelopment = !env.isProduction;

export default env;
