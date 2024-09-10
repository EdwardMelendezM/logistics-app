"use server"

import {revalidatePath} from "next/cache";

import {getInjection} from "@/projects/container";
import {PaginationParams, SearchParamsRequirement} from "@/projects/shared/results/domain/resullts.entity";

export async function getRequirementsAction(
    pagination: PaginationParams,
    searchParams: SearchParamsRequirement) {
    try {
        const requirementsUseCase = getInjection("RequirementsUseCase")
        const {
            requirements,
            pagination: paginationResults,
            error
        } = await requirementsUseCase.getRequirements(pagination, searchParams)
        revalidatePath("/");
        return {
            requirements,
            pagination: {
                total: paginationResults.total,
                page: paginationResults.page,
                sizePage: paginationResults.sizePage
            },
            error: null
        }
    } catch (error) {
        return {
            requirements: [],
            pagination: {
                total: 0,
                page: pagination.page,
                sizePage: pagination.sizePage
            },
            error: error
        }
    }
}

export async function getRequirementByIdAction(requirementId: string | null) {
    try {
        if (!requirementId) {
            return {
                requirement: null,
                error: null
            }
        }
        revalidatePath("/");
        const requirementsUseCase = getInjection("RequirementsUseCase")
        const {requirement, error} = await requirementsUseCase.getRequirementById(requirementId)
        return {
            requirement,
            error: null
        }
    } catch (error) {
        return {
            requirement: null,
            error: error
        }
    }
}
