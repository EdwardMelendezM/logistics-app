import {PaginationParams} from "@/projects/shared/results/domain/resullts.entity";

import type {createRequirementBody, requirement} from "@/projects/requirements/domain/requirements.entity";

export interface RequirementsRepository {
    getRequirements(pagination: PaginationParams): Promise<{ requirements: requirement[], error: Error | null }>

    createRequirement(requirementId: string, body: createRequirementBody): Promise<{ id: string, error: Error | null }>
}
