"use client";

import HeaderLayout from "@/components/layouts/HeaderLayout";

export default function HeaderLayoutProvider(props: {
  children: React.ReactNode;
}) {
  return <HeaderLayout>{props?.children}</HeaderLayout>;
}
