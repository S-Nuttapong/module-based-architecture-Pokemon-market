import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { usePokemonCartStore } from "../../stores/cart";
import { MiniCartTotal } from "./ChakraButtonRef";
import { MiniCartLineItems } from "./MiniCartLineItems";
import { useItemQuantityCounter } from "./useItemsQuantityCounter";

type ChakraButtonRef = React.MutableRefObject<HTMLButtonElement | null>;

export function MiniCart() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>() as ChakraButtonRef;
  const clearAll = usePokemonCartStore((state) => state.clearAllItems);
  const clearIntermediateQuantity = useItemQuantityCounter(
    (state) => state.clearAll
  );
  return (
    <>
      <Button
        bg="button.secondary"
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      >
        Cart
      </Button>
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
              {/* TODO: replace with close icon instead */}
              <Button onClick={onClose} bg="button.secondary">
                Close
              </Button>
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
}
