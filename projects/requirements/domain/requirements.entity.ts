import {z} from "zod"

export type Requirement = z.infer<typeof requirement>
export type CreateRequirementBody = z.infer<typeof createRequirementBody>
export type CreateRequirement = z.infer<typeof createRequirement>
export type CreateRequirementDetail = z.infer<typeof createRequirementDetails>

export const requirement = z.object({
    id: z.string(),
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    // created_by: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
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

export const createRequirementBody = z.object({
    description: z.string().min(3).max(255),
    status: z.string().min(3).max(255),
    priority: z.string().min(3).max(255),
    details: z.array(createRequirementDetails),
})

