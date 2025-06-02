import { Center, EmptyState, VStack } from "@chakra-ui/react";
import { LuPointer } from "react-icons/lu";

export const InfoCard = ({ message }: { message: string }) => {
  return (
    <Center h={"full"} pb={"24"}>
      <EmptyState.Root>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <LuPointer />
          </EmptyState.Indicator>
          <VStack textAlign={"center"}>
            <EmptyState.Title>{message}</EmptyState.Title>
            <EmptyState.Description>
              Select an option on the top section
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Center>
  );
};
