import { IRequirementsRepository } from "@/projects/requirements/domain/requirements.repository.interface";
import { IRequirementsUseCase } from "@/projects/requirements/domain/requirements.usecase.interface";

export const DI_SYMBOLS = {
    // Repositories
    IRequirementsRepository: Symbol.for("IRequirementsRepository"),

    // Use Cases
    IRequirementsUseCase: Symbol.for("IRequirementsUseCase")
}

export interface DI_RETURN_TYPES {
    // Repositories
    IRequirementsRepository: IRequirementsRepository

    // Use Cases
    IRequirementsUseCase: IRequirementsUseCase
}
