import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const baseURL = import.meta.env.VITE_PUBLIC_API_URL ?? "http://localhost:3000";

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // expected shape: { token, expires_in }
      return res.json();
    },
  });
};