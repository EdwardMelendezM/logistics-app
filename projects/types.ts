import {RequirementsRepositoryInterface} from "@/projects/requirements/domain/requirements.repository.interface";
import {RequirementsUsecaseInterface} from "@/projects/requirements/domain/requirements.usecase.interface";

export const DI_SYMBOLS = {
    // Repositories
    RequirementsRepository: Symbol.for("RequirementsRepository"),

    // Use Cases
    RequirementsUseCase: Symbol.for("RequirementsUseCase")
}

export interface DI_RETURN_TYPES {
    // Repositories
    RequirementsRepository: RequirementsRepositoryInterface

    // Use Cases
    RequirementsUseCase: RequirementsUsecaseInterface
}
