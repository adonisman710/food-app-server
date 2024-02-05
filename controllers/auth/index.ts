import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import { IUser } from "../../types";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import Code from "../../models/resetCode";

// When User Try Register In Our Site Fire this function
export const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    //get data from body
    const { name, email, password } = req.body;
    //Generate a Random Code
    const resetCode = crypto.randomBytes(6).toString("base64");
    // Find or checking already any user extis with body email or not
    const user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("User Already Exits", 400));
    // Password Hash
    const passwordHash = await bcrypt.hash(password, 12);
    // if not create new user
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    // save the user and send db
    await newUser.save();

    //without password updatedAt createdAt _v send response to client
    const {
      password: myPassword,
      __v,
      updatedAt,
      createdAt,
      ...userInfo
    } = newUser._doc as IUser;

    // generate a token
    const token = generateToken({ id: newUser._id });
    //   Send Verify Email
    sgMail.setApiKey(`${process.env.SENDGRID_SECRET_KEY}`);
    const msg: any = {
      to: email, // Change to your recipient
      from: process.env.GMAIL_ID, // Change to your verified sender
      subject: "Verify Your Email",
      text: "Do not share your verify email code with anyone.",
      html: `<h1> Do not share your verify email code with anyone.</h1>
          <br>
          <center<strong>${resetCode}</strong></center/>
          `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    const existingCode = await Code.findOne({ email }).select(
      "-__v -createdAt -updatedAt"
    );
    if (existingCode) {
      await Code.deleteOne({ email });
      const saveCode = await new Code({ resetCode, email });
      await saveCode.save();
    } else {
      const saveCode = await new Code({ resetCode, email });
      await saveCode.save();
    }

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message:
          "Register Successfully ! Please check your email and verify email",
        user: userInfo,
        token,
      });
  }
);

// When User Try Login In Our Site Fire this function
export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // get data from req body
    const { email, password } = req.body;
    // find user
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("Invalid credentials", 400));
    // checking hash password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return next(new ErrorHandler("Invalid credentials", 400));
    // generate a user token
    const token = generateToken({ id: user._id });
    //without password updatedAt createdAt _v send response to client
    const {
      password: myPassword,
      __v,
      updatedAt,
      createdAt,
      ...userInfo
    } = user._doc as IUser;

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(201)
      .json({
        message: "Login Successfully",
        user: userInfo,
        token,
      });
  }
);

// When User Try Logout In Our Site Fire this function
export const logout = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res
      .clearCookie("token", {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Logged Our Successfully",
        token: null,
        user: null,
      });
  }
);

// Verify User Account
export const verifyCode = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, resetCode } = req.body;

    const code = await Code.findOne({ email });
    console.log(code);
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("Invalid Code", 400));
    if (!code) {
      return next(
        new ErrorHandler(
          "Invalid or expired reset code, Please try again.",
          400
        )
      );
    } else if (await code.comparetoken(resetCode, code.resetCode)) {
      code.isVerified = true;
      user.isActive = true;

      await code.save();
      await user.save();
      res.json({ message: "Email Verify Successfully" });
    } else {
      return next(
        new ErrorHandler(
          "Invalid or expired reset code, Please try again.",
          400
        )
      );
    }
  }
);

// Generate a token
function generateToken(payload: object) {
  return jwt.sign(payload, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
}
