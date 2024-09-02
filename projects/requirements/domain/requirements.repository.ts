import {FullError, PaginationParams} from "@/projects/shared/results/domain/resullts.entity";

import type {createRequirementBody, requirement} from "@/projects/requirements/domain/requirements.entity";
import type {MySqlTransaction} from "drizzle-orm/mysql-core/session";

export interface RequirementsRepository {
    getRequirements(pagination: PaginationParams): Promise<{ requirements: requirement[], error: FullError }>

    getTotalRequirements(): Promise<{ total: number, error: FullError }>

    createRequirement(
        tx: MySqlTransaction<any, any, any, any>,
        requirementId: string,
        body: createRequirementBody
    ): Promise<{
        id: string,
        error: FullError
    }>

    createRequirementDetail(
        tx: MySqlTransaction<any, any, any, any>,
        requirementId: string,
        body: createRequirementBody
    ): Promise<{
        id: string,
        error: FullError
    }>
}
