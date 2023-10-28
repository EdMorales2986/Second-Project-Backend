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
const passport_jwt_1 = require("passport-jwt");
const users_1 = __importDefault(require("../models/users"));
// Passport Middleware
const opts = {
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromBodyField("token"),
    secretOrKey: process.env.JWTSECRET,
};
exports.default = new passport_jwt_1.Strategy(opts, function (payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield users_1.default.findOne({ alias: payload.alias });
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }
        catch (error) {
            console.log(error);
        }
    });
});
