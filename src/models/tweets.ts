import mongoose from "mongoose";

export interface ITweet extends mongoose.Document {
  owner: string;
  content: string;
  likes: number;
  image: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const tweetSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      require: true,
      trim: true,
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITweet>("tweet", tweetSchema);
