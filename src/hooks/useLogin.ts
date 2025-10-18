// import { useMutation } from "@tanstack/react-query";

// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async ({ email, password }: { email: string; password: string }) => {
//       // Simple role-based login without API call or tokens
//       // Just return a mock response with role information
      
//       if (email === "admin@example.com" && password === "admin123") {
//         return { role: "admin", email: email };
//       }
      
//       if (email === "researcher@example.com" && password === "researcher123") {
//         return { role: "researcher", email: email };
//       }
      
//       // Default case - treat as researcher
//       if (email && password) {
//         return { role: "researcher", email: email };
//       }
      
//       throw new Error("Invalid credentials");
//     },
//   });
// };

import { useMutation } from "@tanstack/react-query";
import { ApiQueryClient } from "@/hooks/client/ApiQueryClient";

export const useLogin = () => {
  const apiQueryClient = new ApiQueryClient(
    import.meta.env.VITE_PUBLIC_API_URL
  );

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return apiQueryClient.useLogin(email, password);
    },
  });
};
