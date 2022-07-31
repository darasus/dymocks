import { DataType } from "dymock";

export const parseModel = (
  modelString: string
): Partial<Record<string, DataType>> => {
  const model = modelString.split(",");
  let result: Partial<Record<string, DataType>> = {};
  model.forEach((item) => {
    const [key, value] = item.split(":");
    result = { ...result, [key]: value as DataType };
  });
  return result;
};
