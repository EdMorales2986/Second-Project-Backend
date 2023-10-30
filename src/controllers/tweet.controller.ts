import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import followers, { IFollower } from "../models/followers";
import likes, { ILike } from "../models/likes";
import tweets, { ITweet } from "../models/tweets";
import comments, { IComment } from "../models/comments";

export const getAllTweetsNew = async function (req: Request, res: Response) {
  const TWEETS = await tweets.find({}).sort({ createdAt: -1 });
  return res.json(TWEETS);
};

export const getAllTweetsOld = async function (req: Request, res: Response) {
  const TWEETS = await tweets.find({}).sort({ createdAt: 1 });
  return res.json(TWEETS);
};

export const getAllFollowedTweets = async function (
  req: Request,
  res: Response
) {
  const user = await users.findOne({ alias: req.params.user });
  if (user) {
    const FOLLOWERS = await followers.find({ follower: req.params.user });
    const TWEETS = [];
    for (let i = 0; i < FOLLOWERS.length; i++) {
      const TWEET = await tweets.find({ owner: FOLLOWERS[i].followed });
      for (let j = 0; j < TWEET.length; j++) {
        TWEETS.push(TWEET[j]);
      }
    }
    return res.json(TWEETS);
  } else {
    return res.status(400).json({ msg: "User not found" });
  }
};

export const getAllTweetsLiked = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.user });
  if (user) {
    const LIKES = await likes.find({ owner: req.params.user });
    const TWEETS = [];
    for (let i = 0; i < LIKES.length; i++) {
      const TWEET = await tweets.find({ _id: LIKES[i].father });
      for (let j = 0; j < TWEET.length; j++) {
        TWEETS.push(TWEET[j]);
      }
    }
    return res.json(TWEETS);
  } else {
    return res.status(400).json({ msg: "User not found" });
  }
};

export const createTweet = async function (req: Request, res: Response) {
  if (!req.body.desc) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const user = await users.findOne({ alias: req.params.user });

  if (user) {
    const newTweet = new tweets(req.body);
    newTweet.owner = req.params.user;

    await newTweet.save();
    // user.tweets.push(newTweet._id);
    // await user.save();

    return res.status(200).json({ msg: "Tweet created" });
  } else {
    return res.status(400).json({ msg: "User not found" });
  }
};

export const deleteTweet = async function (req: Request, res: Response) {
  const TWEET = await tweets.findOne({ _id: req.params.id });

  if (TWEET && TWEET.owner === req.params.user) {
    await tweets.deleteOne({ _id: req.params.id });
    // await users.findOneAndUpdate(
    //   { alias: req.params.user },
    //   { $pull: { tweets: req.params.id } }
    // );
    return res.json({ msg: "Tweet deleted" });
  }
  return res
    .status(400)
    .json({ msg: "you are not allowed to delete this tweet" });
};

/* example of data
  {
    "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur placerat sodales arcu, nec accumsan neque scelerisque id. Aenean congue ultricies arcu non commodo.",
    "image": "https://i.imgur.com/MxcAKha.jpeg",
    "comments": [],
    "likes": ["abc", "def", "ghi", "jkl"]
  }
  {
    "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur placerat sodales arcu, nec accumsan neque scelerisque id. Aenean congue ultricies arcu non commodo.",
    "image": "https://i.imgur.com/MxcAKha.jpeg",
    "comments": [],
    "likes": [ "mno", "pqr"]
  }
*/
