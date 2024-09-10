import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";
import {BreadcrumbWithCustomSeparator} from "@/components/bread-crumb";

export default async function RequirementNewPage() {
    return (
        <>
            <BreadcrumbWithCustomSeparator items={[
                {label: 'Inicio', href: '/'},
                {label: 'Requerimientos', href: '/requirements'},
                {label: 'Crear', href: `/requirements/new`}
            ]}/>
            <RequirementEdit requirement={null}/>
        </>
    );
}
