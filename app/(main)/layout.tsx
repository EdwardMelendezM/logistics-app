import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/sonner";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Logistica",
    description: "Logistica del sistema",
};

export default function LogisticLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Sidebar />
                <div className="pl-24 pt-6 pr-4">
                    {children}
                </div>
                <Toaster position="bottom-center" />
            </body>

        </html>
    );
}
