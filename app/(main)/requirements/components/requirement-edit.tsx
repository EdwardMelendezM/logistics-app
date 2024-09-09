"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {
    createRequirementBody,
    Requirement
} from "@/projects/requirements/domain/requirements.entity";
import {useEffect} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Plus, Trash} from "lucide-react";
import {useRouter} from "next/navigation";

import {toast} from "sonner"

const formSchema = createRequirementBody

export type RequirementEditProps = {
    requirement: Requirement | null,
}

export function RequirementEdit({requirement}: RequirementEditProps) {

    const router = useRouter()

    const formRequirementEdit = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            status: "",
            priority: "",
            details: [],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control: formRequirementEdit.control,
        name: "details"
    })

    function onSubmit(values: z.infer<typeof formRequirementEdit>) {
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
                    router.replace(`/requirements/${data.id}`)
                })
                .catch(error => {
                    toast.error('Error agregando requerimiento')
                    const err = JSON.stringify(error)
                    console.error('There was an error!', err)
                })
        } else {
            console.log(values)
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
                    router.replace(`/requirements/${data.id}`)
                })
                .catch(error => {
                    toast.error('Error actualizando requerimiento')
                    const err = JSON.stringify(error)
                    console.error('There was an error!', err)
                })
        }

    }

    useEffect(() => {
        if (requirement) {
            formRequirementEdit.reset(requirement)
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
                        <Button type="submit" variant='default'>Guardar</Button>
                    </div>
                    <FormField
                        control={formRequirementEdit.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Descripcion
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Adquisicion de cemento" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Descripcion de la necesidad
                                </FormDescription>
                                <FormMessage title='Descripcion es requerido'/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={formRequirementEdit.control}
                        name="priority"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Prioridad
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value || "high"}
                                        onValueChange={(value) => field.onChange(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={'high'}/>
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div>
                        <div className="flex">
                            <FormLabel className="flex-1">Descripcion</FormLabel>
                            <FormLabel className="flex-1 pl-4">Cantidad</FormLabel>
                            <FormLabel className="pl-2">Acciones</FormLabel>
                        </div>
                        {fields.map((item, index) => (
                            <div key={item.id} className="flex space-x-4 space-y-1">
                                {/* Campo de Descripción */}
                                <FormField
                                    control={formRequirementEdit.control}
                                    name={`details.${index}.description`} // Especifica el campo de descripción
                                    render={({field}) => (
                                        <FormItem className="flex-1 flex flex-col">
                                            <FormControl>
                                                <Input placeholder={`Descripcion ${index + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {/* Campo de Cantidad */}
                                <FormField
                                    control={formRequirementEdit.control}
                                    name={`details.${index}.quantity`} // Especifica el campo de cantidad
                                    render={({field}) => (
                                        <FormItem className="flex-1 flex flex-col">
                                            <FormControl>
                                                <Input type="number" placeholder="Cantidad" {...field} />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col space-y-4">
                                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                        <Trash size={14}/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button type="button" onClick={() => append({description: "", quantity: '', id: null})}>
                            <Plus size={24}/>
                        </Button>
                        {
                            formRequirementEdit.formState.errors.details && (
                                <FormMessage title="Al menos un detalle es requerido"/>
                            )
                        }
                    </div>

                </form>
            </Form>
        </>
    )
}
