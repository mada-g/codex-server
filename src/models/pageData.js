import mongoose from 'mongoose';

export default mongoose.Schema({
  pageid: String,
  title: String,
  sections: [String],
  items: String,
  published: Boolean,
  headings: [String],
  headingNumbering: String,
  date: String
})
