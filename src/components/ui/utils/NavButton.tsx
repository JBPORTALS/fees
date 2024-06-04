import { Button, ButtonProps, ComponentWithAs } from "@chakra-ui/react";

interface NavButtonProps extends ButtonProps {}
interface NavButton extends ComponentWithAs<"button", NavButtonProps> {}

export const NavButton: NavButton = ({ ...props }) => {
  return (
    <Button
      colorScheme={props.isActive ? "twitter" : undefined}
      borderRadius={"full"}
      {...props}
    />
  );
};
