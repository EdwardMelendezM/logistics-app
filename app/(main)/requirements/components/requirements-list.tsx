'use client'

import type { Requirement } from "@/projects/requirements/domain/requirements.entity";
import { PaginationResults } from "@/projects/shared/results/domain/resullts.entity";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";

import { Edit2, Menu, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { useRouter, useSearchParams } from "next/navigation";
import TooltipFull from "@/components/tooltip-full";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import qs from "query-string"
import { PaginationList } from "@/components/pagination-list";

export type RequirementListProps = {
    requirements: Requirement[];
    pagination: PaginationResults;
}

type RequirementFull = Requirement & {
    status: JSX.Element;
    priority: JSX.Element;
    created_at: string;
}

const RequirementStatuses = {
    NEW: <Badge variant="default">NUEVO</Badge>,
    PENDING: <Badge variant="secondary">PENDIENTE</Badge>,
    COMPLETED: <Badge variant="outline">COMPLETADO</Badge>,
}

const RequirementPriorities = {
    HIGH: <Badge className="bg-red-400">ALTA</Badge>,
    MEDIUM: <Badge className="bg-yellow-400">MEDIA</Badge>,
    LOW: <Badge className="bg-green-400">BAJA</Badge>,
}

export const RequirementsList = ({ requirements, pagination }: RequirementListProps) => {
    const [requirementsFull, setRequirementsFull] = useState<RequirementFull[]>([])

    const router = useRouter()
    const params = useSearchParams()

    const [ConfirmRemoveRequirement, confirmRemoveRequirement] = useConfirm(
        'Eliminar requerimiento',
        '¿Estas seguro de eliminar este requerimiento?')

    const onDeleteRequirement = async (id: string) => {
        const ok = await confirmRemoveRequirement()
        if (!ok) {
            return
        }
        fetch(`/api/v1/requirements/${id}`, {
            method: 'DELETE',
        }).then(() => {
            toast.success("Requerimiento eliminado");
            router.replace('/requirements')
        }).catch((error) => {
            toast.error("Error eliminando requerimiento");
            console.log('Error deleting requirement', error)
        })
    }

    const onFilter = (e: any) => {
        const value = e.target.value;
        const url = qs.stringifyUrl({
            url: '/requirements',
            query: {
                search: value || null,
                page: Number(params.get('page') ?? 1),
                sizePage: Number(params.get('sizePage') ?? 100)
            }
        }, { skipEmptyString: true, skipNull: true })
        router.push(url)
    }

    useEffect(() => {
        onFilter({ target: { value: params.get('search') } })

        setRequirementsFull(requirements.map(requirement => {
            return {
                ...requirement,
                // @ts-ignore
                status: RequirementStatuses[requirement.status],
                // @ts-ignore
                priority: RequirementPriorities[requirement.priority],
                created_at: format(requirement.created_at, 'dd-MM-yyyy')
            }
        }));
    }, [requirements]);
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 w-full">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            onChange={onFilter}
                            className="pl-10 py-1 border rounded w-full"
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                            <Search size={16} />
                        </span>
                    </div>
                </div>
                <Button variant="default"
                    size='sm'
                    className='flex items-center px-3'
                    onClick={() => router.push('/requirements/new')}>
                    <Plus size={15} />
                    <span className='pl-2'>Requerimiento</span>
                </Button>
            </div>
            <Table className='max-h-[50vh]'>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">Item</TableHead>
                        <TableHead className="text-center">Estado</TableHead>
                        <TableHead>Descripcion</TableHead>
                        <TableHead className="text-center">Detalles</TableHead>
                        <TableHead className="text-center">Prioridad</TableHead>
                        <TableHead className="text-center">Fecha</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requirementsFull.map((requirement, index) => (
                        <TableRow key={requirement.id + '-' + index}>
                            <TableCell className="font-medium text-center">
                                {(pagination.page - 1) * pagination.sizePage + index + 1}
                            </TableCell>
                            <TableCell className="text-center">
                                {requirement.status}
                            </TableCell>
                            <TableCell>{requirement.description}</TableCell>
                            <TableCell className="text-center">
                                {requirement.details.length ?? 0}
                            </TableCell>
                            <TableCell className="text-center">
                                {requirement.priority}
                            </TableCell>
                            <TableCell className="text-center">
                                {requirement.created_at.toString()}
                            </TableCell>
                            <TableCell className="text-center">
                                <TooltipFull title='Editar'>
                                    <Button
                                        variant="link"
                                        size='sm'
                                        className='text-green-400 px-2'
                                        onClick={() => router.push(`/requirements/${requirement.id}/edit`)}>
                                        <Edit2 size={15} />
                                    </Button>
                                </TooltipFull>
                                <TooltipFull title='Ver detalles'>
                                    <Button
                                        variant="link"
                                        size='sm'
                                        className='text-blue-400 px-2'
                                    >
                                        <Menu size={15} />
                                    </Button>
                                </TooltipFull>
                                <TooltipFull title='Eliminar'>
                                    <Button variant="link"
                                        size='sm'
                                        className='text-red-400 px-2'
                                        onClick={() => onDeleteRequirement(requirement.id)}>
                                        <Trash2 size={15} />
                                    </Button>
                                </TooltipFull>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaginationList paginationResult={pagination} path={'/requirements'} />
            <ConfirmRemoveRequirement />
        </>
    );
}

export default RequirementsList;
