import {z} from "zod"

export type Requirement = z.infer<typeof requirement>
export type CreateRequirementBody = z.infer<typeof createRequirementBody>
export type CreateRequirement = z.infer<typeof createRequirement>
export type CreateRequirementDetail = z.infer<typeof createRequirementDetails>
export type RequirementDetails = z.infer<typeof requirementDetails>

export const requirementDetails = z.object({
    id: z.string(),
    requirement_id: z.string(),
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
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
    id: z.string(),
    requirement_id: z.string(),
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    created_at: z.string(),
    updated_at: z.string(),
})

export const createRequirement = z.object({
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    created_at: z.string(),
    updated_at: z.string(),
    details: z.array(createRequirementDetails),
})

export const createRequirementDetailsBody = z.object({
    description: z.string().min(3).max(255),
    quantity: z.string().min(1),
})

export const createRequirementBody = z.object({
    description: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    details: z.array(createRequirementDetailsBody),
})

