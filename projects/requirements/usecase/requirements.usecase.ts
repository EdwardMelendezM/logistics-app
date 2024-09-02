import {inject, injectable} from "inversify";
import {v4 as uuid} from 'uuid';

import {FullError, PaginationParams, PaginationResults} from "@/projects/shared/results/domain/resullts.entity";

import type {
    CreateRequirementBody,
    Requirement,
    CreateRequirement
} from "@/projects/requirements/domain/requirements.entity";
import {RequirementsUseCase} from "@/projects/requirements/domain/requirements.usecase";
import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";
import {DI_SYMBOLS} from "@/projects/types";

@injectable()
export class RequirementsUCase implements RequirementsUseCase {
    constructor(
        @inject(DI_SYMBOLS.RequirementsRepository) private requirementsRepository: RequirementsRepository,
    ) {
    }

    async getRequirements(pagination: PaginationParams): Promise<{
        requirements: Requirement[],
        pagination: PaginationResults,
        error: FullError
    }> {
        try {
            const {
                requirements,
                error: errorGetRequirement
            } = await this.requirementsRepository.getRequirements(pagination)
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
                status: body.status,
                priority: body.priority,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                details: body.details.map(detail => ({
                    id: uuid(),
                    requirement_id: newRequirementId,
                    description: detail.description,
                    status: detail.status,
                    priority: detail.priority,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
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


}
