import {FullError, PaginationParams, PaginationResults} from "@/projects/shared/results/domain/resullts.entity";
import type {Requirement, CreateRequirementBody} from "@/projects/requirements/domain/requirements.entity";

export interface RequirementsUseCase {
    getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], pagination: PaginationResults, error: FullError }>

    createRequirement(requirementId: string, body: CreateRequirementBody): Promise<{ id: string, error: FullError }>
}
