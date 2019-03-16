import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema({
  activateAt: {
    type: Number,
    index: true,
    default: Date.now,
  },

  collectionBrowseHistory: {
    type: [{
      _id: false,
      name: String,
      imageCount: Number,
      lasting: Number,
      score: Number,
    }],
    default: [],
    index: true,
  },
});
