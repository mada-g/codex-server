import mongoose from 'mongoose';

export default mongoose.Schema({
  imgid: String,
  name: String,
  type: String,
  dimen: {width: Number, height: Number},
  url: String,
  submit: String,
  uploaded: Boolean
})
