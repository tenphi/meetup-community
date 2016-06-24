
angular.module('api.generator', [])
  .provider('API', function() {
    let API = {};
    let routes = {};
    let debug = false;

    this.config = function(_routes) {
      routes = _routes;
    };

    this.debug = function(bool) {
      debug = !!bool;
    };

    this.$get = ['$http', function($http) {
      for (let route of routes) {
        let ctrlName = route.ctrlName;
        let url = route.url;

        if (!API[ctrlName]) {
          API[ctrlName] = {};
        }

        let service = API[ctrlName];

        if (debug) console.debug('endpoint registered', ctrlName + '.' + route.handler + '(' + (route.id ? 'id, ' : '') + 'data) ->', route.method + ':' + url);

        service[route.handler] = function(...args) {
          let url = route.url;
          let data;

          if (route.id) {
            url = url.replace(':id', args[0]);
            data = args[1];
          } else {
            data = args[0];
          }

          if (debug) console.debug('requested', route.method + ':' + url, data);

          let options = {
            url,
            method: route.method
          };

          if (~['post', 'update'].indexOf(route.method)) {
            options.data = data;
          } else {
            options.params = data;
          }

          return $http(options).then( (response) => {
            let data = response.data;

            if (debug) console.debug('received', route.method + ':' + url, data);

            return data;
          }, (response) => {
            let error = response.data ? response.data.error : 'internal error';

            if (debug) console.error('received', route.method + ':' + url, error);

            throw error;
          });
        };
      }

      return API;
    }];
  });

export default 'api.generator';