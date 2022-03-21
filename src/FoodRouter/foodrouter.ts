import { NextFunction, Request, Response, Router } from 'express';
import { FoodEntry, FoodEntryDetails, FoodEntryUpdateOptions } from '../Utils/interfaces';
import { randomUUID } from 'crypto';
import { updateFoodEntry } from '../Utils/utils';

const foodRouter = Router();
const foods: FoodEntry[] = [];

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

export { foodRouter };
