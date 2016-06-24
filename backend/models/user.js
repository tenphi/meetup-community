import db from '../db';
import timestamps from 'mongoose-timestamp';
import bcrypt from 'bcrypt-nodejs';
import uuid from 'uuid';

let Schema = db.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 32
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    minlength: 6,
    maxlength: 64
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64
  },
  fullName: {
    type: String
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmationCode: {
    type: String,
    default: uuid.v4.bind(uuid),
    index: true
  }
}, { strict: true });

userSchema.plugin(timestamps);

userSchema.pre('save', function(callback) {
  if (!this.isModified('password')) return callback();

  bcrypt.genSalt(5, (err, salt) => {
    if (err) return callback(err);

    bcrypt.hash(this.password, salt, null, (err, hash) => {
      if (err) return callback(err);

      this.password = hash;
      callback();
    });
  });
});

userSchema.methods.verifyPassword = function(password) {
  return new Promise( (resolve, reject) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
      if (err) return reject(err);

      resolve(isMatch);
    });
  });
};

userSchema.methods.getProfile = function() {
  return {
    email: this.email,
    username: this.username
  };
};

let User = db.initialized ? db.model('User', userSchema) : {};

export default User;
