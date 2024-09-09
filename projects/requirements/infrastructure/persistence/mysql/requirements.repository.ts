import {injectable} from "inversify";
import {count, eq, isNull, sql} from "drizzle-orm";
import type {MySqlTransaction} from "drizzle-orm/mysql-core/session";

import {FullError, PaginationParams} from "@/projects/shared/results/domain/resullts.entity";
import {db} from "@/projects/shared/drizzle";

import {
    requirementDetailsTable,
    requirementTable
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.schema";
import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";
import type {
    Requirement,
    CreateRequirement,
    RequirementDetails
} from "@/projects/requirements/domain/requirements.entity";

type RequirementMap = typeof requirementTable.$inferSelect
type RequirementDetailMap = typeof requirementDetailsTable.$inferSelect

@injectable()
export class RequirementsMySqlRepository implements RequirementsRepository {
    async getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], error: FullError }> {
        try {
            const {page = 1, sizePage = 100} = pagination
            const results = await db.select({
                requirement: requirementTable,
                detail: requirementDetailsTable
            })
                .from(requirementTable)
                .innerJoin(requirementDetailsTable, eq(requirementTable.id, requirementDetailsTable.requirement_id))
                .where(isNull(requirementTable.deleted_at))
                .limit(sizePage)
                .offset((page - 1) * sizePage) as { requirement: RequirementMap, detail: RequirementDetailMap }[]
            const requirementsMap: Record<string, Requirement> = {};

            for (const result of results) {
                const requirement = result.requirement;
                const detail = result.detail;

                if (!requirementsMap[requirement.id]) {
                    requirementsMap[requirement.id] = {
                        id: requirement.id,
                        description: requirement.description,
                        status: requirement.status,
                        priority: requirement.priority,
                        created_at: requirement.created_at,
                        updated_at: requirement.updated_at,
                        details: []
                    }
                }

                if (detail) {
                    requirementsMap[requirement.id].details.push({
                        id: detail.id,
                        requirement_id: detail.requirement_id,
                        description: detail.description,
                        created_at: detail.created_at,
                        updated_at: detail.updated_at,
                    });
                }
            }
            const requirements = Object.values(requirementsMap);

            return {requirements, error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {requirements: [], error: error};
            }
            return {requirements: [], error: new Error('Error getting requirements')};
        }
    }

    async getTotalRequirements(): Promise<{ total: number, error: FullError }> {
        try {
            const total = await db.select({value: count()})
                .from(requirementTable)
                .where(isNull(requirementTable.deleted_at))

            return {total: total as number, error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {total: 0, error: error};
            }
            return {
                total: 0, error: new Error('Error getting total requirements')
            }
        }
    }

    async getRequirementById(requirementId: string): Promise<{ requirement: Requirement | null, error: FullError }> {
        try {
            const results = await db.select({
                requirement: requirementTable,
                detail: requirementDetailsTable
            })
                .from(requirementTable)
                .innerJoin(requirementDetailsTable, eq(requirementTable.id, requirementDetailsTable.requirement_id))
                .where(eq(requirementTable.id, requirementId))
                .where(isNull(requirementTable.deleted_at)) as {
                requirement: RequirementMap,
                detail: RequirementDetailMap
            }[]
            const requirementsMap: Record<string, Requirement> = {};

            for (const result of results) {
                const requirement = result.requirement;
                const detail = result.detail;

                if (!requirementsMap[requirement.id]) {
                    requirementsMap[requirement.id] = {
                        id: requirement.id,
                        description: requirement.description,
                        status: requirement.status,
                        priority: requirement.priority,
                        created_at: requirement.created_at,
                        updated_at: requirement.updated_at,
                        details: []
                    }
                }

                if (detail) {
                    requirementsMap[requirement.id].details.push({
                        id: detail.id,
                        requirement_id: detail.requirement_id,
                        description: detail.description,
                        created_at: detail.created_at,
                        updated_at: detail.updated_at,
                    });
                }
            }
            const requirements = Object.values(requirementsMap);
            if (requirements.length === 0) {
                return {requirement: null, error: null};
            }

            return {requirement: requirements[0], error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {requirement: null, error: error};
            }
            return {requirement: null, error: new Error('Error getting requirement')};
        }
    }

    async createRequirement(
        tx: MySqlTransaction<any, any, any, any>,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            tx.insert(requirementTable).values({
                id: requirementId,
                priority: body.priority,
                status: body.status,
                description: body.description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            return {id: requirementId, error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {id: '', error: error};
            }
            return {id: '', error: new Error('Error creating requirement')};
        }
    }

    async createRequirementDetail(
        tx: MySqlTransaction<any, any, any, any>,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            for (const detail of body.details) {
                await tx.insert(requirementDetailsTable).values({
                    id: detail.id,
                    requirement_id: requirementId,
                    description: detail.description,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
            }
            return {id: requirementId, error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {id: '', error: error};
            }
            return {id: '', error: new Error('Error creating requirement')};
        }
    }

    async mainCreateRequirement(
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            await db.transaction(async (tx) => {
                const {_, errorCreateRequirement} = await this.createRequirement(tx, requirementId, body)
                if (errorCreateRequirement) {
                    tx.rollback()
                    throw errorCreateRequirement
                }
                const {__, errorCreateRequirementDetails} = await this.createRequirementDetail(tx, requirementId, body)
                if (errorCreateRequirementDetails) {
                    tx.rollback()
                    throw errorCreateRequirementDetails
                }
            });
            return {id: requirementId, error: null};
        } catch (error) {
            if (error instanceof Error) {
                return {id: '', error: error};
            }
            return {id: '', error: new Error('Error creating requirement')};
        }
    }
}
