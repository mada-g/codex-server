import mongoose from 'mongoose';

import imageData from './imageData.js';

export default mongoose.Schema({
  pageid: String,
  imgsData: [imageData]
})
