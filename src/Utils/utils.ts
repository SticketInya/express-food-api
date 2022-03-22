import { FoodEntry, FoodEntryUpdateOptions } from './interfaces';
import { NextFunction, Request, Response } from 'express';
import schema from 'yup/lib/schema';
import { requestBodySchema } from './dto';

export function updateFoodEntry(database: FoodEntry[], updateData: FoodEntryUpdateOptions, entryIndex: number): void {
  database[entryIndex].name = updateData.name ? updateData.name : database[entryIndex].name;
  database[entryIndex].details = updateData.details ? updateData.details : database[entryIndex].details;
}

export async function validateRequestBody(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  try {
    await requestBodySchema.validate(req.body);
    next();
  } catch {
    return res.sendStatus(400);
  }
}
