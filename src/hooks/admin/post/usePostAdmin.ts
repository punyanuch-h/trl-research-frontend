import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BACKEND_HOST } from "@/constant/constants";

export interface PostAdminData {
  prefix: string;
  academic_position: string | null;
  first_name: string;
  last_name: string;
  department: string;
  phone_number: string;
  email: string;
  password: string;
}

export function usePostAdmin(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const postAdmin = async (data: PostAdminData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "สร้างบัญชีผู้ใช้ไม่สำเร็จ");
      }

      await queryClient.invalidateQueries({ queryKey: ["getAllAdmins"] });

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to create admin:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postAdmin, loading };
}
