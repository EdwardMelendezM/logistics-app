import "reflect-metadata";

import { afterEach, beforeEach, expect, it } from "vitest";

import {
  destroyContainer,
  getInjection,
  initializeContainer,
} from "@/projects/container";
import { MockRequirementsUseCase } from "./usecase/requirements.usecase.mock";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("should use mock version of repos and usecases",
  async () => {
    const requirementsUseCase = getInjection("RequirementsUseCase");
    expect(requirementsUseCase).toBeInstanceOf(MockRequirementsUseCase);
  })