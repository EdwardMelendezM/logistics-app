import { DI_SYMBOLS } from "@/projects/types";
import { ContainerModule, interfaces } from "inversify";
import { RequirementsRepository } from "@/projects/requirements/domain/requirements.repository";
import {
    RequirementsMySqlRepository
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.repository";
import { RequirementsUseCase } from "@/projects/requirements/domain/requirements.usecase";
import { RequirementsUCase } from "@/projects/requirements/usecase/requirements.usecase";
import { MockRequirementsUseCase } from "./usecase/requirements.usecase.mock";

const initializeRequirementModule = (bind: interfaces.Bind) => {
    if (process.env.NODE_ENV === "test") {
        // MOCK
        // bind<IRequirementsRepository>(DI_SYMBOLS.RequirementsRepository).to(MockRequirementsRepository);
        bind<RequirementsUseCase>(DI_SYMBOLS.RequirementsRepository).to(MockRequirementsUseCase);
    } else {
        bind<RequirementsUseCase>(DI_SYMBOLS.RequirementsUseCase).to(RequirementsUCase);
        bind<RequirementsRepository>(DI_SYMBOLS.RequirementsRepository).to(RequirementsMySqlRepository);
    }
}

export const RequirementsModule = new ContainerModule(initializeRequirementModule);
