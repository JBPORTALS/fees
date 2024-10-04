import React from "react";
import { trpc } from "./trpc-cleint";

export function useUser() {
  const [userId, setUserId] = React.useState(undefined);
  const user = trpc.getUser.useQuery(userId ?? "", { enabled: !!userId });

  const setUser = React.useCallback(async () => {
    // Fetch session
    const sessionResponse = await fetch(`/api/session`, {
      credentials: "include",
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session fetch failed: ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();

    if (!sessionData || !sessionData.id) {
      throw new Error("Invalid session data");
    }

    setUserId(sessionData.id);
  }, []);

  React.useEffect(() => {
    setUser();
  }, []);
  return user.data ?? null;
}

export function useSignIn() {
  const [userId, setUserId] = React.useState(undefined);
  const user = trpc.getUser.useQuery(userId ?? "", { enabled: !!userId });
  const { mutateAsync } = trpc.signIn.useMutation({
    async onSuccess(data) {
      await fetch("/api/session", {
        body: JSON.stringify({ id: data.id }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });

  const setUser = React.useCallback(async () => {
    // Fetch session
    const sessionResponse = await fetch(`/api/session`, {
      credentials: "include",
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session fetch failed: ${sessionResponse.statusText}`);
    }

    const sessionData = await sessionResponse.json();

    console.log("Session Data", sessionData);

    setUserId(sessionData.id);
  }, []);

  React.useEffect(() => {
    setUser();
  }, []);

  return {
    isLoggedIn: !!user.data,
    signIn: mutateAsync,
  };
}
