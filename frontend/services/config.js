export default function ConfigProvider() {
  this.$get = () => require('../config.json');
};