import has from 'lodash/has';
import { useMemo } from 'react';

export interface IBasePagination {
    pageSize: number,
    currentPage: number
    siblingCount?: number,
    configs?: any
}

export interface IAutoDeterminePaginationProps extends IBasePagination {
    totalPagesItemsSize: number
}

export interface IPredeterminePaginationProps extends IBasePagination {
    totalPages: number
}

export type IPagination = IAutoDeterminePaginationProps | IPredeterminePaginationProps

export const DOTS = '...';

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

const isPredeterminePagination = (props: IPagination): props is IPredeterminePaginationProps => has(props, "totalPages")

const getTotalPages = (props: IPagination): number => {
    if (isPredeterminePagination(props)) return props.totalPages
    const { totalPagesItemsSize, pageSize } = props
    return Math.ceil(totalPagesItemsSize / pageSize);
}

/**
 * @todo add next page, previous page data and handler
 * @param props you give totalPagesItemSize and let the hook determine the total pages for you, or manually define it by giving totalPages
 * @returns pageRanges, the list that contains page count and divider  
 */
export const usePaginator = (props: IPagination) => {
    const {
        pageSize,
        siblingCount = 1,
        currentPage
    } = props

    const totalPages = getTotalPages(props)

    const paginationRange = useMemo(() => {
        // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
        const totalPageNumbers = siblingCount + 5;

        /*
          If the number of pages is less than the page numbers we want to show in our
          paginationComponent, we return the range [1..totalPages]
        */
        if (totalPageNumbers >= totalPages) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPages
        );

        /*
          We do not want to show dots if there is only one position left 
          after/before the left/right page count as that would lead to a change if our Pagination
          component size which we do not want
        */
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);

            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(
                totalPages - rightItemCount + 1,
                totalPages
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }

        return []
    }, [totalPages, pageSize, siblingCount, currentPage]);

    return paginationRange;
};