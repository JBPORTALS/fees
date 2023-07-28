"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AuthSession } from "@supabase/supabase-js";

type SupabaseContext = {
  supabase: SupabaseClient<any>;
  user: {
    email: string | undefined;
    last_login_at: string | undefined;
    username: string | undefined;
    session: AuthSession | null;
    can_update_total: boolean;
    college:string | undefined;
  } | null;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [user, setUser] = useState<{
    username: undefined | string;
    email: string | undefined;
    last_login_at: string | undefined;
    session: AuthSession | null;
    can_update_total: boolean;
    college: string | undefined;
  } | null>(null);
  const router = useRouter();

  async function getUserData() {
    const { data } = await supabase.auth.getSession();
    const { data: User } = await supabase
      .from("profiles")
      .select("username,last_login_at,can_update_total,college")
      .eq("id", data.session?.user.id)
      .single();
      console.log(User)
    setUser({
      username: User?.username,
      email: data.session?.user.email,
      last_login_at: User?.last_login_at,
      session: data.session,
      can_update_total: User?.can_update_total,
      college: User?.college,
    });
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
      getUserData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  useEffect(() => {
    getUserData();
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase, user }}>
      <>{children}</>
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
