'use client';

import { useEffect } from 'react';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error('Error:', error);
    }, [error]);

    return (
        <main className="flex h-screen flex-col items-center justify-center p-4 bg-gray-100 text-gray-800">
            <div className="text-center">
                <h1 className="text-3xl font-semibold mb-4">¡Algo salió mal!</h1>
                <p className="mb-4 text-lg">Parece que ha ocurrido un error inesperado.</p>
                <p className="mb-6 text-sm text-gray-600">{error.message || 'Error desconocido.'}</p>
                <button
                    className="rounded-md bg-blue-500 px-6 py-3 text-sm text-white transition-colors hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => reset()}
                >
                    Intentar nuevamente
                </button>
            </div>
        </main>
    );
}
