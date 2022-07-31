import { DataType } from "dymock";
import { keys } from "ramda";
import { mapModelToData } from "./mapModelToData";
import { parseModel } from "./parseModel";

export const handleSingle = (model: string): Record<DataType, string> => {
  const parsedModel = parseModel(model);
  let result = {} as Record<DataType, string>;

  keys(parsedModel).forEach((key) => {
    const value = parsedModel[key];
    if (value) {
      result = { ...result, [key]: mapModelToData(value) };
    }
  });

  return result;
};
