import {
  Box,
  CloseButton,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { ShoppingBagIcon } from "../../public/icons/ShoppingBagIcon";
import { usePokemonCartStore } from "../../stores/cart";
import { MiniCartTotal } from "./ChakraButtonRef";
import { MiniCartLineItems } from "./MiniCartLineItems";
import { useItemQuantityCounter } from "./useItemsQuantityCounter";

type ChakraButtonRef = React.MutableRefObject<HTMLButtonElement | null>;

export const MiniCart: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>() as ChakraButtonRef;
  const clearAll = usePokemonCartStore((state) => state.clearAllItems);
  const clearIntermediateQuantity = useItemQuantityCounter(
    (state) => state.clearAll
  );
  return (
    <>
      <IconButton
        bg="button.secondary"
        ref={btnRef}
        onClick={onOpen}
        aria-label="Cart"
        borderRadius="8px"
        _hover={{
          boxShadow: "0px 8px 24px rgba(234, 124, 105, 0.32)",
        }}
        icon={
          <ShoppingBagIcon
            color="button.secondary"
            boxSize="1em"
            viewBox="0 0 14 14"
          />
        }
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="sm"
      >
        <DrawerOverlay bg="bg.overlay" />
        <DrawerContent bg="bg.secondary">
          <DrawerCloseButton />
          <DrawerHeader color="content.primary">
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="26px" fontWeight="600" color="content.primary">
                  Cart
                </Text>
                <Text
                  fontSize="12px"
                  fontWeight="400"
                  color="content.secondary"
                  _hover={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    clearAll({ onSuccess: clearIntermediateQuantity })
                  }
                >
                  clear all
                </Text>
              </Box>
              <IconButton
                onClick={onClose}
                bg="button.secondary"
                _hover={{
                  boxShadow: "0px 8px 24px rgba(234, 124, 105, 0.32)",
                }}
                aria-label="Close Cart"
                icon={<CloseButton />}
              />
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <MiniCartLineItems />
          </DrawerBody>

          <DrawerFooter>
            <MiniCartTotal />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
