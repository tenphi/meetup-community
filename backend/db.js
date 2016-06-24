import mongoose from 'mongoose';
import Promise from 'bluebird';
import mongooseTypesExt from 'mongoose-types-ext';

mongoose.Promise = Promise;
mongooseTypesExt(mongoose);

export default {
  init(config) {
    let connectString = `mongodb://${config.host || 'localhost'}:${config.port || 27017}/${config.name || 'db'}`;
    let connection = mongoose.createConnection(connectString);

    this.connection = connection;
    this.model = connection.model.bind(connection);
    this.initialized = true;

    return this;
  },

  Schema: mongoose.Schema,
  Types: mongoose.Types
};
