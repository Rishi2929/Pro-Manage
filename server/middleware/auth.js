import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import ErrorHandler from '../middleware/error.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      throw new ErrorHandler('Authentication failed', 401);
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).
          json({ success: false, message: "Invalid token" });

      }

      const user = await User.findOne({ _id: decoded.userId, email: decoded.email });

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      req.user = user;
      req.token = token;

      next();
    });
  } catch (error) {
    console.log("isAuthenticated error: ", error);
    next(error);
  }
};
