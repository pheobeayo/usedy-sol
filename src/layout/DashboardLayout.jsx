import { useCallback, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileSidebar from "../components/MobileSidebar";
import { useAppKitAccount } from "@reown/appkit/react";

const DashboardLayout = () => {
  const { isConnected } = useAppKitAccount();
  const navigate = useNavigate();

  const handleRedirect = useCallback(() => {
    if (isConnected) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect, isConnected]);

  return (
    <div>
      <div className="flex bg-white min-h-screen">
        <div className="h-[100vh] lg:w-[20%] md:w-[30%] overflow-y-scroll no-scrollbar max-h-[1300px]">
          <Sidebar />
        </div>
        <div className="px-6 w-full lg:w-[77%] md:w-[70%] lg:h-[100vh] md:h-[100vh] h-auto max-h-[982px] overflow-y-scroll no-scrollbar">
          <MobileSidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;