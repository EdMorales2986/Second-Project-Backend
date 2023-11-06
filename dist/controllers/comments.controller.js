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
exports.countComments = exports.countLikes = exports.verifyStatus = exports.likeStatus = exports.modifyComment = exports.deleteComment = exports.createComment = exports.getAllComments = void 0;
const users_1 = __importDefault(require("../models/users"));
const likes_1 = __importDefault(require("../models/likes"));
const comments_1 = __importDefault(require("../models/comments"));
const getAllComments = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const COMMENTS = yield comments_1.default.find({ father: req.params.id });
        return res.json(COMMENTS);
    });
};
exports.getAllComments = getAllComments;
const createComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body.desc) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (user) {
            const newComment = new comments_1.default(req.body);
            newComment.owner = req.params.user;
            newComment.father = req.params.father;
            yield newComment.save();
            return res.status(200).json({ msg: "Comment created" });
        }
        else {
            return res.status(400).json({ msg: "User not found" });
        }
    });
};
exports.createComment = createComment;
const deleteComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const COMMENT = yield comments_1.default.findOne({ _id: req.params.id });
        if (COMMENT && COMMENT.owner === req.params.user) {
            yield comments_1.default.deleteOne({ _id: req.params.id });
            return res.json({ msg: "Comment deleted" });
        }
        return res
            .status(400)
            .json({ msg: "you are not allowed to delete this Comment" });
    });
};
exports.deleteComment = deleteComment;
const modifyComment = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const COMMENT = yield comments_1.default.findOne({ _id: req.params.id });
        if (COMMENT && COMMENT.owner === req.params.user) {
            COMMENT.desc =
                req.body.desc !== undefined || req.body.desc !== ""
                    ? req.body.desc
                    : COMMENT.desc;
            COMMENT.image =
                req.body.image !== undefined || req.body.image !== ""
                    ? req.body.image
                    : COMMENT.image;
            yield COMMENT.save();
            return res.status(200).json({ msg: "Comment updated" });
        }
        return res
            .status(400)
            .json({ msg: "you are not allowed to modify this Comment" });
    });
};
exports.modifyComment = modifyComment;
const likeStatus = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        const comment = yield comments_1.default.findOne({ _id: req.params.id });
        const isLiked = yield likes_1.default.findOne({
            father: req.params.id,
            owner: req.params.user,
        });
        if (user && comment) {
            if (!isLiked && comment.owner !== req.params.user) {
                const newLike = new likes_1.default({
                    owner: req.params.user,
                    father: req.params.id,
                });
                yield newLike.save();
                return res.status(200).json({ liked: true });
            }
            else if (isLiked && comment.owner !== req.params.user) {
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
        const LIKES = yield likes_1.default
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
const countComments = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const COMMENTS = yield comments_1.default
            .find({ father: req.params.id })
            .estimatedDocumentCount()
            .then((count) => {
            return res.json({ count });
        })
            .catch((err) => {
            return res.status(400).json({ err });
        });
    });
};
exports.countComments = countComments;
