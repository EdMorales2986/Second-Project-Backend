"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Config Mongoose
mongoose_1.default.connect(`${process.env.URI}`, { dbName: "Second-SQL" });
const connection = mongoose_1.default.connection;
// Msg: Connection Stablished
connection.once("open", function () {
    console.log(`MongoDB Connection Stablished`);
});
// Msg: Terminate on failed connection with MongoDB
connection.on("error", function (error) {
    console.log(error);
    process.exit(0);
});
