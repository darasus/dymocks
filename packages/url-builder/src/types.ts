export type DataType =
  | "firstName"
  | "lastName"
  | "fullName"
  | "gender"
  | "jobArea"
  | "jobDescriptor"
  | "jobTitle"
  | "jobType"
  | "middleName";

export type ModelType = "single" | "list";

export interface UrlBuilderArgs {
  name: string;
  type: ModelType;
  model: Record<string, DataType>;
}
