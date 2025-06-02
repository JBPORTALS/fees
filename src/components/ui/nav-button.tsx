import { Button, ButtonProps } from "@chakra-ui/react";

interface NavButtonProps extends ButtonProps {
  isActive: boolean;
}

export const NavButton = ({ ...props }: NavButtonProps) => {
  return (
    <Button
      justifyContent={"start"}
      color={!props.isActive ? "fg.muted" : "colorPalette.fg"}
      _hover={{
        background: !props.isActive ? "bg.muted" : "colorPalette.subtle",
      }}
      variant={props.isActive ? "surface" : "ghost"}
      {...props}
    />
  );
};
