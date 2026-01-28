import { useState } from "react";
import { BACKEND_HOST } from "@/constant/constants";

export interface PostResetPasswordData {
  email: string;
  old_password: string;
  new_password: string;
}

export function usePostResetPassword(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);

  const postResetPassword = async (data: PostResetPasswordData) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_HOST}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      }

      onSuccess();
    } catch (error) {
      console.error("❌ Failed to reset password:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { postResetPassword, loading };
}
