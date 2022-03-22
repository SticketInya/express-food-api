export type FoodEntryDetails = Record<string, { unit: string; amount: number }>;
export type FoodEntryCreateOptions = {
  name: string;
  details?: FoodEntryDetails;
};
export type FoodEntry = FoodEntryCreateOptions & { id: string; createdAt: Date };
export type FoodEntryUpdateOptions = Partial<FoodEntryCreateOptions>;

export type FoodDetailsHelperObject = {
  key: string;
  value: { unit: string; amount: number };
};
