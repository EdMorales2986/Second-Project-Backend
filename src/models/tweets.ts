import mongoose from "mongoose";

export interface ITweet extends mongoose.Document {
  owner: string;
  desc: string;
  image: string;
  // comments: string[];
  // likes: string[];
}

const tweetSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      require: true,
      trim: true,
    },
    desc: {
      type: String,
      require: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    // likes: {
    //   type: [String],
    //   default: [],
    // },
    // comments: {
    //   type: [String],
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITweet>("tweet", tweetSchema);
