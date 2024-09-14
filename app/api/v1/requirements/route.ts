import { NextResponse } from "next/server";
import { getInjection } from "@/projects/container";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const requirementsUseCase = getInjection("IRequirementsUseCase");

        const { id, error } = await requirementsUseCase.createRequirement({
            description: data.description,
            priority: data.priority,
            details: data.details.map((detail: any) => ({
                description: detail.description,
                quantity: detail.quantity,
            })),
        });

        if (error) {
            console.log(error);
            return NextResponse.json(
                { id: null, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { id, error: null },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
