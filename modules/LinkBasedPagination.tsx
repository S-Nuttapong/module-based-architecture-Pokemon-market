import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton, Button, Text, HStack } from "@chakra-ui/react";
import { noop } from "lodash";
import first from "lodash/first";
import last from "lodash/last";
import Link from "next/link";
import React from "react";
import {
  usePaginationRange,
  DOTS,
  IPaginationRange,
} from "../hooks/usePagination";

interface IPagination extends IPaginationRange {
  onPageChange?: (pageNumber: number) => void;
}

/**
 * specialized pagination for cards page
 * @todo: extract and make it more general, should it gets used other pages
 * @returns
 */
export const LinkBasedPagination = (props: IPagination) => {
  const { onPageChange = noop, currentPage } = props;

  const paginationRange = usePaginationRange(props);

  // if (currentPage === 0 || paginationRange.length < 2) {
  //   return null;
  // }

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
      <Link passHref href={`./${Number(currentPage) - 1}`}>
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
      </Link>

      {paginationRange.map((pageNumber) => {
        if (pageNumber === DOTS) return <Text>{pageNumber}</Text>;
        return (
          <Link key={pageNumber} passHref href={`./${pageNumber}`}>
            <Button
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
          </Link>
        );
      })}

      <Link passHref href={`./${Number(currentPage) + 1}`}>
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
      </Link>
    </HStack>
  );
};
