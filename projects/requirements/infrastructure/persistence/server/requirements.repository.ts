import {injectable} from "inversify";

import {PaginationParams} from "@/projects/shared/results/domain/resullts.entity";

import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";
import type {Requirement, CreateRequirement} from "@/projects/requirements/domain/requirements.entity";
import {db} from "@/projects/shared/drizzle";
import {requirementDetailsTable, requirementTable} from "@/projects/requirements/domain/requirements.schema";

@injectable()
export class RequirementsServerRepository implements RequirementsRepository {
    async getRequirements(pagination: PaginationParams): Promise<{ requirements: Requirement[], error: Error | null }> {
        try {
            const {page, sizePage} = pagination
            const requirements = await db.select()
                .from(requirementTable)
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

    async createRequirement(requirementId: string, body: CreateRequirement): Promise<{
        id: string,
        error: Error | null
    }> {
        try {
            await db.transaction(async (tx) => {
                try {
                    tx.insert(requirementTable).values({
                        id: requirementId,
                        priority: body.priority,
                        status: body.status,
                        description: body.description,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
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
                } catch (error) {
                    tx.rollback();
                    throw error;
                }
            });
        } catch (error) {
            if (error instanceof Error) {
                return {id: '', error: error};
            }
            return {id: '', error: new Error('Error creating requirement')};
        }
    }
}
