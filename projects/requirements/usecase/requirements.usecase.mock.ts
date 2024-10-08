import { injectable } from "inversify";

import { FullError, PaginationParams, PaginationResults, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";
import { CreateRequirementBody, Requirement, UpdateRequirementBody } from "@/projects/requirements/domain/requirements.entity";
import { IRequirementsUseCase } from "../domain/requirements.usecase.interface";

@injectable()
export class MockRequirementsUseCase implements IRequirementsUseCase {
  private _requirements: Requirement[];

  constructor() {
    this._requirements = [];
  }

  async getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
    requirements: Requirement[],
    pagination: PaginationResults,
    error: FullError
  }> {
    this._requirements = [
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
    ];
    return {
      requirements: this._requirements,
      pagination: {
        total: 0,
        page: 1,
        sizePage: 10
      },
      error: null
    }
  }

  async getRequirementById(requirementId: string): Promise<{ requirement: Requirement | null, error: FullError }> {
    const requirement = this._requirements.find((r) => r.id === requirementId);
    return {
      requirement: requirement ?? null,
      error: null
    }
  }

  async createRequirement(
    body: CreateRequirementBody
  ): Promise<{
    id: string,
    error: FullError
  }> {
    const newRequirementId = '2';
    this._requirements.push({
      id: newRequirementId,
      description: body.description,
      priority: body.priority,
      status: "NEW",
      created_at: "2021-09-01T00:00:00.000Z",
      updated_at: "2021-09-01T00:00:00.000Z",
      details: body.details.map((d) => ({
        id: d.id ?? '',
        quantity: d.quantity,
        description: d.description,
        requirement_id: newRequirementId,
        created_at: "2021-09-01T00:00:00.000Z",
        updated_at: "2021-09-01T00:00:00.000Z"
      }))
    });
    return {
      id: newRequirementId,
      error: null
    }
  }

  async updateRequirement(
    requirementId: string,
    body: UpdateRequirementBody
  ): Promise<{
    id: string,
    error: FullError
  }> {
    const requirementIndex = this._requirements.findIndex((r) => r.id === requirementId);

    if (requirementIndex === -1) {
      return {
        id: requirementId,
        error: new Error('Requirement not found')
      }
    }

    this._requirements[requirementIndex] = {
      ...this._requirements[requirementIndex],
      description: body.description,
      priority: body.priority,
      updated_at: "2021-09-01T00:00:00.000Z",
      details: body.details.map((d) => ({
        id: d.id ?? '',
        quantity: d.quantity,
        description: d.description,
        requirement_id: requirementId,
        created_at: "2021-09-01T00:00:00.000Z",
        updated_at: "2021-09-01T00:00:00.000Z"
      }))
    }
    return {
      id: requirementId,
      error: null
    }
  }

  async removeRequirement(requirementId: string): Promise<{ id: string, error: FullError }> {
    const requirementIndex = this._requirements.findIndex((r) => r.id === requirementId);
    if (requirementIndex === -1) {
      return {
        id: requirementId,
        error: new Error('Requirement not found')
      }
    }
    this._requirements.splice(requirementIndex, 1);
    return {
      id: requirementId,
      error: null
    }
  }
}

