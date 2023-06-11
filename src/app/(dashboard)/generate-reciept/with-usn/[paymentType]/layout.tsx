"use client";

import WithUSNLayout from "@/components/layouts/WithUSNLayout copy";

export default async function GenerateRecieptRootLayout(props: {
  children: React.ReactNode;
}) {
  return <WithUSNLayout>{props?.children}</WithUSNLayout>;
}
