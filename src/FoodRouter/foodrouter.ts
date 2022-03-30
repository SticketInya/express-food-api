import { NextFunction, Request, Response, Router } from 'express';
import { FoodEntry, FoodEntryDetails, FoodEntryUpdateOptions } from '../Utils/interfaces';
// import { randomUUID } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import { updateFoodEntry, validateRequestBody } from '../Utils/utils';

const foodRouter = Router();
const foods: FoodEntry[] = [];

foodRouter.use(cors());

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

foodRouter.post('', validateRequestBody, (req, res) => {
  const { name, details } = req.body as { name: string; details: FoodEntryDetails };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const randomUUID = uuidv4() as string;
  const newFoodEntry: FoodEntry = {
    id: randomUUID,
    createdAt: new Date(),
    name: name,
    details: details,
  };
  foods.push(newFoodEntry);
  return res.status(201).send(newFoodEntry);
});

foodRouter.put('/:id', validateRequestBody, (req, res) => {
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

export { foodRouter };
