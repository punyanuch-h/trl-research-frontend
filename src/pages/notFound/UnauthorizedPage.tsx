import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Unauthorized = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Error: The user attempted to access a path without permission :",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้</h1>
        <p className="text-xl text-gray-600 mb-4">หากต้องการเข้าถึง กรุณาติดต่อเจ้าหน้าที่ที่เกี่ยวข้อง</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          กลับสู่หน้าหลัก
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
