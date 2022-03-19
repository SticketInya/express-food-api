import { FoodEntry, FoodEntryUpdateOptions } from './interfaces';
import { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import jwt = require('jsonwebtoken');

const privateKey = process.env.PRIVATE_KEY || randomBytes(64).toString();

export function updateFoodEntry(database: FoodEntry[], updateData: FoodEntryUpdateOptions, entryIndex: number): void {
  database[entryIndex].name = updateData.name ? updateData.name : database[entryIndex].name;
  database[entryIndex].details = updateData.details ? updateData.details : database[entryIndex].details;
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): unknown {
  const { authorization } = req.headers;
  const authHeader = authorization?.split(' ');
  const token = authHeader?.[1];
  const isBearer = authHeader?.[0] === 'Bearer';
  if (!isBearer || !token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, privateKey, (err) => {
    if (err) {
      return res.sendStatus(401);
    }
    next();
  });
}

export function signToken(username: string): string {
  return jwt.sign({ user: username }, privateKey);
}
