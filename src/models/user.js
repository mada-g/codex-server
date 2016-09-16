import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import pageData from './pageData.js';
import pageInfo from './pageInfo.js';
import pageImages from './pageImages.js';

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  usid: String,
  valid: Boolean,
  journalCollection: [pageData],
  pageImgs: [pageImages]

});

/*userSchema.methods.genHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
}

userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.local.password);
}*/

export default mongoose.model('User', userSchema);
