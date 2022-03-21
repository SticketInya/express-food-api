import { FoodEntry, FoodEntryUpdateOptions } from './interfaces';

export function updateFoodEntry(database: FoodEntry[], updateData: FoodEntryUpdateOptions, entryIndex: number): void {
  database[entryIndex].name = updateData.name ? updateData.name : database[entryIndex].name;
  database[entryIndex].details = updateData.details ? updateData.details : database[entryIndex].details;
}
