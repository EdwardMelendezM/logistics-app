import {NextResponse} from "next/server";
import {createRequirementAction} from "@/app/actions/actions";

export async function POST(req, res) {
    const data = await req.json()
    const {id, error} = await createRequirementAction(data)
    if (error) {
        return new NextResponse.json({
            id: null,
            error: error
        })
    }

    return NextResponse.json({
        id,
        error: null
    })
}
