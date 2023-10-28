"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tweetSchema = new mongoose_1.default.Schema({
    owner: {
        type: String,
        require: true,
        trim: true,
    },
    content: {
        type: String,
        require: true,
        trim: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("tweet", tweetSchema);