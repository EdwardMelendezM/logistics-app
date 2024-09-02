import type {MySqlTransaction} from "drizzle-orm/mysql-core/session";

import {FullError, PaginationParams} from "@/projects/shared/results/domain/resullts.entity";

import type {
    CreateRequirement,
    Requirement
} from "@/projects/requirements/domain/requirements.entity";

export interface RequirementsRepository {
    getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], error: FullError }>

    getTotalRequirements(): Promise<{ total: number, error: FullError }>

    createRequirement(
        tx: MySqlTransaction<any, any, any, any>,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }>

    createRequirementDetail(
        tx: MySqlTransaction<any, any, any, any>,
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
