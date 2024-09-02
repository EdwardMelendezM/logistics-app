import {getRequirementsAction} from "@/app/actions/actions";

export default function Home() {
    const {requirements = [], error} = getRequirementsAction({page: 1, sizePage: 100})
    console.log(requirements, error)
    if (error) {
        return <div>Error: {error.message}</div>
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            ONICHAN
            {
                requirements.map(requirement => (
                    <div key={requirement.id} className="flex flex-col">
                        <h2>{requirement.description}</h2>
                        <p>{requirement.status}</p>
                        <p>{requirement.priority}</p>
                    </div>
                ))
            }
        </main>
    );
}
