'use client'

import * as React from 'react'
import Link from 'next/link'

import {HamburgerMenuIcon} from "@radix-ui/react-icons"
import {
    ChevronDown,
    ChevronUp,
    Package,
    FileText,
    DollarSign,
    ChevronLeft,
    ClipboardList,
    CreditCard
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from '@/components/ui/collapsible'

const modules = [
    {
        name: 'Requerimientos', icon: Package, links: [
            {name: 'Pendientes', href: '/requirements'},
            {name: 'Historico', href: '/requirements/history'},
            {name: 'Reportes', href: '/requirements/reports'},
        ]
    },
    {
        name: 'Cotizaciones', icon: FileText, links: [
            {name: 'Pendientes', href: '/quotations'},
            {name: 'Historico', href: '/'},
            {name: 'Reportes', href: '/'},
        ]
    },
    {
        name: 'Ordenes', icon: ClipboardList, links: [
            {name: 'Orden de compra', href: '/purchase-orders'},
            {name: 'Orden de servicio', href: '/'},
            {name: 'Orden de transferencia', href: '/'},
        ]
    },
    {
        name: 'Gastos', icon: CreditCard, links: [
            {name: 'Pendientes', href: '/expenses'},
            {name: 'Historico', href: '/'},
        ]
    },
    {
        name: 'Ingresos', icon: DollarSign, links: [
            {name: 'Pendientes', href: '/incomes'},
            {name: 'Historico', href: '/'},
        ]
    },
]

export function Sidebar() {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const [openModules, setOpenModules] = React.useState<string[]>([])

    const toggleModule = (moduleName: string) => {
        setOpenModules(prev =>
            prev.includes(moduleName)
                ? prev.filter(name => name !== moduleName)
                : [...prev, moduleName]
        )
    }

    return (
        <>
            <div
                className={`fixed left-0 top-0 h-full bg-background border-r transition-all duration-300 z-50 ${
                    isExpanded ? 'w-64 shadow-lg' : 'w-14'
                }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex justify-between items-center">
                        {isExpanded && <h2 className="font-semibold">Helper</h2>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={isExpanded ? 'ml-auto' : 'mx-auto'}
                        >
                            {isExpanded ? <ChevronLeft className="h-4 w-4"/> : <HamburgerMenuIcon className="h-4 w-4"/>}
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto">
                        {modules.map((module, index) => (
                            <Collapsible
                                key={index}
                                open={isExpanded && openModules.includes(module.name)}
                                onOpenChange={() => isExpanded && toggleModule(module.name)}
                            >
                                <div
                                    className="flex items-center p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => {
                                        if (!isExpanded) setIsExpanded(true)
                                        toggleModule(module.name)
                                    }}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-2"
                                    >
                                        <module.icon className="h-5 w-5"/>
                                    </Button>
                                    {isExpanded && (
                                        <>
                                            <span className="flex-1 text-sm">{module.name}</span>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost"
                                                        size="sm"
                                                        className="ml-auto"
                                                        onClick={() => {
                                                            if (!isExpanded) setIsExpanded(true)
                                                            toggleModule(module.name)
                                                        }}>
                                                    {openModules.includes(module.name) ? (
                                                        <ChevronUp className="h-4 w-4"/>
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4"/>
                                                    )}
                                                </Button>
                                            </CollapsibleTrigger>
                                        </>
                                    )}
                                </div>
                                {isExpanded && (
                                    <CollapsibleContent className="ml-9 space-y-1">
                                        {module.links.map((link, linkIndex) => (
                                            <Link
                                                key={linkIndex}
                                                href={link.href}
                                                className="block py-1 px-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                )}
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </>
    )
}
