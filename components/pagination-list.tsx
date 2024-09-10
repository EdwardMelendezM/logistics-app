'use client'

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {PaginationResults} from "@/projects/shared/results/domain/resullts.entity";
import {useRouter, useSearchParams} from "next/navigation";
import qs from "query-string";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type PaginationListProps = {
    paginationResult: PaginationResults;
    path: string;
};

export function PaginationList({paginationResult, path}: PaginationListProps) {
    const router = useRouter();
    const params = useSearchParams();

    const {total, page, sizePage} = paginationResult;
    const totalPages = Math.ceil(total / sizePage);

    const onChangePage = (newPage: number) => {
        const search = params.get('search') ?? '';
        const url = qs.stringifyUrl({
            url: path,
            query: {
                page: newPage,
                sizePage: sizePage,
                search: search
            }
        }, {skipEmptyString: true, skipNull: true});
        router.push(url);
    };

    const onChangeSizePage = (newSizePage) => {
        const search = params.get('search') ?? '';
        const url = qs.stringifyUrl({
            url: path,
            query: {
                page: page,
                sizePage: newSizePage,
                search: search
            }
        }, {skipEmptyString: true, skipNull: true});
        router.push(url);
    };

    // Determine the range of pages to display
    const pagesToShow = 3; // Number of page links to show around the current page
    const startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    return (
        <div className="flex flex-col sm:flex-row">
            <div className="relative">
                <span className="absolute text-sm text-gray-500 top-2 right-8">Items</span>
                <Select value={`${sizePage}`} onValueChange={(e) => onChangeSizePage(e)}>
                    <SelectTrigger className="w-[110px]">
                        <SelectValue defaultValue={'10'}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="200">200</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-grow text-sm text-gray-500 text-center flex-1">
                Total {total} registros
            </div>
            <Pagination className='mx-1 max-w-[400px]'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) {
                                    onChangePage(page - 1);
                                }
                            }}
                            disabled={page === 1}
                        />
                    </PaginationItem>

                    {/* Show first page link if necessary */}
                    {startPage > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    size='sm'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChangePage(1);
                                    }}
                                >
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            {startPage > 2 && <PaginationItem><PaginationEllipsis/></PaginationItem>}
                        </>
                    )}

                    {/* Show page links */}
                    {Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i).map(p => (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onChangePage(p);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    {/* Show last page link if necessary */}
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <PaginationItem><PaginationEllipsis/></PaginationItem>}
                            <PaginationItem>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChangePage(totalPages);
                                    }}
                                >
                                    {totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) {
                                    onChangePage(page + 1);
                                }
                            }}
                            disabled={page === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>


        </div>
    );
}
