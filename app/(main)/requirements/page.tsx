import type {Requirement} from "@/projects/requirements/domain/requirements.entity";

import {getRequirementsAction} from "@/app/(main)/requirements/actions/actions";
import RequirementsList from "@/app/(main)/requirements/components/requirements-list";
import {BreadcrumbWithCustomSeparator} from "@/components/bread-crumb";

export default async function Home() {
    const {
        requirements = [] as Requirement[],
        pagination,
        error
    } = await getRequirementsAction({page: 1, sizePage: 100}, {})
    return (
        <>
            <BreadcrumbWithCustomSeparator items={[
                {label: 'Inicio', href: '/'},
                {label: 'Requerimientos', href: '/requirements'}]}/>
            <RequirementsList requirements={requirements} pagination={pagination}/>L
        </>
    );
}
