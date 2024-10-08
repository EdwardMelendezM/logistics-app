export type StatusResult = {
    status: number;
}

export type StatusIdResult = {
    data: string;
    status: number;
}

export type ErrorType = {
    status: number;
    message: string;
    raw: string;
    layer: string;
    function: string;
}

export type PaginationParams = {
    page: number;
    sizePage: number;
}

export type SearchParamsRequirement = {
    search?: string;
    requirementId?: string;
}

export type PaginationResults = {
    total: number;
    page: number;
    sizePage: number;
}

export type FullError = Error | null
