import express, { Request, Response } from "express";
import { body } from "express-validator";

import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existinguser = await User.findOne({ email });

    if (existinguser) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({ email, password });
    console.log("JWT_KEY value:", process.env.JWT_KEY);

    await user.save();

    //Generate json web token
    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    console.log("userJwt", userJwt);

    //store in session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(user);
  }
);

export { router as signupRouter };
