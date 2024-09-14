import {inject, injectable} from "inversify";
import {v4 as uuid} from 'uuid';

import {
    FullError,
    PaginationParams,
    PaginationResults,
    SearchParamsRequirement
} from "@/projects/shared/results/domain/resullts.entity";

import type {
    CreateRequirementBody,
    Requirement,
    CreateRequirement
} from "@/projects/requirements/domain/requirements.entity";
import {RequirementsUsecaseInterface} from "@/projects/requirements/domain/requirements.usecase.interface";
import {RequirementsRepositoryInterface} from "@/projects/requirements/domain/requirements.repository.interface";
import {DI_SYMBOLS} from "@/projects/types";
import {UpdateRequirementBody, UpdateRequirementDetail} from "@/projects/requirements/domain/requirements.entity";

@injectable()
export class RequirementsUCase implements RequirementsUsecaseInterface {
    constructor(
        @inject(DI_SYMBOLS.RequirementsRepository) private requirementsRepository: RequirementsRepositoryInterface,
    ) {
    }

    async getRequirementById(requirementId: string): Promise<{ requirement: Requirement | null, error: FullError }> {
        try {
            const {
                requirement,
                error
            } = await this.requirementsRepository.getRequirementById(requirementId)
            return {
                requirement,
                error
            }
        } catch (error) {
            return {
                requirement: null,
                error: error instanceof Error ? error : new Error('Unexpected error')
            }
        }
    }

    async getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
        requirements: Requirement[],
        pagination: PaginationResults,
        error: FullError
    }> {
        try {
            const {
                requirements,
                error: errorGetRequirement
            } = await this.requirementsRepository.getRequirements(pagination, searchParams)
            const {total, error: errorGetTotalRequirement} = await this.requirementsRepository.getTotalRequirements()
            const paginationResults: PaginationResults = {
                total,
                page: pagination.page,
                sizePage: pagination.sizePage
            }

            if (errorGetTotalRequirement || errorGetRequirement) {
                return {
                    requirements: [],
                    pagination: paginationResults,
                    error: errorGetTotalRequirement || errorGetRequirement
                }
            }
            return {
                requirements,
                pagination: paginationResults,
                error: null
            };

        } catch (error) {
            return {
                requirements: [],
                pagination: {
                    total: 0,
                    page: pagination.page,
                    sizePage: pagination.sizePage,
                },
                error: error instanceof Error ? error : new Error('Unexpected error'),
            };
        }
    }

    async createRequirement(body: CreateRequirementBody): Promise<{
        id: string;
        error: FullError
    }> {
        try {
            const newRequirementId = uuid();
            const newRequirement: CreateRequirement = {
                description: body.description,
                priority: body.priority,
                status: "NEW",
                details: body.details.map(detail => ({
                    id: uuid(),
                    requirement_id: newRequirementId,
                    description: detail.description,
                    quantity: detail.quantity
                }))
            }
            const {
                id,
                error
            } = await this.requirementsRepository.mainCreateRequirement(newRequirementId, newRequirement);
            if (error) {
                throw error;
            }
            return {
                id,
                error: null
            }
        } catch (error) {
            return {
                id: '',
                error: error instanceof Error ? error : new Error('Unexpected error')
            }
        }

    }

    async updateRequirement(requirementId: string, body: UpdateRequirementBody): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            const {
                requirement,
                errorRequirementById
            } = await this.requirementsRepository.getRequirementById(requirementId);
            if (errorRequirementById || !requirement) {
                throw new Error('Requirement not found');
            }


            const newRequirementDetails: Record<string, UpdateRequirementDetail> = {};
            const updateExistingDetails: Record<string, UpdateRequirementDetail> = {};
            const removeDetails: Record<string, UpdateRequirementDetail> = {};

            // 1. Mapping details
            for (const detail of body.details) {
                const newId = detail.id || uuid();
                newRequirementDetails[newId] = {
                    id: newId,
                    description: detail.description,
                    quantity: detail.quantity,
                };
            }

            // 2. Verify existing details
            for (const detail of requirement.details) {
                if (newRequirementDetails[detail.id]) {
                    updateExistingDetails[detail.id] = newRequirementDetails[detail.id];
                    delete newRequirementDetails[detail.id];
                } else {
                    removeDetails[detail.id] = detail;
                }
            }

            console.log(removeDetails)

            const newRequirement: CreateRequirement = {
                description: body.description,
                priority: body.priority,
                status: "NEW",
                details: []
            }
            const {
                id,
                error
            } = await this.requirementsRepository.mainUpdateRequirement(
                requirementId,
                newRequirement,
                newRequirementDetails,
                updateExistingDetails,
                removeDetails);
            if (error) {
                throw error;
            }
            return {
                id,
                error: null
            }
        } catch (error) {
            return {
                id: '',
                error: error instanceof Error ? error : new Error('Unexpected error')
            }
        }
    }

    async removeRequirement(requirementId: string): Promise<{ id: string, error: FullError }> {
        try {
            const {
                id,
                error
            } = await this.requirementsRepository.removeRequirement(requirementId);
            if (error) {
                throw error;
            }
            return {
                id,
                error: null
            }
        } catch (error) {
            return {
                id: '',
                error: error instanceof Error ? error : new Error('Unexpected error')
            }
        }
    }
}
