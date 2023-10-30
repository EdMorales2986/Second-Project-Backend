"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/jwt-verify", passport_1.default.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ state: true });
});
router.post("/signup", user_controllers_1.signUp);
router.post("/signin", user_controllers_1.signIn);
router.delete("/:user/delete", user_controllers_1.deleteUser);
router.put("/:user/update", user_controllers_1.updateInfo);
router.put("/:user/updateBio", user_controllers_1.updateBio);
router.post("/search", user_controllers_1.searchUser);
exports.default = router;
