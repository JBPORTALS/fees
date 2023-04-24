import { useAppDispatch } from "@/hooks";
import { setLogoutUser } from "@/store/auth.slice";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import AlertModal from "../modals/AlertModal";
import { IconNameProps } from "./utils/Icon";
import NavButton from "./utils/NavButton";

interface NavLinkProps {
  name: IconNameProps;
  path: string;
}

interface SideBarProps {
  isFor: string;
}

export default function SideBar({ isFor }: SideBarProps) {
  const dispatch = useAppDispatch();
  const adminNavLink: NavLinkProps[] = [
    {
      name: "home",
      path: "/admin/verified",
    },
    {
      name: "staffs",
      path: "/admin/verified/staffs",
    },
    {
      name: "students",
      path: "/admin/verified/students",
    },
    {
      name: "admissions",
      path: "/admin/verified/admissions",
    },
    {
      name: "fees",
      path: "/admin/verified/fees",
    },
    {
      name: "attendance",
      path: "/admin/verified/attendance",
    },
    {
      name: "marks",
      path: "#",
    },
    {
      name: "schedule",
      path: "/admin/verified/schedule",
    },
    {
      name: "time table",
      path: "/admin/verified/time-table",
    },
    {
      name: "circulars",
      path: "/admin/verified/circulars",
    },
    {
      name: "remarks",
      path: "/admin/verified/remarks",
    },
    {
      name: "feedback",
      path: "/admin/verified/feedback",
    },
  ];

  const coadminNavLinks: NavLinkProps[] = [
    {
      name: "home",
      path: "/coadmin/verified",
    },
    {
      name: "fees",
      path: "/coadmin/verified/fees",
    },
    {
      name: "attendance",
      path: "/coadmin/verified/attendance",
    },
    {
      name: "marks",
      path: "#",
    },
    {
      name: "schedule",
      path: "/coadmin/verified/schedule",
    }
  ];

  const staffNavLinks: NavLinkProps[] = [
    {
      name: "home",
      path: "/staff/verified",
    },
    {
      name: "attendance",
      path: "/staff/verified/attendance",
    },
    {
      name: "marks",
      path: "#",
    },
    {
      name: "submissions",
      path: "/staff/verified/submissions",
    },
    {
      name: "schedule",
      path: "/staff/verified/schedule",
    },
    {
      name: "time table",
      path: "/staff/verified/time-table",
    },
    {
      name: "circulars",
      path: "/staff/verified/circulars",
    },
    {
      name: "remarks",
      path: "/staff/verified/remarks",
    },
  ];

  const router = useRouter();
  return (
    <div className="px-3 w-[180px] h-[100vh] relative custom-scroll-sm overflow-y-scroll bg-primary border-r border-r-gray-200 py-3">
      <div className="h-[46px] backdrop-blur-sm flex items-center justify-center py-5 sticky top-0 left-0 w-full">
        <Image
          src={"/assets/iSmartLogo.png"}
          height={90}
          width={90}
          alt={"ismartlogo"}
        />
      </div>
      <div className="space-y-4 py-5 pl-3 text-ellipsis h-full w-full flex flex-col justify-start">
        {isFor == "admin" &&
          adminNavLink.map(({ name, path }) => {
            return (
              <NavButton
                variant={router.asPath === path ? "active" : "default"}
                path={path}
                IconName={name}
                key={name}
              />
            );
          })}
        {isFor == "coadmin" &&
          coadminNavLinks.map(({ name, path }) => {
            return (
              <NavButton
                variant={router.asPath === path ? "active" : "default"}
                path={path}
                IconName={name}
                key={name}
              />
            );
          })}
        {isFor == "staff" &&
          staffNavLinks.map(({ name, path }) => {
            return (
              <NavButton
                variant={router.asPath === path ? "active" : "default"}
                path={path}
                IconName={name}
                key={name}
              />
            );
          })}
        <AlertModal
          onSubmit={async () => await dispatch(setLogoutUser(isFor))}
          title="Logout"
          message="Are you sure, you want to logout ?"
        >
          {({ onOpen }) => <NavButton IconName={"logout"} onClick={onOpen} />}
        </AlertModal>
      </div>
    </div>
  );
}
