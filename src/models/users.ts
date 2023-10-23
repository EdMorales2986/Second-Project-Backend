import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  name: string;
  lname: string;
  email: string;
  alias: string;
  password: string;
  notes: string[];
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
  },
  password: {
    type: String,
    require: true,
  },
  notes: {
    type: [String],
  },
});

// Register Password Encryption
// This will run before any document.save()
userSchema.pre<IUser>("save", async function (next) {
  const user = this;
  // if password is not being modified it will skip
  if (!user.isModified("password")) {
    return next();
  }
  // Process to cipher/encrypt a password (Hashing)
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
