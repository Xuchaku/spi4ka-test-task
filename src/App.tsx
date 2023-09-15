import {
  Box,
  Center,
  FormControl,
  Text,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Stack,
} from "@chakra-ui/react";

import { getValutes } from "./api";
import { DEFAULT_VALUTE, RATES_API } from "./consts";
import Error from "./components/Error";

import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import fx from "money";

function App() {
  const valuteFromStorage = localStorage.getItem("valute");
  const [valute, setValute] = useState<string>(
    valuteFromStorage || DEFAULT_VALUTE
  );
  const [inputNumber, setInputNumber] = useState<number>(0);

  const {
    data: valutes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["valutes", RATES_API],
    queryFn: () => getValutes(RATES_API),
    refetchOnWindowFocus: true,
    select: (valutesObj) => valutesObj.rates,
  });

  function changeValute(event: ChangeEvent<HTMLSelectElement>) {
    setValute(event.target.value);
  }
  function changeInputNumber(event: ChangeEvent<HTMLInputElement>) {
    setInputNumber(Number(event.target.value));
  }

  useEffect(() => {
    fx.base = DEFAULT_VALUTE;
    fx.rates = valutes;
  }, [valutes]);

  useEffect(() => {
    localStorage.setItem("valute", valute);
  }, [valute]);

  const resultValue = useMemo(() => {
    if (valute === DEFAULT_VALUTE) return inputNumber;
    else if (!fx.base) {
      return inputNumber;
    } else {
      return fx.convert(inputNumber, { from: valute, to: DEFAULT_VALUTE });
    }
  }, [valute, inputNumber]);

  if (isError) return <Error msg={"Не удалось загрузить курсы валют!"} />;

  return isLoading ? (
    <Center bg={"gray.300"} h="100vh">
      <Text as="i" fontSize={"4xl"}>
        Loading...
      </Text>
    </Center>
  ) : (
    <Center bg={"gray.300"} h="100vh">
      <Box p={4} bg={"white"} minW={"400px"}>
        <Stack spacing={4}>
          <Heading color={"gray.700"}>Конвертер валют</Heading>
          <FormControl>
            <Input
              type="number"
              placeholder="Введите сумму"
              onChange={changeInputNumber}
            />
          </FormControl>
          <Select
            value={valute}
            onChange={changeValute}
            color={"gray.700"}
            placeholder="Выберите валюту"
          >
            {valutes &&
              Object.keys(valutes).map((valute) => {
                return <option value={valute}>{valute}</option>;
              })}
          </Select>
          <InputGroup size="sm">
            <Input placeholder="" disabled={true} value={resultValue} />
            <InputRightAddon children="₽" color={"black"} />
          </InputGroup>
        </Stack>
      </Box>
    </Center>
  );
}

export default App;
