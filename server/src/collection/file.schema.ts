import * as mongoose from 'mongoose';

export const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  path: {
    type: String,
    required: true,
  },
  repoPath: {
    type: String,
    required: true,
  },
  parentHash: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  isDir: {
    type: Boolean,
    required: true,
  },
  ctime: {
    type: Number,
    index: true,
    default: Date.now,
  },
  mimeType: {
    type: String,
    index: true,
    default: 'unknown',
  },
});
