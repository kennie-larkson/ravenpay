import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, password } = req.body;

  try {
    const existingUser = await db("users").where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique account number (for simplicity, using a random number)
    const accountNumber = `ACC${Math.floor(100000 + Math.random() * 900000)}`;

    // Save the user to the database
    await db("users").insert({
      username,
      password: hashedPassword,
      account_number: accountNumber,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logIn = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await db("users").where({ username }).first();
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
