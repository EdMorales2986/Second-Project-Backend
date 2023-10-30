import mongoose from "mongoose";

export interface ILike extends mongoose.Document {
  owner: string;
  father: string;
}

const LikeSchema = new mongoose.Schema({
  owner: {
    type: String,
    require: true,
  },
  father: {
    type: String,
    require: true,
  },
});

export default mongoose.model<ILike>("Like", LikeSchema);
