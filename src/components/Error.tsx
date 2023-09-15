import { Center } from "@chakra-ui/react";
import React from "react";

type ErrorProps = {
  msg: string;
};

export default function Error({ msg }: ErrorProps) {
  return (
    <Center bg="red" h="100px" color="white">
      {msg}
    </Center>
  );
}
