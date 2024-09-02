import {Container} from "inversify";

import {RequirementsModule} from "@/projects/requirements/requirements.module";
import {DI_RETURN_TYPES, DI_SYMBOLS} from "@/projects/types";

const ApplicationContainer = new Container({
    defaultScope: "Singleton",
});

export const initializeContainer = () => {
    ApplicationContainer.load(RequirementsModule);
}

export const destroyContainer = () => {
    ApplicationContainer.unload(RequirementsModule);
}

if (process.env.NODE_ENV !== "test") {
    initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
    symbol: K,
): DI_RETURN_TYPES[K] {
    return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}

export {ApplicationContainer};
