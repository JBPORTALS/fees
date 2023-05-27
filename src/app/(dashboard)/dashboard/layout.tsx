"use client";

import FeesLayout from "@/components/layouts/FeesLayout";

export default async function DashboardRootLayout(props: {
  children: React.ReactNode;
}) {
  return <FeesLayout>{props?.children}</FeesLayout>;
}
