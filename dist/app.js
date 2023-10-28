"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// Init
const app = (0, express_1.default)();
// Settings
app.set("port", process.env.PORT || 3000);
// Middlewares
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
// Routes
app.use(user_routes_1.default);
app.get("/", function (req, res) {
    res.send(`http://localhost:${app.get("port")}`);
});
exports.default = app;
