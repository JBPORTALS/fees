import {
  Button,
  ThemingProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ResponsiveValue,
  ModalProps,
  ModalBodyProps,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface IDrawerProps extends ModalProps {
  heading: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onClose: () => void;
  isOpen: boolean;
  buttonTitle?: string;
  size?: ResponsiveValue<"xl" | "full" | "2xl" | "3xl" | "6xl">;
  isLoading?: boolean;
  colorBtn?: "blue" | "red" | "orange";
  hideBtn?: boolean;
  isDisabled?: boolean;
  modalBodyProps?: ModalBodyProps;
}

export default function IModal({
  heading,
  size,
  children,
  buttonTitle,
  onSubmit,
  isOpen,
  onClose,
  isLoading,
  colorBtn,
  hideBtn,
  isDisabled = false,
  modalBodyProps,
  ...props
}: IDrawerProps) {
  return (
    <Modal size={size} isOpen={isOpen} onClose={onClose} {...props}>
      <ModalOverlay
        bg={"rgba(255,255,255,0.2)"}
        className={"backdrop-blur-sm"}
      />
      <ModalContent className="w-fit min-h-fit h-fit">
        <ModalHeader className="border-b border-lightgray">
          {heading}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          {...modalBodyProps}
          className="w-full h-fit bg-primary flex justify-center"
        >
          <div className="w-full h-full">{children}</div>
        </ModalBody>
        {!hideBtn && (
          <ModalFooter className="border-t border-lightgray">
            <Button
              isDisabled={isLoading}
              colorScheme="blue"
              variant={"outline"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              isDisabled={isDisabled}
              onClick={async () => {
                onSubmit && (await onSubmit());
              }}
              isLoading={isLoading}
              colorScheme={colorBtn || "blue"}
            >
              {buttonTitle || "Upload"}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
