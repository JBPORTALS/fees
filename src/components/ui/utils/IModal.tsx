import {
  Button,
  Dialog,
  DialogBodyProps,
  DialogPositionerProps,
  DialogRootProps,
} from "@chakra-ui/react";
import React from "react";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "../dialog";

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
  contentProps?: React.ComponentProps<typeof DialogContent>;
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
  contentProps,
  ...props
}: IDrawerProps) {
  return (
    <DialogRoot size={size} open={open} onOpenChange={onClose} {...props}>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        <DialogBody {...modalBodyProps}>{children}</DialogBody>
        {!hideBtn && (
          <Dialog.Footer className="border-t border-lightgray">
            <Button
              disabled={loading}
              colorPalette="blue"
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
              colorPalette={colorBtn || "blue"}
            >
              {buttonTitle || "Upload"}
            </Button>
          </Dialog.Footer>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
