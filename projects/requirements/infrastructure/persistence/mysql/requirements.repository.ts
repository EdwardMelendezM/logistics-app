import {injectable} from "inversify";
import {count, isNull} from "drizzle-orm";
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
} from "@/projects/requirements/domain/requirements.entity";

@injectable()
export class RequirementsMySqlRepository implements RequirementsRepository {
    async getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], error: FullError }> {
        try {
            const {page = 1, sizePage = 100} = pagination
            const requirements = await db.select()
                .from(requirementTable)
                .where(isNull(requirementTable.deleted_at))
                .limit(sizePage)
                .offset((page - 1) * sizePage)

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
                    status: detail.status,
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
