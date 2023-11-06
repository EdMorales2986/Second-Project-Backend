import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import followers, { IFollower } from "../models/followers";
import likes, { ILike } from "../models/likes";
import tweets, { ITweet } from "../models/tweets";
import comments, { IComment } from "../models/comments";

export const followStatus = async function (req: Request, res: Response) {
  const follower = await users.findOne({ alias: req.params.fromUser });
  const user = await users.findOne({ alias: req.params.toUser });
  const isFollowed = await followers.findOne({
    followed: req.params.toUser,
    follower: req.params.fromUser,
  });

  if (user && follower) {
    if (!isFollowed && req.params.fromUser !== req.params.toUser) {
      const newFollow = new followers({
        followed: req.params.toUser,
        follower: req.params.fromUser,
      });
      await newFollow.save();
      return res.status(200).json({ followed: true });
    } else if (isFollowed && req.params.fromUser !== req.params.toUser) {
      await followers.deleteOne({
        followed: req.params.toUser,
        follower: req.params.fromUser,
      });
      return res.status(200).json({ followed: false });
    }
  }
  return res.status(400).json({ msg: "User not found" });
};

export const verifyStatus = async function (req: Request, res: Response) {
  const status = await followers.findOne({
    followed: req.params.toUser,
    follower: req.params.fromUser,
  });
  if (status) {
    return res.status(200).json({ liked: true });
  } else {
    return res.status(200).json({ liked: false });
  }
};

export const countFollowers = async function (req: Request, res: Response) {
  const FOLLOWING = await followers
    .countDocuments({ father: req.params.fromUser })
    .then((count) => {
      return res.json({ count });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};
