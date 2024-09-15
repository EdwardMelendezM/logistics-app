import "reflect-metadata";

import {
    destroyContainer,
    getInjection,
    initializeContainer,
} from "@/projects/container";

import { MockRequirementsUseCase } from "@/projects/requirements/usecase/requirements.usecase.mock";
import {
    MockRequirementsRepository
} from "@/projects/requirements/infrastructure/persistence/mysql/requirements.repository.mock";
import { afterEach, beforeEach, expect, it } from "vitest";

beforeEach(() => {
    initializeContainer();
});

afterEach(() => {
    destroyContainer();
});

it("should use mock version of repos and use cases",
    async () => {
        const requirementsRepository = getInjection("IRequirementsRepository");
        expect(requirementsRepository).toBeInstanceOf(MockRequirementsRepository);

        const requirementsUseCase = getInjection("IRequirementsUseCase");
        expect(requirementsUseCase).toBeInstanceOf(MockRequirementsUseCase);
    })
