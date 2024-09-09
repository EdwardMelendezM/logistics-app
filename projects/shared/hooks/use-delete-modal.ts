import { create } from 'zustand';

interface ModalState {
    isOpen: boolean;
    id: number | null;
    onDelete: () => void;
    openModal: (id: number, onDelete: () => void) => void;
    onClose: () => void;
}

const useDeleteModal = create<ModalState>((set) => ({
    isOpen: false,
    id: null,
    onDelete: () => {},
    openModal: (id: number, onDelete: () => void) => set({ isOpen: true, id, onDelete }),
    onClose: () => set({ isOpen: false, id: null, onDelete: () => {} })
}));

export default useDeleteModal;
