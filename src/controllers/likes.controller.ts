import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import followers, { IFollower } from "../models/followers";
import likes, { ILike } from "../models/likes";
import tweets, { ITweet } from "../models/tweets";
import comments, { IComment } from "../models/comments";

export const likeStatus = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.user });
  const tweet = await tweets.findOne({ _id: req.params.id });
  const isLiked = await likes.findOne({
    father: req.params.id,
    owner: req.params.user,
  });

  if (user && tweet) {
    if (!isLiked && tweet.owner !== req.params.user) {
      const newLike = new likes({
        owner: req.params.user,
        father: req.params.id,
      });
      await newLike.save();
      return res.status(200).json({ liked: true });
    } else if (isLiked && tweet.owner !== req.params.user) {
      await likes.deleteOne({ father: req.params.id });
      return res.status(200).json({ liked: false });
    }
  }
  return res.status(400).json({ msg: "User not found" });
};

export const verifyStatus = async function (req: Request, res: Response) {
  const status = await likes.findOne({
    father: req.params.id,
    owner: req.params.user,
  });
  if (status) {
    return res.status(200).json({ liked: true });
  } else {
    return res.status(200).json({ liked: false });
  }
};

export const countLikes = async function (req: Request, res: Response) {
  await likes
    .countDocuments({ father: req.params.id })
    .then((count) => {
      return res.json({ count });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};
