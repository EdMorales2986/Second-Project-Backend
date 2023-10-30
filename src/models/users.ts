import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  name: string;
  lname: string;
  email: string;
  alias: string;
  password: string;
  bios: string;
  // tweets: string[];
  // followers: string[];
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    lowercase: true,
    trim: true,
  },
  lname: {
    type: String,
    require: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true,
    trim: true,
  },
  alias: {
    type: String,
    unique: true,
    require: true,
    trim: true,
    inmutable: true,
  },
  password: {
    type: String,
    require: true,
    // minlength: [8, "Password must be at least 8 characters"],
    // maxlength: [16, "Password must be less than 16 characters"],
  },
  bios: {
    type: String,
    default: "",
  },
  // tweets: {
  //   type: [String],
  //   default: [],
  // },
  // followers: {
  //   type: [String],
  //   default: [],
  // },
});

// Register Password Encryption
// This will run before any document.save()
userSchema.pre<IUser>("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Login Password Validator
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("users", userSchema);
