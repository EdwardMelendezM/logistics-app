import {redirect} from "next/navigation";

import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";
import {getRequirementByIdAction} from "@/app/(main)/requirements/actions/actions";
import {BreadcrumbWithCustomSeparator} from "@/components/bread-crumb";

export type RequirementEditProp = {
    params: {
        requirementId: string | null
    }
}

export default async function RequirementEditPage({params}: RequirementEditProp) {
    const {requirementId} = params
    const {requirement, error} = await getRequirementByIdAction(requirementId)

    if (!requirement) {
        redirect('/requirements')
        return
    }
    return (
        <>
            <BreadcrumbWithCustomSeparator items={[
                {label: 'Inicio', href: '/'},
                {label: 'Requerimientos', href: '/requirements'},
                {label: 'Editar', href: `/requirements/${requirementId}`}
            ]}/>
            <RequirementEdit requirement={requirement}/>
        </>
    );
}
