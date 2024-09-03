import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";
import {getRequirementByIdAction} from "@/app/actions/actions";

export type RequirementEditProp = {
    params: {
        requirementId: string
    }
}

export default async function RequirementEditPage({params}: RequirementEditProp) {
    const {requirementId} = params
    const requirementIdAux = requirementId === 'NEW' ? null : requirementId
    const {requirement, error} = await getRequirementByIdAction(requirementIdAux)
    console.log(requirement)
    return (
        <RequirementEdit isEdit={requirementId !== "NEW"} requirement={requirement}/>
    );
}
