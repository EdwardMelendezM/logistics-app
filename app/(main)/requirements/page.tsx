import type {Requirement} from "@/projects/requirements/domain/requirements.entity";

import {getRequirementsAction} from "@/app/(main)/requirements/actions/actions";
import RequirementsList from "@/app/(main)/requirements/components/requirements-list";

export default async function Home() {
    const {
        requirements = [] as Requirement[],
        pagination,
        error
    } = await getRequirementsAction({page: 1, sizePage: 100}, {})
    return (
        <main className="flex min-h-screen flex-col">
            <RequirementsList requirements={requirements} pagination={pagination}/>
        </main>
    );
}
