import {inject, injectable} from "inversify";
import {v4 as uuid} from 'uuid';
import {RequirementsUseCase} from "@/projects/requirements/domain/requirements.usecase";
import {FullError, PaginationParams, PaginationResults} from "@/projects/shared/results/domain/resullts.entity";
import type {
    CreateRequirementBody,
    Requirement,
    CreateRequirement
} from "@/projects/requirements/domain/requirements.entity";
import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";

@injectable()
export class RequirementsUCase implements RequirementsUseCase {
    constructor(
        @inject("RequirementsRepository") private requirementsRepository: RequirementsRepository,
    ) {
    }

    async getRequirements(pagination: PaginationParams): Promise<{
        requirements: Requirement[],
        pagination: PaginationResults,
        error: FullError
    }> {
        try {
            const results = await Promise.all([
                this.requirementsRepository.getTotalRequirements(),
                this.requirementsRepository.getRequirements(pagination)
            ] as any);

            const [totalResult, requirementsResult] = results;

            const { total, error: errorGetTotalRequirement } = totalResult;
            const { requirements, error: errorGetRequirement } = requirementsResult;

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

    async createRequirement(requirementId: string, body: CreateRequirementBody): Promise<{
        id: string;
        error: FullError
    }> {
        // const newRequirementId = uuid();
        // const newRequirement: CreateRequirement = {
        //     description: body.description,
        //     status: body.status,
        //     priority: body.priority,
        //     created_by: requirementId,
        //     created_at: new Date().toISOString(),
        //     updated_at: new Date().toISOString(),
        //     details: body.details.map(detail => ({
        //         id: uuid(),
        //         requirement_id: newRequirementId,
        //         description: detail.description,
        //         status: detail.status,
        //         priority: detail.priority,
        //         created_at: new Date().toISOString(),
        //         updated_at: new Date().toISOString(),
        //     }))
        // }
        throw new Error("Method not implemented.");

    }


}
