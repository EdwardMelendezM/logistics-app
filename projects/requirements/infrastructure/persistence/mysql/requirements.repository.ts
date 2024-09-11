import { injectable } from "inversify";
import { and, count, eq, isNull, like, sql } from "drizzle-orm";

import { FullError, PaginationParams, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";
import { db } from "@/projects/shared/drizzle";

import {
    requirementDetailsTable,
    requirementTable
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.schema";
import { RequirementsRepository } from "@/projects/requirements/domain/requirements.repository";
import type {
    Requirement,
    CreateRequirement,
} from "@/projects/requirements/domain/requirements.entity";
import { formatISO } from "date-fns";
import { UpdateRequirementBody, UpdateRequirementDetail } from "@/projects/requirements/domain/requirements.entity";

export type Tx = typeof db & { rollback: () => void }

type RequirementMap = typeof requirementTable.$inferSelect
type RequirementDetailMap = typeof requirementDetailsTable.$inferSelect

@injectable()
export class RequirementsMySqlRepository implements RequirementsRepository {
    async getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
        requirements: Requirement[],
        error: FullError
    }> {
        try {
            const { page = 1, sizePage = 100 } = pagination
            const search = searchParams.search ? `%${searchParams.search}%` : '%'
            const requirementFiltered = db.select({
                id: requirementTable.id,
                description: requirementTable.description,
                status: requirementTable.status,
                priority: requirementTable.priority,
                created_at: requirementTable.created_at,
                updated_at: requirementTable.updated_at,
            })
                .from(requirementTable)
                .where(and(isNull(requirementTable.deleted_at), like(requirementTable.description, sql`${search}`)))
                .limit(sizePage)
                .offset((page - 1) * sizePage)
                .orderBy(requirementTable.created_at).as('requirementFiltered') as any


            const results = await db.select({
                requirement: {
                    id: requirementFiltered.id,
                    description: requirementFiltered.description,
                    status: requirementFiltered.status,
                    priority: requirementFiltered.priority,
                    created_at: requirementFiltered.created_at,
                    updated_at: requirementFiltered.updated_at,
                },
                detail: requirementDetailsTable
            })
                .from(requirementDetailsTable)
                .innerJoin(requirementFiltered, eq(requirementFiltered.id, requirementDetailsTable.requirement_id))
                .where(isNull(requirementDetailsTable.deleted_at))
                .orderBy(requirementDetailsTable.created_at) as { requirement: RequirementMap, detail: RequirementDetailMap }[]
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
                        created_at: String(requirement.created_at),
                        updated_at: String(requirement.updated_at),
                        details: []
                    }
                }

                if (detail) {
                    requirementsMap[requirement.id].details.push({
                        id: detail.id,
                        requirement_id: detail.requirement_id,
                        description: detail.description,
                        quantity: String(detail.quantity),
                        created_at: String(detail.created_at),
                        updated_at: String(detail.updated_at),
                    });
                }
            }
            const requirements = Object.values(requirementsMap);
            return { requirements, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { requirements: [], error: error };
            }
            return { requirements: [], error: new Error('Error getting requirements') };
        }
    }

    async getTotalRequirements(): Promise<{ total: number, error: FullError }> {
        try {
            const [{ value: total }] = await db.select({ value: count() })
                .from(requirementTable)
                .where(isNull(requirementTable.deleted_at));
            return { total: total, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { total: 0, error: error };
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
                .where(and(isNull(requirementTable.deleted_at), isNull(requirementDetailsTable.deleted_at), eq(requirementTable.id, requirementId)))

            const requirementsMap: Record<string, any> = {};
            for (const result of results) {
                const requirement = result.requirement;
                const detail = result.detail;

                if (!requirementsMap[requirement.id]) {
                    requirementsMap[requirement.id] = {
                        id: requirement.id,
                        description: requirement.description,
                        status: requirement.status,
                        priority: requirement.priority,
                        created_at: String(requirement.created_at),
                        updated_at: String(requirement.updated_at),
                        details: []
                    }
                }

                if (detail) {
                    requirementsMap[requirement.id].details.push({
                        id: detail.id,
                        requirement_id: detail.requirement_id,
                        description: detail.description,
                        quantity: String(detail.quantity),
                        created_at: String(requirement.created_at),
                        updated_at: String(requirement.updated_at),
                        deleted_at: String(requirement.deleted_at),
                    });
                }
            }
            const requirements = Object.values(requirementsMap);
            if (requirements.length === 0) {
                return { requirement: null, error: null };
            }
            return { requirement: requirements[0], error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { requirement: null, error: error };
            }
            return { requirement: null, error: new Error('Error getting requirement') };
        }
    }

    async createRequirement(
        tx: Tx,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            const now = "2024-09-09T11:02:12-05:00"
            const exec = await db.insert(requirementTable).values({
                id: requirementId,
                priority: body.priority,
                status: body.status,
                description: body.description,
                created_at: now,
                updated_at: now,
            }).prepare()
            await exec.execute()
            return { id: requirementId, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { id: '', error: error };
            }
            return { id: '', error: new Error('Error creating requirement') };
        }
    }

    async createRequirementDetail(
        tx: Tx,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            const now = "2024-09-09T11:02:12-05:00"
            for (const detail of body.details) {
                const exec = await db.insert(requirementDetailsTable).values({
                    id: detail.id!,
                    requirement_id: requirementId,
                    description: detail.description,
                    quantity: Number(detail.quantity),
                    created_at: now,
                    updated_at: now,
                }).prepare()
                await exec.execute()
            }
            return { id: requirementId, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { id: '', error: error };
            }
            return { id: '', error: new Error('Error creating requirement') };
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
            // const now = formatISO(new Date());
            const now = formatISO(new Date(), { representation: 'complete' });
            await db.transaction(async (tx) => {
                await tx.insert(requirementTable).values({
                    id: requirementId,
                    priority: body.priority,
                    status: body.status,
                    description: body.description,
                    created_at: now,
                    updated_at: now,
                })
                for (const detail of body.details) {
                    await tx.insert(requirementDetailsTable).values({
                        id: detail.id!,
                        requirement_id: requirementId,
                        description: detail.description,
                        quantity: Number(detail.quantity),
                        created_at: now,
                        updated_at: now,
                    })
                }
            })
            return { id: requirementId, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { id: '', error: error };
            }
            return { id: '', error: new Error('Error creating requirement') };
        }
    }

    async mainUpdateRequirement(
        requirementId: string,
        body: UpdateRequirementBody,
        newRequirementDetails: Record<string, UpdateRequirementDetail>,
        updateExistingDetails: Record<string, UpdateRequirementDetail>,
        removeDetails: Record<string, UpdateRequirementDetail>
    ): Promise<{
        id: string,
        error: FullError
    }> {
        try {
            const now = formatISO(new Date(), { representation: 'complete' });
            await db.transaction(async (tx) => {
                await tx.update(requirementTable)
                    .set({
                        description: body.description,
                        priority: body.priority,
                        status: "NEW",
                        updated_at: now
                    })
                    .where(eq(requirementTable.id, requirementId))
                    .prepare()
                    .execute()
                for (const detail of Object.values(newRequirementDetails)) {
                    await tx.insert(requirementDetailsTable).values({
                        id: detail.id!,
                        requirement_id: requirementId,
                        description: detail.description,
                        quantity: Number(detail.quantity),
                        created_at: now,
                        updated_at: now,
                        deleted_at: null
                    }).prepare().execute()
                }
                for (const detail of Object.values(updateExistingDetails)) {
                    await tx.update(requirementDetailsTable)
                        .set({
                            description: detail.description,
                            quantity: Number(detail.quantity),
                            updated_at: now
                        })
                        .where(eq(requirementDetailsTable.id, detail.id!))
                        .prepare()
                        .execute()
                }
                for (const detail of Object.values(removeDetails)) {
                    await tx.update(requirementDetailsTable)
                        .set({
                            deleted_at: now
                        })
                        .where(eq(requirementDetailsTable.id, detail.id!))
                        .prepare()
                        .execute()
                }
            })
            return { id: requirementId, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { id: '', error: error };
            }
            return { id: '', error: new Error('Error updating requirement') };
        }
    }

    async removeRequirement(requirementId: string): Promise<{ id: string, error: FullError }> {
        try {
            const now = formatISO(new Date(), { representation: 'complete' });
            await db.transaction(async (tx) => {
                await tx.update(requirementTable)
                    .set({
                        deleted_at: now
                    })
                    .where(eq(requirementTable.id, requirementId))
                    .prepare()
                    .execute()
                await tx.update(requirementDetailsTable)
                    .set({
                        deleted_at: now
                    })
                    .where(eq(requirementDetailsTable.requirement_id, requirementId))
                    .prepare()
                    .execute()
            })
            return { id: requirementId, error: null };
        } catch (error) {
            if (error instanceof Error) {
                return { id: '', error: error };
            }
            return { id: '', error: new Error('Error removing requirement') };
        }
    }
}
