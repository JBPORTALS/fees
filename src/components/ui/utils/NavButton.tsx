import { Button, ButtonProps } from "@chakra-ui/react";

interface NavButtonProps extends ButtonProps {
  isActive: boolean;
}

export const NavButton = ({ ...props }: NavButtonProps) => {
  return (
    <Button
      colorScheme={props.isActive ? "facebook" : undefined}
      variant={"ghost"}
      {...props}
    />
  );
};
