import field from '../field/field';

class InputCtrl {
  constructor() {
    if (!this.type) {
      this.type = 'text';
    }
  }
}

let input = Object.assign({}, field, {
  template: ( require('./input.less'), require('./input.html') ),
  bindings: {
    id: '@',
    model: '=',
    label: '@',
    type: '@',
    disabled: '<'
  },
  controller: InputCtrl
});

export default input;