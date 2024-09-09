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

const formSchema = createRequirementBody

export type RequirementEditProps = {
    requirement: Requirement | null,
}

export function RequirementEdit({requirement}: RequirementEditProps) {
    // 1. Define your formRequirementEdit.
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
        name: "details",
    })

    function onSubmit(values: z.infer<typeof formRequirementEdit>) {
        // Send values to endpoint /api/v1/requirements
        fetch('/api/v1/requirements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values)
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => {
                const err = JSON.stringify(error)
                console.error('There was an error!', err)
            })
    }

    useEffect(() => {
        if (requirement) {
            formRequirementEdit.reset(requirement)
        }
    }, []);

    return (
        <>
            <h1 className="text-xl">Agregar requerimiento</h1>
            <Form {...formRequirementEdit} >
                <form onSubmit={formRequirementEdit.handleSubmit(onSubmit)} className="space-y-8">
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
                                        value={field.value}
                                        onValueChange={(value) => field.onChange(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue defaultValue={'high'}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="medium">Media</SelectItem>
                                            <SelectItem value="low">Baja</SelectItem>
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
                        <Button type="button" onClick={() => append({description: "", quantity: 1})}>
                            <Plus size={24}/>
                        </Button>
                    </div>
                    <Button type="submit" variant='default'>Guardar</Button>
                </form>
            </Form>
        </>
    )
}
