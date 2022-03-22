import { FoodEntry, FoodEntryUpdateOptions, FoodEntryDetails, FoodDetailsHelperObject } from './interfaces';
import { NextFunction, Request, Response } from 'express';
import { requestBodySchema } from './dto';

export function updateFoodEntry(database: FoodEntry[], updateData: FoodEntryUpdateOptions, entryIndex: number): void {
  database[entryIndex].name = updateData.name ? updateData.name : database[entryIndex].name;
  database[entryIndex].details = updateData.details ? updateData.details : database[entryIndex].details;
}

export async function validateRequestBody(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  const requestData = convertRequestToObject(req);
  try {
    await requestBodySchema.validate(requestData);
    next();
  } catch {
    return res.sendStatus(400);
  }
}

function convertRequestToObject(request: Request): unknown {
  const { name, details } = request.body as { name: string; details: FoodEntryDetails };
  if (!details) {
    return { name };
  }
  const detsArray = Object.entries(details).map((e) => {
    return { key: e[0], value: e[1] } as FoodDetailsHelperObject;
  });

  return { name, detsArray };
}
