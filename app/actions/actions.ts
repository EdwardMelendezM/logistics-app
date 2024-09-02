"use server"

import {revalidatePath} from "next/cache";

import {getInjection} from "@/projects/container";

export async function createRequirementAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries()) as any
        const requirementsUseCase = getInjection("RequirementsUseCase")
        const {id, error} = await requirementsUseCase.createRequirement({
            description: data.description,
            status: data.status,
            priority: data.priority,
            details: data.details.map(detail => ({
                description: detail.description,
                status: detail.status,
                priority: detail.priority
            }))
        })
        revalidatePath("/");
        return {
            id,
            error
        }
    } catch (error) {
        return {
            id: null,
            error: error
        }
    }
}


export async function getRequirementsAction(pagination: { page: number, sizePage: number }) {
    try {
        const requirementsUseCase = getInjection("RequirementsUseCase")
        const {requirements, pagination: paginationResults, error} = await requirementsUseCase.getRequirements({
            page: pagination.page,
            sizePage: pagination.sizePage
        })
        return {
            requirements,
            pagination: paginationResults,
            error
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
