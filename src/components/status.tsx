import { LuCheckCircle2, LuCircle, LuCircleDashed } from "react-icons/lu";
import { Student } from "./mock-data/students-meta";
import { Tooltip } from "./ui/tooltip";
import { Icon } from "@chakra-ui/react";

export function Status({ status }: { status: Student["status"] }) {
  const renderIcon = () => {
    switch (status) {
      case "FULLY PAID":
        return (
          <Icon color={"fg.success"} fontSize={"xl"}>
            <LuCheckCircle2 />
          </Icon>
        );

      case "NOT PAID":
        return (
          <Icon color={"fg.subtle"} fontSize={"xl"}>
            <LuCircleDashed />
          </Icon>
        );
      case "PARTIALLY PAID":
        return (
          <Icon color={"fg.warning"} fontSize={"xl"}>
            <LuCircle />
          </Icon>
        );

      default:
        return <div></div>;
    }
  };

  return (
    <Tooltip positioning={{ placement: "right" }} showArrow content={status}>
      {renderIcon()}
    </Tooltip>
  );
}
