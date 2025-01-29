// src/express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can replace 'any' with a more specific type if you have one
    }
  }
}
