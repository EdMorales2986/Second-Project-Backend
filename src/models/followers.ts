import mongoose from "mongoose";

export interface IFollower extends mongoose.Document {
  followed: string;
  follower: string;
}

const FollowerSchema = new mongoose.Schema({
  followed: {
    type: String,
    require: true,
  },
  follower: {
    type: String,
    require: true,
  },
});

export default mongoose.model<IFollower>("Follower", FollowerSchema);
