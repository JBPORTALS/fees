"use client";
import AddCouncelAddmissionModel from "@/components/modals/AddCouncelAdmissionModal";
import { Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AddCouncelAddmissionModel>
        {({ onOpen }) => (
          <Button colorScheme="blue" onClick={onOpen}>
            Add Enquery
          </Button>
        )}
      </AddCouncelAddmissionModel>
    </main>
  );
}
