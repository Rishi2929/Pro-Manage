import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../middleware/error.js";
import jwt from 'jsonwebtoken';


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
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

