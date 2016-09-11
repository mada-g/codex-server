import mongoose from 'mongoose';

export default mongoose.Schema({
  pageid: String,
  title: String,
  sections: [String],
  items: String
})
