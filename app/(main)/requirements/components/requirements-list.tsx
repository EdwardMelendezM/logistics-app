'use client'

import type {Requirement} from "@/projects/requirements/domain/requirements.entity";
import {PaginationResults} from "@/projects/shared/results/domain/resullts.entity";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";

import {Edit2, Menu, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {useEffect, useState} from "react";

export type RequirementListProps = {
    requirements: Requirement[];
    pagination: PaginationResults;
}

const RequirementStatuses = {
    NEW: <Badge variant="default">NUEVO</Badge>,
    PENDING: <Badge variant="secondary">PENDIENTE</Badge>,
    COMPLETED: <Badge variant="outline">COMPLETADO</Badge>,
}
export const RequirementsList = ({requirements, pagination}: RequirementListProps) => {
    const [requirementsFull, setRequirementsFull] = useState<Requirement[]>([])
    useEffect(() => {
        setRequirementsFull({
            ...requirements.map(requirement => {
                return {
                    ...requirement,
                    status: RequirementStatuses[requirement.status],
                    created_at: new Date(requirement.created_at).toLocaleDateString()
                }
            })
        })
    }, []);
    return (
        <Table>
            <TableCaption>Lista de requerimientos.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px] text-center">Item</TableHead>
                    <TableHead>Descripcion</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Detalles</TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requirementsFull.map((requirement, index) => (
                    <TableRow key={requirement.id}>
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell>{requirement.description}</TableCell>
                        <TableCell className="text-center">
                            {RequirementStatuses[requirement.status]}
                        </TableCell>
                        <TableCell className="text-center">
                            {requirement.details.length ?? 0}
                        </TableCell>
                        <TableCell className="text-center">
                            {requirement.created_at.toString()}
                        </TableCell>
                        <TableCell className="text-center">
                            <Button variant="primary" className='text-green-400 px-2'>
                                <Edit2 size={15}/>
                            </Button>
                            <Button variant="primary" className='text-blue-400 px-2'>
                                <Menu size={15}/>
                            </Button>
                            <Button variant="primary" className='text-red-400 px-2'>
                                <Trash2 size={15}/>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default RequirementsList;
