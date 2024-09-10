'use client'

import Link from "next/link"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Fragment, useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";

type BreadcrumbProps = {
    items: Array<{ label: string, href: string }>
}

export function BreadcrumbWithCustomSeparator({items}: BreadcrumbProps) {

    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={item.href || ''}>
                                        {item.label}
                                    </Link>
                                </BreadcrumbLink>
                                {/* Render separator only between items, not after the last item */}
                            </BreadcrumbItem>
                            {index < items.length - 1 && (
                                <BreadcrumbSeparator/>
                            )}
                        </Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <Separator className="mt-2 mb-3"/>
        </>
    )
}
