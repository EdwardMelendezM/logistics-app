import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <span className='text-4xl text-red-400'>
                Logistica
            </span>
        </main>
    )
}
