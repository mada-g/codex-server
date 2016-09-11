import mongoose from 'mongoose';

let journalSchema = mongoose.Schema({
  username: String,
  journalCollection: [{
    pageid: String,
    title: String,
    sections: [String],
    items: String
  }],
})

export default journalSchema;
