import { DataType } from "dymock";
import { handleSingle } from "./handleSingle";

const defaultTake = 10;

type HandleList = (arg: { model: string; take: number | undefined }) => {
  items: Record<DataType, string>[];
};

export const handleList: HandleList = ({ model, take = defaultTake }) => {
  const arr = Array.from({ length: take });
  const items = [];

  for (const _ in arr) {
    items.push(handleSingle(model));
  }

  return { items };
};
