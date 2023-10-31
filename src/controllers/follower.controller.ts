import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import followers, { IFollower } from "../models/followers";
import likes, { ILike } from "../models/likes";
import tweets, { ITweet } from "../models/tweets";
import comments, { IComment } from "../models/comments";

export const followStatus = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.fromUser });
  const isFollowed = await followers.findOne({
    followed: req.params.toUser,
    follower: req.params.fromUser,
  });

  if (user && !isFollowed) {
    const newFollow = new followers({
      followed: req.params.toUser,
      follower: req.params.fromUser,
    });
    await newFollow.save();
    return res.status(200).json({ liked: true });
  } else if (user && isFollowed) {
    await followers.deleteOne({
      followed: req.params.toUser,
      follower: req.params.fromUser,
    });
    return res.status(200).json({ liked: false });
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
    .find({ follower: req.params.fromUser })
    .estimatedDocumentCount()
    .then((count) => {
      return res.json({ count });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};
