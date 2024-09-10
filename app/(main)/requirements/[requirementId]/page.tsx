import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";
import {getRequirementByIdAction} from "@/app/(main)/requirements/actions/actions";
import {BreadcrumbWithCustomSeparator} from "@/components/bread-crumb";

export type RequirementEditProp = {
    params: {
        requirementId: string
    }
}

export default async function RequirementEditPage({params}: RequirementEditProp) {
    const {requirementId} = params
    const requirementIdAux = requirementId === 'new' ? null : requirementId
    const {requirement, error} = await getRequirementByIdAction(requirementIdAux)
    return (
        <>
            <BreadcrumbWithCustomSeparator items={[
                {label: 'Inicio', href: '/'},
                {label: 'Requerimientos', href: '/requirements'},
                {label: requirementIdAux ? 'Editar' : 'Crear', href: `/requirements/${requirementIdAux}`}
            ]}/>
            <RequirementEdit requirement={requirement}/>
        </>
    );
}
