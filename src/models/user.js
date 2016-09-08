import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import journalSchema from './journal.js';

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  usid: String,
  valid: Boolean,
  journalCollection: [{
    pageid: String,
    title: String,
    sections: [String],
    items: String
  }],
});

/*userSchema.methods.genHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
}

userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.local.password);
}*/

export default mongoose.model('User', userSchema);
