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
exports.countFollowers = exports.verifyStatus = exports.followStatus = void 0;
const users_1 = __importDefault(require("../models/users"));
const followers_1 = __importDefault(require("../models/followers"));
const followStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const follower = yield users_1.default.findOne({ alias: req.params.fromUser });
        const user = yield users_1.default.findOne({ alias: req.params.toUser });
        const isFollowed = yield followers_1.default.findOne({
            followed: req.params.toUser,
            follower: req.params.fromUser,
        });
        if (user && follower) {
            if (!isFollowed && req.params.fromUser !== req.params.toUser) {
                const newFollow = new followers_1.default({
                    followed: req.params.toUser,
                    follower: req.params.fromUser,
                });
                yield newFollow.save();
                return res.status(200).json({ followed: true });
            }
            else if (isFollowed && req.params.fromUser !== req.params.toUser) {
                yield followers_1.default.deleteOne({
                    followed: req.params.toUser,
                    follower: req.params.fromUser,
                });
                return res.status(200).json({ followed: false });
            }
        }
        return res.status(400).json({ msg: "User not found" });
    });
};
exports.followStatus = followStatus;
const verifyStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = yield followers_1.default.findOne({
            followed: req.params.toUser,
            follower: req.params.fromUser,
        });
        if (status) {
            return res.status(200).json({ followed: true });
        }
        else {
            return res.status(200).json({ followed: false });
        }
    });
};
exports.verifyStatus = verifyStatus;
const countFollowers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const FOLLOWING = yield followers_1.default
            .countDocuments({ follower: req.params.fromUser })
            .then((count) => {
            return res.json({ count });
        })
            .catch((err) => {
            return res.status(400).json({ err });
        });
    });
};
exports.countFollowers = countFollowers;
