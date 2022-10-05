import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton, Button, ListItem, HStack } from "@chakra-ui/react";
import first from "lodash/first";
import last from "lodash/last";
import React from "react";
import {
  usePaginationRange,
  DOTS,
  IPaginationRange,
} from "../hooks/usePagination";

interface IPagination extends IPaginationRange {
  onPageChange: (nextPage: number) => void;
}

export const Pagination = (props: IPagination) => {
  const { onPageChange, currentPage } = props;

  const paginationRange = usePaginationRange(props);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = last(paginationRange);

  const firstPage = first(paginationRange);

  return (
    <HStack w="full" justifyContent="center" color="content.primary">
      <IconButton
        borderRadius="8px"
        bg="button.primary"
        aria-label="Previous"
        _hover={{
          bg: "button.hover",
        }}
        _focus={{
          bg: "button.focus",
        }}
        onClick={onPrevious}
        isDisabled={firstPage === currentPage}
        icon={<ChevronLeftIcon onClick={onPrevious} boxSize="1.25em" />}
      />

      {paginationRange.map((pageNumber) => {
        pageNumber === DOTS && <ListItem>.</ListItem>;
        return (
          <Button
            key={pageNumber}
            borderRadius="8px"
            bgColor={pageNumber === currentPage ? "button.focus" : "initial"}
            _hover={{
              bg: "button.hover",
            }}
            _active={{
              bg: "button.focus",
            }}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </Button>
        );
      })}

      <IconButton
        borderRadius="8px"
        bg="button.primary"
        aria-label="Previous"
        _hover={{
          bg: "button.hover",
        }}
        _focus={{
          bg: "button.focus",
        }}
        isDisabled={lastPage === currentPage}
        onClick={onNext}
        icon={<ChevronRightIcon onClick={onPrevious} boxSize="1.25em" />}
      />
    </HStack>
  );
};
