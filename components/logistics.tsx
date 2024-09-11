'use client'

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export const LogisticsLandingPage = () => {
  const router = useRouter()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-gray-100 to-red-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-400 mb-6">
          Logística
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          Gestiona y optimiza todos tus procesos logísticos de manera eficiente y rápida. Accede a tus requerimientos y asegura una distribución sin problemas.
        </p>
        <Button
          variant='link'
          onClick={() => router.push('/requirements')}>
          Ver Requerimientos
        </Button>
      </div>
    </main>
  )
}
