import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/projects/container";
import { MockRequirementsUseCase } from "./requirements.usecase.mock";
import { PaginationParams, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("returns requirements", async () => {
  const paginationParams: PaginationParams = {
    page: 1,
    sizePage: 10
  }

  const searchParams: SearchParamsRequirement = {
    search: 'Description 1'
  }

  const requirementUseCase = new MockRequirementsUseCase();
  expect(requirementUseCase.getRequirements(paginationParams, searchParams)).resolves.toHaveLength(0);

  expect(true).toBe(true);

});