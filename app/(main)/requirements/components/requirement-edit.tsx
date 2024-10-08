"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    createRequirementBody,
    Requirement
} from "@/projects/requirements/domain/requirements.entity";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TooltipFull from "@/components/tooltip-full";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = createRequirementBody

export type RequirementEditProps = {
    requirement: Requirement | null,
}

export function RequirementEdit({ requirement }: RequirementEditProps) {
    const formRequirementEdit = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            priority: "MEDIUM",
            details: []
        },
    })

    const router = useRouter()

    const isLoading = formRequirementEdit.formState.isSubmitting

    const { fields, append, remove, insert } = useFieldArray({
        control: formRequirementEdit.control,
        name: "details"
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (fields.length === 0) {
            toast.error('Debe agregar al menos un detalle')
            return
        }
        if (!requirement) {
            fetch('/api/v1/requirements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then(data => {
                    toast.success('Requerimiento agregado')
                    router.replace(`/requirements/${data.id}/edit`)
                })
                .catch(error => {
                    toast.error('Error agregando requerimiento')
                    const err = JSON.stringify(error)
                    console.error('There was an error!', err)
                })
        } else {
            fetch(`/api/v1/requirements/${requirement.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values)
            })
                .then(response => response.json())
                .then(data => {
                    toast.success('Requerimiento actualizado')
                    router.replace(`/requirements/${data.id}/edit`)
                })
                .catch(error => {
                    toast.error('Error actualizando requerimiento')
                    const err = JSON.stringify(error)
                    console.error('There was an error!', err)
                })
        }
    }

    const [
        ConfirmRemoveRequirementDetail,
        confirmRemoveRequirementDetail
    ] = useConfirm('Eliminar', '¿Estas seguro de eliminar este registro?')

    const onAddNewRequirementDetail = () => {
        append({
            description: "",
            quantity: "",
            id: null // Usa null o una cadena vacía para indicar que el ID no está definido
        });
    }

    const onRemoveRequirementDetail = async (index: number) => {
        const detail = formRequirementEdit.getValues().details[index]
        if (!detail.id) {
            remove(index)
            return
        }
        const ok = await confirmRemoveRequirementDetail()
        if (!ok) {
            return
        }
        remove(index)

    }

    useEffect(() => {
        if (requirement) {
            formRequirementEdit.reset(requirement)
            return
        }
        formRequirementEdit.reset()
        if (fields.length === 0) {
            append({
                description: "",
                quantity: "",
                id: null
            })
        }
    }, []);

    return (
        <>
            <Form {...formRequirementEdit} >
                <form onSubmit={formRequirementEdit.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold">
                            {requirement ? "Editar Requerimiento" : "Nuevo Requerimiento"}
                        </h1>
                        <Button type="submit"
                            variant='default'
                            disabled={isLoading}>
                            <Save size={15} />
                            <span className='pl-2'>Guardar</span>
                        </Button>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        <FormField
                            control={formRequirementEdit.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className='col-span-12 sm:col-span-10 '>
                                    <FormLabel>
                                        Descripcion
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isLoading}
                                            placeholder="Adquisicion de cemento" />
                                    </FormControl>
                                    <FormDescription>
                                        Descripcion de la necesidad
                                    </FormDescription>
                                    <FormMessage title='Descripcion es requerido' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={formRequirementEdit.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem className='col-span-12 sm:col-span-2'>
                                    <FormLabel>
                                        Prioridad
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HIGH">Alta</SelectItem>
                                                <SelectItem value="MEDIUM">Media</SelectItem>
                                                <SelectItem value="LOW">Baja</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Prioridad de la necesidad
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='text-end'>
                        <Button type="button"
                            size='sm'
                            variant='outline'
                            onClick={() => onAddNewRequirementDetail()}
                            disabled={isLoading}>
                            <Plus size={15} />
                            <span className='pl-2'>Agregar</span>
                        </Button>
                    </div>
                    <Table className='max-h-[50vh]'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px] text-center">Item</TableHead>
                                <TableHead className="text-center">Descripcion</TableHead>
                                <TableHead>Cantidad</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {/* Campo de Descripción */}
                                        <FormField
                                            control={formRequirementEdit.control}
                                            name={`details.${index}.description`} // Especifica el campo de descripción
                                            render={({ field }) => (
                                                <FormItem className="flex-1 flex flex-col">
                                                    <FormControl>
                                                        <Input {...field}
                                                            placeholder={`Descripcion ${index + 1}`}
                                                            disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/* Campo de Cantidad */}
                                        <FormField
                                            control={formRequirementEdit.control}
                                            name={`details.${index}.quantity`} // Especifica el campo de cantidad
                                            render={({ field }) => (
                                                <FormItem className="flex-1 flex flex-col">
                                                    <FormControl>
                                                        <Input {...field}
                                                            type="number"
                                                            placeholder="Cantidad"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <TooltipFull title='Eliminar'>
                                            <div className="flex flex-col space-y-4">
                                                <Button type="button"
                                                    variant="destructive"
                                                    onClick={() => onRemoveRequirementDetail(index)}
                                                    disabled={isLoading}>
                                                    <Trash size={14} />
                                                </Button>
                                            </div>
                                        </TooltipFull>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </form>
            </Form>
            <ConfirmRemoveRequirementDetail />
        </>
    )
}
