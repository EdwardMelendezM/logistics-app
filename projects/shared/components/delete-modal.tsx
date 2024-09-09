'use client'

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import useDeleteModal from "@/projects/shared/hooks/use-delete-modal";
import {Button} from "@/components/ui/button";

const DeleteModal = () => {
    const {isOpen, onDelete, onClose} = useDeleteModal();
    const handleDelete = () => {
        onDelete();
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar</DialogTitle>
                    <DialogDescription>
                        ¿Estás seguro de que deseas eliminar este recurso?
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button variant='ghost' onClick={onClose}>Cancelar</Button>
                    <Button variant='destructive' onClick={handleDelete} className="btn-danger">
                        Eliminar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteModal;
