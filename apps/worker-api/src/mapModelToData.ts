import { DataType } from "@dymock/url-builder";
import { faker } from "@faker-js/faker";

export const mapModelToData = (key: DataType): string => {
  const map: Record<DataType, string> = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    fullName: faker.name.findName(),
    gender: faker.name.gender(),
    jobArea: faker.name.jobArea(),
    jobDescriptor: faker.name.jobDescriptor(),
    jobTitle: faker.name.jobTitle(),
    jobType: faker.name.jobType(),
    middleName: faker.name.middleName(),
  };

  return map[key];
};
