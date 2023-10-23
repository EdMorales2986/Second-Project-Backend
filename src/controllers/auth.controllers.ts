import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import jwt from "jsonwebtoken";

function createToken(user: IUser) {
  return jwt.sign(
    { id: user.id, alias: user.alias },
    `${process.env.JWTSECRET}`,
    { expiresIn: "12d" }
  );
}

export const signUp = async function (
  req: Request,
  res: Response
): Promise<Response> {
  if (
    !req.body.alias ||
    !req.body.password ||
    !req.body.email ||
    !req.body.name ||
    !req.body.lname
  ) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const userAlias = await users.findOne({ alias: req.body.alias });
  const userEmail = await users.findOne({ email: req.body.email });
  if (userAlias || userEmail) {
    return res.status(400).json({ msg: "The user already exists" });
  }

  // We create an instance of the model 'users' which makes it a 'document' and documents are entries stored inside a collection
  const newUser = new users(req.body);
  // .save() Saves this document 'newUser' by inserting a new document into the database
  await newUser.save();

  return res.json(newUser);
};

export const signIn = async function (req: Request, res: Response) {
  if (!req.body.alias || !req.body.password) {
    return res.status(400).json({ msg: "Please send your alias and password" });
  }

  const user = await users.findOne({ alias: req.body.alias });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    const token = createToken(user);
    return res.json({ jwt: token, user: user });
  }

  return res
    .status(400)
    .json({ msg: "Either the password or the alias are wrong, check again" });
};

export const deleteUser = async function (req: Request, res: Response) {
  if (!req.body.password) {
    return res.status(400).json({ msg: "Please send valid data" });
  }

  const user = await users.findOne({ alias: req.params.user });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (user && isMatch) {
    await users.deleteOne({ alias: req.params.user });
    return res.status(200).json({ msg: "user deleted" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered and error during this process" });
};

export const updateInfo = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.user });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await user.comparePassword(req.body.oldPass);
  if (user && isMatch) {
    user.name = req.body.name !== "" ? req.body.name : user.name;
    user.lname = req.body.lname !== "" ? req.body.lname : user.lname;
    user.email = req.body.email !== "" ? req.body.email : user.email;
    user.password = req.body.newPass !== "" ? req.body.newPass : user.password;
    await user.save();
    return res.status(200).json({ msg: "user updated" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered and error during this process" });
};
