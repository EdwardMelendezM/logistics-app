import {
    FullError,
    PaginationParams,
    PaginationResults,
    SearchParamsRequirement
} from "@/projects/shared/results/domain/resullts.entity";
import type {Requirement, CreateRequirementBody} from "@/projects/requirements/domain/requirements.entity";

export interface RequirementsUseCase {
    getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
        requirements: Requirement[],
        pagination: PaginationResults,
        error: FullError
    }>

    getRequirementById(requirementId: string): Promise<{ requirement: Requirement | null, error: FullError }>

    createRequirement(body: CreateRequirementBody): Promise<{ id: string, error: FullError }>
}
