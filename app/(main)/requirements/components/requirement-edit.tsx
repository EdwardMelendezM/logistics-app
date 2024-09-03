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
import {createRequirementBody, Requirement} from "@/projects/requirements/domain/requirements.entity";
import {useEffect} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const formSchema = createRequirementBody

export type RequirementEditProps = {
    requirement: Requirement | null
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

    const { fields, append, remove } = useFieldArray({
        control: formRequirementEdit.control,
        name: "details",
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
    }

    useEffect(() => {
        if (requirement) {
            formRequirementEdit.reset(requirement)
        }
    }, []);

    return (
        <>
            <h1 className="text-xl">Agregar requerimiento</h1>
            <Form {...formRequirementEdit}>
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
                                            <SelectValue placeholder="Alta"/>
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
                        <FormLabel>Detalles</FormLabel>
                        {fields.map((item, index) => (
                            <FormField
                                key={item.id}
                                control={formRequirementEdit.control}
                                name={`details.${index}`}
                                render={({field}) => (
                                    <FormItem className="flex items-center space-x-4">
                                        <FormControl className="flex-1">
                                            <Input placeholder={`Detalle ${index + 1}`} {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => remove(index)}
                                        >
                                            Eliminar
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            onClick={() => append("")}
                        >
                            Añadir Detalle
                        </Button>
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}
