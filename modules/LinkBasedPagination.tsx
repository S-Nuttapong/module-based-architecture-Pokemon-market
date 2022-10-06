import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { IconButton, Button, Text, HStack } from "@chakra-ui/react";
import { noop } from "lodash";
import first from "lodash/first";
import last from "lodash/last";
import Link from "next/link";
import React from "react";
import { LinkButton } from "../components/LinkButton";
import {
  usePaginator,
  DOTS,
  IPredeterminePaginationProps,
} from "../hooks/usePaginator";

interface IPagination extends IPredeterminePaginationProps {
  onPageChange?: (pageNumber: number) => void;
}

const buttonBaseStyles = {
  borderRadius: "8px",
  bg: "button.primary",
  _hover: { bg: "button.hover" },
  _focus: { bg: "button.focus" },
};
/**
 * specialized pagination for cards page
 * @todo: extract and make it more general, should it gets used other pages
 * @returns
 */
export const LinkBasedPagination = (props: IPagination) => {
  const { onPageChange = noop, currentPage } = props;

  const paginationRange = usePaginator(props);

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
      <LinkButton
        buttonType="iconButton"
        passHref
        href={`./${Number(currentPage) - 1}`}
        {...buttonBaseStyles}
        aria-label="Previous"
        onClick={onPrevious}
        isDisabled={firstPage === currentPage}
        icon={<ChevronLeftIcon onClick={onPrevious} boxSize="1.25em" />}
      />

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

      <LinkButton
        passHref
        href={`./${Number(currentPage) + 1}`}
        buttonType="iconButton"
        {...buttonBaseStyles}
        aria-label="Previous"
        isDisabled={lastPage === currentPage}
        onClick={onNext}
        icon={<ChevronRightIcon onClick={onPrevious} boxSize="1.25em" />}
      />
    </HStack>
  );
};
