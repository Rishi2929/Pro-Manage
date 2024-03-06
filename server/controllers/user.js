import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middleware/error.js";
import jwt from 'jsonwebtoken';


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("login req.body: ", req.body);
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({
      success: false,
      message: "Invalid Email or Password",
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.setHeader('Authorization', `Bearer ${token}`);
    console.log(User.name)

    res.status(201).json({success: true, message: 'Logged In', token, user: user });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { name, email, password, oldPassword, newPassword } = req.body;
    console.log("req.body: ", req.body);

    if (!password || !oldPassword.trim() || !newPassword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Some Fields can't be empty",
      });
    }

    let user = await User.findOne({ email }).select("+password");;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    }

    console.log("user db: ", user);

    const sameOrNot = await bcrypt.compare(oldPassword, user.password);
    if (!sameOrNot) {
      return res.status(400).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    if (newPassword.trim() == oldPassword.trim()) {
      return res.status(400).json({
        success: false,
        message: "Old password is equal to new password",
      });
    }

    const protectedPassword = await bcrypt.hash(newPassword, 10);

    if (newPassword.trim() !== oldPassword.trim()) {
      user = await User.updateOne({ email }, { $set: { name: name, password: protectedPassword } });
    }

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({
      success: false,
      message: "User Already Exists",
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });

    res.setHeader('Authorization', `Bearer ${token}`);

    res.status(201).json({success: true, message: 'Registered', token, name: user.name });


  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

