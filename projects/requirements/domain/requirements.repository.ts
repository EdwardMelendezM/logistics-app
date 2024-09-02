import {FullError, PaginationParams} from "@/projects/shared/results/domain/resullts.entity";

import type {
    CreateRequirementBody,
    CreateRequirement,
    Requirement
} from "@/projects/requirements/domain/requirements.entity";
import type {MySqlTransaction} from "drizzle-orm/mysql-core/session";
import {db} from "@/projects/shared/drizzle";

export interface RequirementsRepository {
    getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], error: FullError }>

    getTotalRequirements(): Promise<{ total: number, error: FullError }>

    createRequirement(
        tx: MySqlTransaction<typeof db, db>,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }>

    createRequirementDetail(
        tx: MySqlTransaction<typeof db, db>,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }>

    mainCreateRequirement(
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }>
}
