export default {
  template: ( require('./btn.less'), require('./btn.html') ),
  bindings: {
    type: '@',
    text: '@'
  },
  transclude: true
}
