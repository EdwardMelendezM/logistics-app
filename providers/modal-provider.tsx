'use client'

import {useEffect, useState} from "react";
import DeleteModal from "@/projects/shared/components/delete-modal";

export default function ModalProvider() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <DeleteModal/>
    );

}
