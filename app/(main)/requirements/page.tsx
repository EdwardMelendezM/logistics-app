import type {Requirement} from "@/projects/requirements/domain/requirements.entity";

import {getRequirementsAction} from "@/app/(main)/requirements/actions/actions";
import RequirementsList from "@/app/(main)/requirements/components/requirements-list";
import {BreadcrumbWithCustomSeparator} from "@/components/bread-crumb";

type RequirementsPageProps = {
    searchParams: {
        page: string | undefined,
        sizePage: string | undefined,
        search: string | undefined
    }
}

export default async function RequirementsPage({searchParams}: RequirementsPageProps) {
    const page = searchParams.page ? parseInt(searchParams.page) : 1
    const sizePage = searchParams.sizePage ? parseInt(searchParams.sizePage) : 100
    const search = searchParams.search ? searchParams.search : ''
    const {
        requirements = [] as Requirement[],
        pagination,
        error
    } = await getRequirementsAction({page, sizePage}, {search})
    return (
        <>
            <BreadcrumbWithCustomSeparator items={[
                {label: 'Inicio', href: '/'},
                {label: 'Requerimientos', href: '/requirements'}]}/>
            <RequirementsList requirements={requirements} pagination={pagination}/>
        </>
    );
}
