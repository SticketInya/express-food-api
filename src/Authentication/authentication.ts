import { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { verify, sign } from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY || randomBytes(64).toString();

export function authenticateToken(req: Request, res: Response, next: NextFunction): unknown {
  const { authorization } = req.headers;
  const authHeader = authorization?.split(' ');
  const token = authHeader?.[1];
  const isBearer = authHeader?.[0] === 'Bearer';
  if (!isBearer || !token) {
    return res.sendStatus(401);
  }
  verify(token, privateKey, (err) => {
    if (err) {
      return res.sendStatus(401);
    }
    next();
  });
}

export function signToken(username: string): string {
  return sign({ user: username }, privateKey);
}
