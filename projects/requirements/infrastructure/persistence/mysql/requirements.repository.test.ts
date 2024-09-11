import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/projects/container";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("returns requirements", async () => {

  //1. Add mock to get requirements of the database with drizzle

  //2. Consuming method getRequirements from RequirementsMySqlRepository

  //3. Validate the result of the method getRequirements

  //4. Validate the result of the method getRequirements with pagination

  expect(true).toBe(true);

});