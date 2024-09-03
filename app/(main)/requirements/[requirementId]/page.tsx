import {RequirementEdit} from "@/app/(main)/requirements/components/requirement-edit";

export type RequirementEditProp = {
    params: {
        requirementId: string
    }
}

export default async function RequirementEditPage({params}: RequirementEditProp) {
    const {requirementId} = params
    return (
        <RequirementEdit isEdit={requirementId !== "NEW"}/>
    );
}
