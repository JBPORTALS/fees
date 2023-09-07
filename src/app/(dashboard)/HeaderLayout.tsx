"use client";

import HeaderLayout from "@/components/layouts/HeaderLayout";
import { useAppDispatch } from "@/hooks";
import { fetchUser } from "@/store/fees.slice";
import { useEffect } from "react"

export default function HeaderLayoutProvider(props: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch]);

  return <HeaderLayout>{props?.children}</HeaderLayout>;
}
