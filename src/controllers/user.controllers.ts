import { Request, Response, NextFunction } from "express";
import users, { IUser } from "../models/users";
import jwt from "jsonwebtoken";

function createToken(user: IUser) {
  return jwt.sign(
    { id: user.id, alias: user.alias },
    `${process.env.JWTSECRET}`,
    { expiresIn: "5d" }
  );
}

function validateEmail(email: string) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
}

export const signUp = async function (
  req: Request,
  res: Response
): Promise<Response> {
  const newUser = new users(req.body);

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
    return res
      .status(400)
      .json({ msg: "The user/email is already registered" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .json({ msg: "The password must be at least 8 characters" });
  } else if (req.body.password.length > 16) {
    return res
      .status(400)
      .json({ msg: "The password must be less than 16 characters" });
  } else if (!validateEmail(req.body.email)) {
    return res.status(400).json({ msg: "The email is not valid" });
  }
  await newUser
    .save()
    .then(() => {
      console.log("user saved");
    })
    .catch((err) => {
      return res.status(400).json(err);
    });

  return res.json(newUser);
};

export const signIn = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.body.alias });
  if (!req.body.alias || !req.body.password) {
    return res.status(400).json({ msg: "Please send valid data" });
  } else if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (user && isMatch) {
    const token = createToken(user);
    return res.json({ jwt: token, user: user });
  }

  return res.status(400).json({ msg: "The Password/Alias is wrong" });
};

export const deleteUser = async function (req: Request, res: Response) {
  const user = await users.findOne({ alias: req.params.user });
  if (!req.body.password) {
    return res.status(400).json({ msg: "Please send valid data" });
  } else if (!user) {
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
    user.password =
      req.body.newPass !== "" ? req.body.newPass : req.body.oldPass;
    user.name = req.body.name !== "" ? req.body.name : user.name;
    user.lname = req.body.lname !== "" ? req.body.lname : user.lname;
    user.email = req.body.email !== "" ? req.body.email : user.email;
    user.bios = req.body.bios !== "" ? req.body.bios : user.bios;
    await user.save();
    return res.status(200).json({ msg: "user updated" });
  }

  return res
    .status(400)
    .json({ msg: "Encountered and error during this process" });
};

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