import type { NextPage, GetServerSideProps } from "next";
import {
  Box,
  Button,
  color,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

const Home = () => {
  // const pokemon = await axios.get(
  //   `https://api.hubapi.com/crm/v3/objects/tickets/${ticketId}`,
  //   {
  //     params: {
  //       hapikey: process.env.HUBSPOT_API_KEY,
  //     },
  //   }
  // );
  return (
    <Flex
      bg="bg.primary"
      h="100vh"
      w="100vw"
      justifyContent="center"
      px="123px"
    >
      <Stack w="100%" padding="30px" spacing="24px">
        {/* Main */}
        <Flex w="100%" justifyContent="space-between">
          <Heading color="content.primary">Pokemon market</Heading>
          <HStack>
            <Input w="" placeholder="Search by name" />
            <Button bg="bg.button">Cart</Button>
          </HStack>
        </Flex>

        <Divider color="border.divider" />

        {/* filter */}
        <Flex w="100%" justifyContent="space-between" alignItems="center">
          <Text color="content.primary">Choose Card</Text>
          <HStack spacing="16px">
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Set"
            />
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Rarity"
            />
            <Select
              minW="max-content"
              color="content.primary"
              placeholder="Type"
            />
          </HStack>
        </Flex>

        {/* Product card list */}
        <Flex></Flex>
      </Stack>
    </Flex>
  );
};

export default Home;
