import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import followers, { IFollower } from "../models/followers";
import likes, { ILike } from "../models/likes";
import tweets, { ITweet } from "../models/tweets";
import comments, { IComment } from "../models/comments";

export const getAllComments = async function (req: Request, res: Response) {
  const COMMENTS = await comments.find({ father: req.params.id });
  return res.json(COMMENTS);
};

export const createComment = async function (req: Request, res: Response) {
  if (!req.body.desc) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const user = await users.findOne({ alias: req.params.user });

  if (user) {
    const newComment = new comments(req.body);
    newComment.owner = req.params.user;
    newComment.father = req.params.father;

    await newComment.save();

    return res.status(200).json({ msg: "Comment created" });
  } else {
    return res.status(400).json({ msg: "User not found" });
  }
};

export const deleteComment = async function (req: Request, res: Response) {
  const COMMENT = await comments.findOne({ _id: req.params.id });

  if (COMMENT && COMMENT.owner === req.params.user) {
    await comments.deleteOne({ _id: req.params.id });
    await likes.deleteMany({ father: req.params.id });

    return res.json({ msg: "Comment deleted" });
  }
  return res
    .status(400)
    .json({ msg: "you are not allowed to delete this Comment" });
};

export const modifyComment = async function (req: Request, res: Response) {
  const COMMENT = await comments.findOne({ _id: req.params.id });
  if (COMMENT && COMMENT.owner === req.params.user) {
    COMMENT.desc =
      req.body.desc !== undefined && req.body.desc !== ""
        ? req.body.desc
        : COMMENT.desc;
    COMMENT.image =
      req.body.image !== undefined && req.body.image !== ""
        ? req.body.image
        : COMMENT.image;
    await COMMENT.save();

    return res.status(200).json({ msg: "Comment updated" });
  }
  return res
    .status(400)
    .json({ msg: "you are not allowed to modify this Comment" });
};

export const likeStatus = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.user });
  const comment = await comments.findOne({ _id: req.params.id });
  const isLiked = await likes.findOne({
    father: req.params.id,
    owner: req.params.user,
  });

  if (user && comment) {
    if (!isLiked && comment.owner !== req.params.user) {
      const newLike = new likes({
        owner: req.params.user,
        father: req.params.id,
      });
      await newLike.save();
      return res.status(200).json({ liked: true });
    } else if (isLiked && comment.owner !== req.params.user) {
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
  const LIKES = await likes
    .countDocuments({ father: req.params.id })
    .then((count) => {
      return res.json({ count });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};

export const countComments = async function (req: Request, res: Response) {
  const COMMENTS = await comments
    .countDocuments({ father: req.params.id })
    .then((count) => {
      return res.json({ count });
    })
    .catch((err) => {
      return res.status(400).json({ err });
    });
};
