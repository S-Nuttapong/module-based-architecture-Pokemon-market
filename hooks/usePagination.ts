import { useMemo } from 'react';

export interface IPaginationRange {
    totalPages: number,
    pageSize: number,
    currentPage: number
    siblingCount?: number,
    configs?: any
}

const range = (start: number, end: number) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

export const DOTS = '...';

export const usePaginationRange = (props: IPaginationRange) => {
    const {
        totalPages,
        pageSize,
        siblingCount = 1,
        currentPage
    } = props

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