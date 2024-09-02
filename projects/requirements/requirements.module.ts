import {DI_SYMBOLS} from "@/projects/types";
import {ContainerModule, interfaces} from "inversify";
import {RequirementsRepository} from "@/projects/requirements/domain/requirements.repository";
import {
    RequirementsMySqlRepository
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.repository";

const initializeRequirementModule = (bind: interfaces.Bind) => {
    if (process.env.NODE_ENV === "test") {
        // MOCK
        // bind<IRequirementsRepository>(DI_SYMBOLS.RequirementsRepository).to(MockRequirementsRepository);
    } else {
        bind<RequirementsRepository>(DI_SYMBOLS.RequirementsRepository).to(RequirementsMySqlRepository);
    }
}

export const RequirementsModule = new ContainerModule(initializeRequirementModule);
