import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllFollowedTweets,
  getAllTweetsNew,
  getAllTweetsOld,
  getAllTweetsLiked,
} from "../controllers/tweet.controller";

const router = Router();

router.get("/showAllTweetsNew", getAllTweetsNew);
router.get("/showAllTweetsOld", getAllTweetsOld);
router.post("/showAllTweetsLiked/:user", getAllTweetsLiked);
router.post("/showAllFollowedTweets/:user", getAllFollowedTweets);
router.post("/createTweet/:user", createTweet);
router.delete("/deleteTweet/:user/:id", deleteTweet);

export default router;
