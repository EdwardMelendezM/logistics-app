import "reflect-metadata";

import { destroyContainer, initializeContainer } from "@/projects/container";
import { MockRequirementsUseCase } from "./requirements.usecase.mock";
import { PaginationParams, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";

import { afterEach, beforeEach, expect, it } from "vitest";
import { CreateRequirementBody, UpdateRequirementBody } from "../domain/requirements.entity";

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
  expect(requirementUseCase.getRequirements(paginationParams, searchParams)).resolves.toEqual({
    requirements: [
      {
        id: '1',
        description: 'Description 1',
        priority: 'HIGHT',
        status: 'NEW',
        created_at: "2021-09-01T00:00:00.000Z",
        updated_at: "2021-09-01T00:00:00.000Z",
        details: [
          {
            id: '1',
            description: 'Description 1',
            quantity: '1',
            requirement_id: '1',
            created_at: "2021-09-01T00:00:00.000Z",
            updated_at: "2021-09-01T00:00:00.000Z"
          }
        ]
      }
    ],
    pagination: {
      total: 0,
      page: 1,
      sizePage: 10
    },
    error: null
  });
});


it("returns a requirement by id", async () => {
  const requirementUseCase = new MockRequirementsUseCase();
  expect(requirementUseCase.getRequirementById('1')).resolves.toEqual({
    requirement: null,
    error: null
  });
});

it("create a new requirement", async () => {
  const requirementUseCase = new MockRequirementsUseCase();
  const body: CreateRequirementBody = {
    description: 'Description 2',
    priority: 'MEDIUM',
    details: [
      {
        description: 'Description 2',
        quantity: '1',
        id: '2'
      }
    ]
  }
  expect(requirementUseCase.createRequirement(body)).resolves.toEqual({
    id: '2',
    error: null
  });
});

it("update a requirement not found", async () => {
  const requirementUseCase = new MockRequirementsUseCase();
  const id = '1';
  const body: UpdateRequirementBody = {
    description: 'Description 1',
    priority: 'HIGHT',
    details: [
      {
        description: 'Description 1',
        quantity: '1',
        id: '1'
      }
    ]
  }
  expect(requirementUseCase.updateRequirement(id, body)).resolves.toEqual({
    id: "1",
    error: new Error('Requirement not found')
  });
});

it("delete a requirement not found", async () => {
  const requirementUseCase = new MockRequirementsUseCase();
  const id = '1';
  expect(requirementUseCase.removeRequirement(id)).resolves.toEqual({
    id: "1",
    error: new Error('Requirement not found')
  });
})