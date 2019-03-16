import * as mongoose from 'mongoose';

export const CollectionSchema = new mongoose.Schema({
  hash: {
    type: String,
    index: true,
    required: true,
  },
  name: {
    type: String,
    index: true,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  path: {
    type: String,
    index: true,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  imageCount: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
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
