"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";
import { useQuery } from "react-query";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  user: {
    email: string | undefined;
    last_login_at?: string;
    username?: string;
    session?: AuthSession | null;
    can_update_total?: boolean;
    college?: string;
  } | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const router = useRouter();

  async function getUserData() {
    const { data } = await supabase.auth.getSession();

    console.log("userid", data);
    const { data: User } = await supabase
      .from("profiles")
      .select("username,last_login_at,can_update_total,college")
      .eq("id", data.session?.user.id)
      .single();

    return {
      session: data.session,
      ...User,
      email: data.session?.user.email,
    };
  }

  const { data, refetch } = useQuery(["userData", supabase], getUserData);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
      refetch();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <Context.Provider value={{ supabase, user: data ?? null }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }

  return context;
};
