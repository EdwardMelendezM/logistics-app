type Tx = typeof db & { rollback: () => void }

import { FullError, PaginationParams, SearchParamsRequirement } from "@/projects/shared/results/domain/resullts.entity";

import type {
    CreateRequirement,
    Requirement
} from "@/projects/requirements/domain/requirements.entity";
import { UpdateRequirementBody, UpdateRequirementDetail } from "@/projects/requirements/domain/requirements.entity";
import { db } from "@/projects/shared/drizzle";

export interface RequirementsRepositoryInterface {
    getRequirements(pagination: PaginationParams, searchParams: SearchParamsRequirement): Promise<{
        requirements: Requirement[],
        error: FullError
    }>

    getTotalRequirements(): Promise<{ total: number, error: FullError }>

    getRequirementById(requirementId: string): Promise<{ requirement: Requirement | null, error: FullError }>

    createRequirement(
        tx: Tx,
        requirementId: string,
        body: CreateRequirement
    ): Promise<{
        id: string,
        error: FullError
    }>

    createRequirementDetail(
        tx: Tx,
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

    mainUpdateRequirement(
        requirementId: string,
        body: UpdateRequirementBody,
        newRequirementDetails: Record<string, UpdateRequirementDetail>,
        updateExistingDetails: Record<string, UpdateRequirementDetail>,
        removeDetails: Record<string, UpdateRequirementDetail>
    ): Promise<{
        id: string,
        error: FullError
    }>

    removeRequirement(requirementId: string): Promise<{ id: string, error: FullError }>
}
