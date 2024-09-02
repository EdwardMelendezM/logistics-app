import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";
import {RequirementsUseCase} from "@/projects/requirements/domain/requirements.usecase";

export const DI_SYMBOLS = {
    // Repositories
    RequirementsRepository: Symbol.for("RequirementsRepository"),

    // Use Cases
    RequirementsUseCase: Symbol.for("RequirementsUseCase")
}

export interface DI_RETURN_TYPES {
    // Repositories
    RequirementsRepository: RequirementsRepository

    // Use Cases
    RequirementsUseCase: RequirementsUseCase
}
