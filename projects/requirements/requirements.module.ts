import { DI_SYMBOLS } from "@/projects/types";
import { ContainerModule, interfaces } from "inversify";
import { RequirementsRepositoryInterface } from "@/projects/requirements/domain/requirements.repository.interface";
import {
    RequirementsMySqlRepository
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.repository";
import { RequirementsUsecaseInterface } from "@/projects/requirements/domain/requirements.usecase.interface";
import { RequirementsUCase } from "@/projects/requirements/usecase/requirements.usecase";
import { MockRequirementsUseCase } from "./usecase/requirements.usecase.mock";
import { MockRequirementsRepository } from "./infrastructure/persistence/mysql/requirements.repository.mock";

const initializeRequirementModule = (bind: interfaces.Bind) => {
    if (process.env.NODE_ENV === "test") {
        bind<RequirementsRepositoryInterface>(DI_SYMBOLS.RequirementsRepository).to(MockRequirementsRepository);
        bind<RequirementsUsecaseInterface>(DI_SYMBOLS.RequirementsRepository).to(MockRequirementsUseCase);
    } else {
        bind<RequirementsUsecaseInterface>(DI_SYMBOLS.RequirementsUseCase).to(RequirementsUCase);
        bind<RequirementsRepositoryInterface>(DI_SYMBOLS.RequirementsRepository).to(RequirementsMySqlRepository);
    }
}

export const RequirementsModule = new ContainerModule(initializeRequirementModule);
