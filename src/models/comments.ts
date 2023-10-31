import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
  owner: string;
  desc: string;
  image: string;
  father: string;
  // likes: string[];
}

const CommentSchema = new mongoose.Schema(
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
    father: {
      type: String,
      require: true,
      trim: true,
    },
    // likes: {
    //   type: [String],
    //   default: [],
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
