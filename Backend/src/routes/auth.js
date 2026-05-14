import bcrypt from "bcryptjs";
import express from "express";
import { OAuth2Client } from "google-auth-library";
import { signToken } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name = "", email, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, provider: "local" });

    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password || "", user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

router.post("/google", async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login is not configured" });
    }

    const ticket = await new OAuth2Client(process.env.GOOGLE_CLIENT_ID).verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) return res.status(401).json({ message: "Google account email is required" });

    const user = await User.findOneAndUpdate(
      { email },
      { name: payload.name || "", email, provider: "google" },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
});

function authResponse(user) {
  return {
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

export default router;
