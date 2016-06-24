import Controller from '../controller';
import Logger from '../logger';

let log = new Logger('events-ctrl');

export default class EventsCtrl extends Controller {
  constructor(req, res) {
    super(req, res);
  }

  getAll() {
    return [];
  }

  get(id) {
    return {};
  }
};