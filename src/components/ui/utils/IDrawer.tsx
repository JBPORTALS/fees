import { Button, DrawerRootProps } from "@chakra-ui/react";
import React from "react";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "../drawer";

interface IDrawerProps extends DrawerRootProps {
  heading: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onClose: () => void;
  open: boolean;
  buttonTitle?: string;
  disabled?: boolean;
  loading?: boolean;
}

export default function IDrawer({
  heading,
  buttonTitle,
  children,
  loading,
  onSubmit,
  open,
  onClose,
  disabled,
  size,
}: IDrawerProps) {
  return (
    <DrawerRoot open={open} onOpenChange={onClose} size={size}>
      <DrawerContent>
        <DrawerHeader
          className="border-b bg-primary border-b-gray-300"
          py={"2"}
        >
          <DrawerTitle>{heading}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="px-0 bg-primary" px={"0"} py={"0"}>
          {children}
        </DrawerBody>
        <DrawerFooter
          py={"2"}
          className="flex space-x-4 bg-primary border-t border-t-gray-300"
        >
          <Button colorScheme={"blue"} variant={"outline"} onClick={onClose}>
            Cancel
          </Button>

          <Button
            loading={loading}
            disabled={disabled}
            colorScheme={"blue"}
            onClick={async () => {
              onSubmit && (await onSubmit());
            }}
          >
            {buttonTitle || "Save"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
}
