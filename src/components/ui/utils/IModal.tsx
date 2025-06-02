import {
  Button,
  ConditionalValue,
  Dialog,
  DialogBodyProps,
  DialogRootProps,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

interface IDrawerProps extends DialogRootProps {
  heading: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onClose: () => void;
  open: boolean;
  buttonTitle?: string;
  loading?: boolean;
  colorBtn?: "blue" | "red" | "orange";
  hideBtn?: boolean;
  disabled?: boolean;
  modalBodyProps?: DialogBodyProps;
}

export default function IModal({
  heading,
  size,
  children,
  buttonTitle,
  onSubmit,
  open,
  onClose,
  loading,
  colorBtn,
  hideBtn,
  disabled = false,
  modalBodyProps,
  ...props
}: IDrawerProps) {
  return (
    <Dialog.Root size={size} open={open} onOpenChange={onClose} {...props}>
      <Dialog.Backdrop
        bg={"rgba(255,255,255,0.2)"}
        className={"backdrop-blur-sm"}
      />
      <Dialog.Content className="w-fit min-h-fit h-fit">
        <Dialog.Header className="border-b border-lightgray">
          {heading}
        </Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body
          {...modalBodyProps}
          className="w-full h-fit bg-primary flex justify-center"
        >
          <div className="w-full h-full">{children}</div>
        </Dialog.Body>
        {!hideBtn && (
          <Dialog.Footer className="border-t border-lightgray">
            <Button
              disabled={loading}
              colorScheme="blue"
              variant={"outline"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              disabled={disabled}
              onClick={async () => {
                onSubmit && (await onSubmit());
              }}
              loading={loading}
              colorScheme={colorBtn || "blue"}
            >
              {buttonTitle || "Upload"}
            </Button>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
