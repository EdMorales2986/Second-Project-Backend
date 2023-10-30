"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likes_controller_1 = require("../controllers/likes.controller");
const router = (0, express_1.Router)();
router.get("/like/:user/:id", likes_controller_1.likeStatus);
router.get("/likeCount/:id", likes_controller_1.countLikes);
router.get("/likeVerify/:user/:id", likes_controller_1.verifyStatus);
exports.default = router;
