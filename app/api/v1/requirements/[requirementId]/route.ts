import {getInjection} from "@/projects/container";
import {NextResponse} from "next/server";

type DeleteRequirementParams = {
    requirementId: string;
}

export async function DELETE(request: Request, {params}: { params: DeleteRequirementParams }) {
    try {
        const {requirementId} = params;
        if (!requirementId) {
            return NextResponse.json(
                {message: "REQUIREMENT_ID_REQUIRED"},
                {status: 400}
            );
        }
        const requirementsUseCase = getInjection("RequirementsUseCase");

        const {error} = await requirementsUseCase.removeRequirement(requirementId);

        if (error) {
            console.log(error);
            return NextResponse.json(
                {error: error.message},
                {status: 500}
            );
        }

        return NextResponse.json({
                id: requirementId,
                error: null,
            },
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {message: "INTERNAL_SERVER_ERROR"},
            {status: 500}
        );
    }
}

// Update Requirement
export async function PUT(request: Request, {params}: { params: DeleteRequirementParams, body: any }) {
    try {
        const {requirementId} = params;
        const body = await request.json()

        if (!requirementId) {
            return NextResponse.json(
                {message: "REQUIREMENT_ID_REQUIRED"},
                {status: 400}
            );
        }
        const requirementsUseCase = getInjection("RequirementsUseCase");

        const {error} = await requirementsUseCase.updateRequirement(requirementId, {
            description: body.description,
            priority: body.priority,
            details: body.details
        });

        if (error) {
            console.log(error);
            return NextResponse.json(
                {error: error.message},
                {status: 500}
            );
        }

        return NextResponse.json({
                id: requirementId,
                error: null,
            },
            {status: 200}
        );
    } catch (error) {
        return NextResponse.json(
            {message: "INTERNAL_SERVER_ERROR"},
            {status: 500}
        );
    }
}
