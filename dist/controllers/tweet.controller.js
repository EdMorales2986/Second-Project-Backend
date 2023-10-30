"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTweet = exports.createTweet = exports.getAllTweetsLiked = exports.getAllFollowedTweets = exports.getAllTweetsOld = exports.getAllTweetsNew = void 0;
const users_1 = __importDefault(require("../models/users"));
const followers_1 = __importDefault(require("../models/followers"));
const likes_1 = __importDefault(require("../models/likes"));
const tweets_1 = __importDefault(require("../models/tweets"));
const getAllTweetsNew = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const TWEETS = yield tweets_1.default.find({}).sort({ createdAt: -1 });
        return res.json(TWEETS);
    });
};
exports.getAllTweetsNew = getAllTweetsNew;
const getAllTweetsOld = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const TWEETS = yield tweets_1.default.find({}).sort({ createdAt: 1 });
        return res.json(TWEETS);
    });
};
exports.getAllTweetsOld = getAllTweetsOld;
const getAllFollowedTweets = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (user) {
            const FOLLOWERS = yield followers_1.default.find({ follower: req.params.user });
            const TWEETS = [];
            for (let i = 0; i < FOLLOWERS.length; i++) {
                const TWEET = yield tweets_1.default.find({ owner: FOLLOWERS[i].followed });
                for (let j = 0; j < TWEET.length; j++) {
                    TWEETS.push(TWEET[j]);
                }
            }
            return res.json(TWEETS);
        }
        else {
            return res.status(400).json({ msg: "User not found" });
        }
    });
};
exports.getAllFollowedTweets = getAllFollowedTweets;
const getAllTweetsLiked = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (user) {
            const LIKES = yield likes_1.default.find({ owner: req.params.user });
            const TWEETS = [];
            for (let i = 0; i < LIKES.length; i++) {
                const TWEET = yield tweets_1.default.find({ _id: LIKES[i].father });
                for (let j = 0; j < TWEET.length; j++) {
                    TWEETS.push(TWEET[j]);
                }
            }
            return res.json(TWEETS);
        }
        else {
            return res.status(400).json({ msg: "User not found" });
        }
    });
};
exports.getAllTweetsLiked = getAllTweetsLiked;
const createTweet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.desc) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (user) {
            const newTweet = new tweets_1.default(req.body);
            newTweet.owner = req.params.user;
            yield newTweet.save();
            // user.tweets.push(newTweet._id);
            // await user.save();
            return res.status(200).json({ msg: "Tweet created" });
        }
        else {
            return res.status(400).json({ msg: "User not found" });
        }
    });
};
exports.createTweet = createTweet;
const deleteTweet = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const TWEET = yield tweets_1.default.findOne({ _id: req.params.id });
        if (TWEET && TWEET.owner === req.params.user) {
            yield tweets_1.default.deleteOne({ _id: req.params.id });
            // await users.findOneAndUpdate(
            //   { alias: req.params.user },
            //   { $pull: { tweets: req.params.id } }
            // );
            return res.json({ msg: "Tweet deleted" });
        }
        return res
            .status(400)
            .json({ msg: "you are not allowed to delete this tweet" });
    });
};
exports.deleteTweet = deleteTweet;
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
