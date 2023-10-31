"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follower_controller_1 = require("../controllers/follower.controller");
const router = (0, express_1.Router)();
router.get("/follow/:fromUser/:toUser", follower_controller_1.followStatus);
router.get("/followCount/:fromUser", follower_controller_1.countFollowers);
router.get("/followVerify/:fromUser/:toUser", follower_controller_1.verifyStatus);
exports.default = router;
