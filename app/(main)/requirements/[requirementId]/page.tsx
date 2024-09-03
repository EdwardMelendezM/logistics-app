import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";
import {getRequirementByIdAction} from "@/app/actions/actions";

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
        <RequirementEdit requirement={requirement}/>
    );
}
