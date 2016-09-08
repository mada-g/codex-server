import mongoose from 'mongoose';

let journalSchema = mongoose.Schema({
  title: String,
  sections: [String],
  items: String,
})

export default journalSchema;
