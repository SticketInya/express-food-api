//TODO: build your application here
import express, { NextFunction, Request, Response, Router } from 'express';
import { FoodEntry, FoodEntryDetails, FoodEntryUpdateOptions } from './interfaces';
import { randomUUID, randomBytes } from 'crypto';
import 'dotenv/config';

import jwt = require('jsonwebtoken');
import morgan = require('morgan');
const PORT = parseInt(process.env.PORT || '3000', 10);
const privateKey = process.env.PRIVATE_KEY || randomBytes(64).toString();

const main = async (): Promise<void> => {
  //TODO: start your application here
  const app = express();
  const foodRouter = Router();
  const foods: FoodEntry[] = [];

  app.use(express.json());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(morgan('combined'));
  app.disable('x-powered-by');

  foodRouter.get('', (req, res) => {
    if (!foods.length) {
      return res.sendStatus(204);
    }
    return res.status(200).send(foods);
  });

  foodRouter.get('/:id', (req, res) => {
    const { id: foodId } = req.params;
    const foodExists = foods.find((food) => food.id === foodId);
    if (!foodExists) {
      return res.status(404).send({ error: 'food not found' });
    }
    return res.status(200).send(foodExists);
  });

  foodRouter.post('', (req, res) => {
    const { name, details } = req.body as { name: string; details: FoodEntryDetails };
    const newFoodEntry: FoodEntry = {
      id: randomUUID().toString(),
      createdAt: new Date(),
      name: name,
      details: details,
    };
    foods.push(newFoodEntry);
    return res.status(201).send(newFoodEntry);
  });

  foodRouter.put('/:id', (req, res) => {
    const { id: foodId } = req.params;
    const updateData = req.body as FoodEntryUpdateOptions;
    const foodIndex = foods.findIndex((food) => food.id === foodId);
    if (foodIndex === -1) {
      return res.status(404).send('food not found');
    }
    updateFoodEntry(foods, updateData, foodIndex);
    return res.status(200).send(foods[foodIndex]);
  });

  foodRouter.delete('/:id', (req, res) => {
    const { id: foodId } = req.params;
    const foodIndex = foods.findIndex((food) => food.id === foodId);
    if (foodIndex !== -1) {
      foods.splice(foodIndex, 1);
    }
    return res.sendStatus(204);
  });

  app.post('/login', (req, res) => {
    const validUsername = process.env.VALID_USERNAME;
    const validPassword = process.env.VALID_PASSWORD;
    const { username, password } = req.body as { username: string; password: string };
    const areValidCredentials = username === validUsername && password === validPassword;

    if (areValidCredentials) {
      const signedToken = jwt.sign({ user: username }, privateKey);
      return res.status(200).send({ token: signedToken });
    }
    return res.status(401).send({ error: 'invalid login credentials' });
  });

  app.use('/food', authenticateToken, foodRouter);

  app.use('*', (req, res) => {
    return res.status(404).send({ error: 'not found' });
  });

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    return res.status(500).send({ error: `internal server error` });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

main().catch(console.error);

function updateFoodEntry(database: FoodEntry[], updateData: FoodEntryUpdateOptions, entryIndex: number): void {
  database[entryIndex].name = updateData.name ? updateData.name : database[entryIndex].name;
  database[entryIndex].details = updateData.details ? updateData.details : database[entryIndex].details;
}

function authenticateToken(req: Request, res: Response, next: NextFunction): unknown {
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
