import { Product } from "./products";

export type ModelRow = {
  model?: string | number;
  // Updated to support both single string and array of strings for multiple images
  image?: string | string[];
  [key: string]: string | number | boolean | string[] | undefined;
};

export type ModelTable = {
  title: string;
  columns: string[];
  rows: ModelRow[];
};

export type ProductModels = {
  modelTables: ModelTable[];
};

export type ProductWithModels = Product & {
  models?: ProductModels;
};