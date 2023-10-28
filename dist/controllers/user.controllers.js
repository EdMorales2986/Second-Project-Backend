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
exports.updateInfo = exports.deleteUser = exports.signIn = exports.signUp = void 0;
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, alias: user.alias }, `${process.env.JWTSECRET}`, { expiresIn: "5d" });
}
function validator(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const signUp = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newUser = new users_1.default(req.body);
        if (!req.body.alias ||
            !req.body.password ||
            !req.body.email ||
            !req.body.name ||
            !req.body.lname) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        const userAlias = yield users_1.default.findOne({ alias: req.body.alias });
        const userEmail = yield users_1.default.findOne({ email: req.body.email });
        if (userAlias || userEmail) {
            return res
                .status(400)
                .json({ msg: "The user/email is already registered" });
        }
        else if (req.body.password.length < 8) {
            return res
                .status(400)
                .json({ msg: "The password must be at least 8 characters" });
        }
        else if (req.body.password.length > 16) {
            return res
                .status(400)
                .json({ msg: "The password must be less than 16 characters" });
        }
        else if (!validator(req.body.email)) {
            return res.status(400).json({ msg: "The email is not valid" });
        }
        yield newUser
            .save()
            .then(() => {
            console.log("user saved");
        })
            .catch((err) => {
            return res.status(400).json(err);
        });
        return res.json(newUser);
    });
};
exports.signUp = signUp;
const signIn = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.body.alias });
        if (!req.body.alias || !req.body.password) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        else if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield user.comparePassword(req.body.password);
        if (user && isMatch) {
            const token = createToken(user);
            return res.json({ jwt: token, user: user });
        }
        return res.status(400).json({ msg: "The Password/Alias is wrong" });
    });
};
exports.signIn = signIn;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (!req.body.password) {
            return res.status(400).json({ msg: "Please send valid data" });
        }
        else if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield user.comparePassword(req.body.password);
        if (user && isMatch) {
            yield users_1.default.deleteOne({ alias: req.params.user });
            return res.status(200).json({ msg: "user deleted" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered and error during this process" });
    });
};
exports.deleteUser = deleteUser;
const updateInfo = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield users_1.default.findOne({ alias: req.params.user });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }
        const isMatch = yield user.comparePassword(req.body.oldPass);
        if (user && isMatch) {
            user.password =
                req.body.newPass !== "" ? req.body.newPass : req.body.oldPass;
            user.name = req.body.name !== "" ? req.body.name : user.name;
            user.lname = req.body.lname !== "" ? req.body.lname : user.lname;
            user.email = req.body.email !== "" ? req.body.email : user.email;
            user.bios = req.body.bios !== "" ? req.body.bios : user.bios;
            yield user.save();
            return res.status(200).json({ msg: "user updated" });
        }
        return res
            .status(400)
            .json({ msg: "Encountered and error during this process" });
    });
};
exports.updateInfo = updateInfo;
/* example of data
  {
      "name": "Eduardo",
      "lname": "Morales",
      "email": "EdMo@gmail.com",
      "alias": "Ed_123",
      "bios": "Hi, i'm a computer engineering student",
      "password": "bruh-123"
  }

  {
    "name": "Alonso",
    "lname": "Rondon",
    "email": "Hell@gmail.com",
    "bios": "I want to be a programmer",
    "oldPass": "bruh-123",
    "newPass": ""
  }
*/