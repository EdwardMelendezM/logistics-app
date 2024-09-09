import {z} from "zod"

export type Requirement = z.infer<typeof requirement>
export type RequirementDetails = z.infer<typeof requirementDetails>

export type CreateRequirementBody = z.infer<typeof createRequirementBody>
export type CreateRequirement = z.infer<typeof createRequirement>
export type CreateRequirementDetail = z.infer<typeof createRequirementDetails>

export type UpdateRequirementBody = z.infer<typeof updateRequirementBody>
export type UpdateRequirementDetail = z.infer<typeof updateRequirementDetailsBody>

export const requirementDetails = z.object({
    id: z.string(),
    requirement_id: z.string(),
    description: z.string().min(3).max(255),
    quantity: z.string().min(1),
    created_at: z.string(),
    updated_at: z.string(),
})

export const requirement = z.object({
    id: z.string(),
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    created_at: z.string(),
    updated_at: z.string(),
    details: z.array(requirementDetails),
})

export const createRequirementDetails = z.object({
    id: z.string().nullish(),
    requirement_id: z.string(),
    description: z.string().min(3).max(255),
    quantity: z.string().min(1),
})

export const createRequirement = z.object({
    description: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    details: z.array(createRequirementDetails),
})

export const createRequirementDetailsBody = z.object({
    id: z.string().nullable().optional(),
    description: z.string().min(1, "Descripcion es requerido").max(255),
    quantity: z.string().min(1, "Cantidad es requerido"),
})

export const createRequirementBody = z.object({
    description: z.string().min(1, "Descripcion es requerido").max(255),
    priority: z.string().min(1, "Prioridad es requerido").max(255),
    details: z.array(createRequirementDetailsBody),
})

export const updateRequirementDetailsBody = z.object({
    id: z.string().nullable().optional(),
    description: z.string().min(3).max(255),
    quantity: z.string().min(1),
})

export const updateRequirementBody = z.object({
    description: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    details: z.array(updateRequirementDetailsBody),
})


