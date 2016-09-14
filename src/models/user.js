import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

import pageData from './pageData.js';
import imageData from './imageData.js';
import pageInfo from './pageInfo.js';

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  usid: String,
  valid: Boolean,
  drafts: [pageInfo],
  published: [pageInfo],
  journalCollection: [pageData],
  pageImgs: [{
    pageid: String,
    imgsData: [imageData]
  }]

});

/*userSchema.methods.genHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
}

userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.local.password);
}*/

export default mongoose.model('User', userSchema);
