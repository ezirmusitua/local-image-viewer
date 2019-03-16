import * as mongoose from 'mongoose';

export const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    required: true,
  },
  path: {
    type: String,
    index: true,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  fileCount: {
    type: Number,
    default: 0,
  },
  files: {
    type: [{
      _id: false,
      name: String,
    }],
  },
  updateAt: {
    type: Number,
    index: true,
    default: Date.now,
  },
  valid: {
    type: Boolean,
    index: true,
    default: true,
  },
});
