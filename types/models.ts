// types/models.ts
import { Product } from "./products";

export type ModelRow = {
  model?: string | number;
  [key: string]: string | number | boolean | undefined;
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