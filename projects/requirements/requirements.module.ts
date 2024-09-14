import {DI_SYMBOLS} from "@/projects/types";
import {ContainerModule, interfaces} from "inversify";
import {IRequirementsRepository} from "@/projects/requirements/domain/requirements.repository.interface";
import {
    RequirementsMySqlRepository
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.repository";
import {IRequirementsUseCase} from "@/projects/requirements/domain/requirements.usecase.interface";
import {RequirementsUCase} from "@/projects/requirements/usecase/requirements.usecase";
import {MockRequirementsUseCase} from "./usecase/requirements.usecase.mock";
import {MockRequirementsRepository} from "./infrastructure/persistence/mysql/requirements.repository.mock";

const initializeRequirementModule = (bind: interfaces.Bind) => {
    if (process.env.NODE_ENV === "test") {
        bind<IRequirementsRepository>(DI_SYMBOLS.IRequirementsRepository).to(MockRequirementsRepository);
        bind<IRequirementsUseCase>(DI_SYMBOLS.IRequirementsUseCase).to(MockRequirementsUseCase);
    } else {
        bind<IRequirementsRepository>(DI_SYMBOLS.IRequirementsRepository).to(RequirementsMySqlRepository);
        bind<IRequirementsUseCase>(DI_SYMBOLS.IRequirementsUseCase).to(RequirementsUCase);
    }
}

export const RequirementsModule = new ContainerModule(initializeRequirementModule);
