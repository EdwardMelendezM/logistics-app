import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type TooltipFullProps = {
    title: string;
    children: React.ReactNode;
}

export const TooltipFull = ({children, title}: TooltipFullProps) => {
    return (
        <TooltipProvider delayDuration={100} skipDelayDuration={100} disableHoverableContent={true}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    {title}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipFull
