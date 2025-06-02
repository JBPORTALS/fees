import { Heading, HStack, NativeSelect, Select, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface ISelectProps {
  options: { value: string; option: string }[];
  value?: string;
  onChange: (value: string | undefined) => void;
  placeHolder: string;
  loading?: boolean;
}

export default function ISelect({
  options,
  onChange,
  placeHolder,
  value,
  loading,
}: ISelectProps) {
  const [currentValue, setCurrentValue] = useState<string | undefined>(value);

  useEffect(() => {
    onChange(currentValue);
  }, [currentValue, value]);

  return (
    <VStack
      p={0}
      px={0}
      className="bg-primary w-52 relative flex flex-col px-10"
    >
      <NativeSelect.Root
        bg={"white"}
        
        size={"sm"}
        shadow={"md"}
      >
        <NativeSelect.Field onChange={(e) => setCurrentValue(e.target.value)}>

        <option value={""}>{placeHolder}</option>
        {options.map((value) => {
          return (
            <option key={value.value} value={value.value}>
              {value.option}
            </option>
          );
        })}
        </NativeSelect.Field>
      </Native>
    </VStack>
  );
}


