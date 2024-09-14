import { injectable } from "inversify";

import { IRequirementsRepository } from "@/projects/requirements/domain/requirements.repository.interface";
import { FullError, PaginationParams, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";
import { CreateRequirement, Requirement, UpdateRequirementBody, UpdateRequirementDetail } from "@/projects/requirements/domain/requirements.entity";
import { Tx } from "./requirements.repository";

@injectable()
export class MockRequirementsRepository implements IRequirementsRepository {
  private _requirements: Requirement[];

  constructor() {
    this._requirements = [];
  }

  async getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
    requirements: Requirement[],
    error: FullError
  }> {
    this._requirements = [
      {
        id: '1',
        description: 'Description 1',
        priority: 'HIGHT',
        status: 'NEW',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        details: [
          {
            id: '1',
            description: 'Description 1',
            quantity: '1',
            requirement_id: '1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()


          }
        ]
      }
    ];
    return {
      requirements: this._requirements,
      error: null
    }
  }

  async getTotalRequirements(): Promise<{ total: number; error: FullError; }> {
    const count = this._requirements.length;
    return {
      total: count,
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
    tx: Tx,
    requirementId: string,
    body: CreateRequirement
  ): Promise<{
    id: string,
    error: FullError
  }> {
    this._requirements.push({
      id: requirementId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      details: []
    });
    return {
      id: requirementId,
      error: null
    }
  }

  async createRequirementDetail(
    tx: Tx,
    requirementId: string,
    body: CreateRequirement
  ): Promise<{
    id: string,
    error: FullError
  }> {
    const requirement = this._requirements.find((r) => r.id === requirementId);
    if (!requirement) {
      return {
        id: '',
        error: new Error('Requirement not found')
      }
    }
    for (const detail of body.details) {
      requirement.details.push({
        id: detail.id ?? '',
        quantity: detail.quantity,
        description: detail.description,
        requirement_id: requirementId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    return {
      id: '',
      error: null
    }
  }

  async mainCreateRequirement(
    requirementId: string,
    body: CreateRequirement
  ): Promise<{
    id: string,
    error: FullError
  }> {

    this._requirements.push({
      id: requirementId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      details: body.details.map((d) => ({
        id: d.id ?? '',
        quantity: d.quantity,
        description: d.description,
        requirement_id: requirementId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
    });

    return {
      id: '',
      error: null
    }
  }

  async mainUpdateRequirement(
    requirementId: string,
    body: UpdateRequirementBody,
    newRequirementDetails: Record<string, UpdateRequirementDetail>,
    updateExistingDetails: Record<string, UpdateRequirementDetail>,
    removeDetails: Record<string, UpdateRequirementDetail>
  ): Promise<{
    id: string,
    error: FullError
  }> {
    const requirement = this._requirements.find((r) => r.id === requirementId);

    if (!requirement) {
      return {
        id: '',
        error: new Error('Requirement not found')
      }
    }

    const newDetails = Object.values(newRequirementDetails).map((d) => ({
      id: d.id ?? '',
      quantity: d.quantity,
      description: d.description,
      requirement_id: requirementId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    requirement.details.push(...newDetails);

    for (const detail of Object.values(updateExistingDetails)) {
      const existingDetail = requirement.details.find((d) => d.id === detail.id);
      if (existingDetail) {
        existingDetail.quantity = detail.quantity;
        existingDetail.description = detail.description;
        existingDetail.updated_at = new Date().toISOString();
      }
    }

    for (const detail of Object.values(removeDetails)) {
      const existingDetailIndex = requirement.details.findIndex((d) => d.id === detail.id);
      if (existingDetailIndex !== -1) {
        requirement.details.splice(existingDetailIndex, 1);
      }
    }

    return {
      id: requirementId,
      error: null
    }
  }

  async removeRequirement(requirementId: string): Promise<{ id: string, error: FullError }> {
    const requirementIndex = this._requirements.findIndex((r) => r.id === requirementId);
    if (requirementIndex !== -1) {
      this._requirements.splice(requirementIndex, 1);
    }
    return {
      id: requirementId,
      error: null
    }
  }
}

