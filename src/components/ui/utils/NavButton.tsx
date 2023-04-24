import { ComponentProps } from "react";
import { cva, VariantProps } from "class-variance-authority";
import Icon, { IconNameProps } from "./Icon";
import Link from "next/link";

const ButtonStyles = cva("p-2 text-lg rounded-md w-full flex items-center", {
  variants: {
    variant: {
      active: "bg-brandLight text-gray-800 font-medium",
      default:
        "hover:cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-brandLight hover:opacity-85",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface props
  extends ComponentProps<"div">,
    VariantProps<typeof ButtonStyles> {
  isLoading?: boolean;
  IconName: IconNameProps;
  path?: string;
}

export default function NavButton({
  children,
  className,
  variant,
  isLoading,
  IconName,
  path,
  ...props
}: props) {
  return (
    <Link href={path || "#"}>
      <div className={ButtonStyles({ variant, className })} {...props}>
        <div className={"flex space-x-2  items-center"}>
          <Icon IconName={IconName} />
          <span className="capitalize  text-[16px] whitespace-nowrap">{IconName}</span>
        </div>
      </div>
    </Link>
  );
}
