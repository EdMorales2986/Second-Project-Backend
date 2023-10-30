import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import passport from "passport";
import passportMiddleWare from "./middlewares/passport";

import userRoutes from "./routes/user.routes";
import tweetsRoutes from "./routes/tweets.routes";

// Init
const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());

passport.use(passportMiddleWare);

// Routes
app.use(userRoutes);
app.use(tweetsRoutes);
app.get("/", function (req: express.Request, res: express.Response) {
  res.send(`http://localhost:${app.get("port")}`);
});

export default app;
