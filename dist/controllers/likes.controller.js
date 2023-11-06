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
exports.countLikes = exports.verifyStatus = exports.likeStatus = void 0;
const users_1 = __importDefault(require("../models/users"));
const likes_1 = __importDefault(require("../models/likes"));
const tweets_1 = __importDefault(require("../models/tweets"));
const likeStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        const tweet = yield tweets_1.default.findOne({ _id: req.params.id });
        const isLiked = yield likes_1.default.findOne({
            father: req.params.id,
            owner: req.params.user,
        });
        if (user && tweet) {
            if (!isLiked && tweet.owner !== req.params.user) {
                const newLike = new likes_1.default({
                    owner: req.params.user,
                    father: req.params.id,
                });
                yield newLike.save();
                return res.status(200).json({ liked: true });
            }
            else if (isLiked && tweet.owner !== req.params.user) {
                yield likes_1.default.deleteOne({ father: req.params.id });
                return res.status(200).json({ liked: false });
            }
        }
        return res.status(400).json({ msg: "User not found" });
    });
};
exports.likeStatus = likeStatus;
const verifyStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = yield likes_1.default.findOne({
            father: req.params.id,
            owner: req.params.user,
        });
        if (status) {
            return res.status(200).json({ liked: true });
        }
        else {
            return res.status(200).json({ liked: false });
        }
    });
};
exports.verifyStatus = verifyStatus;
const countLikes = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield likes_1.default
            .countDocuments({ father: req.params.id })
            .then((count) => {
            return res.json({ count });
        })
            .catch((err) => {
            return res.status(400).json({ err });
        });
    });
};
exports.countLikes = countLikes;
