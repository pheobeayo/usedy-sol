import { useState } from "react";
import { Sling as Hamburger } from "hamburger-react";
import { CgHomeAlt } from "react-icons/cg";
import { BiBox } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbSettings } from "react-icons/tb";
import { ImCart } from "react-icons/im";
import { BsReceipt } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useProduct } from "../context/ContextProvider";
import logo from "../assets/logo.svg";
// formatUnits removed — see Sidebar.jsx for explanation

const MobileSidebar = () => {
  const [isOpen, setOpen] = useState(false);
  const { disconnect } = useDisconnect();
  const { address } = useAppKitAccount();
  const { userBal, refreshBalance } = useProduct();

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...`;
  };

  const handleRefreshBalance = () => refreshBalance?.();

  const displayBal = () => {
    if (!userBal) return "0";
    try {
      return typeof userBal.toNumber === "function"
        ? userBal.toNumber().toString()
        : userBal.toString();
    } catch {
      return "0";
    }
  };

  const activeStyle = {
    borderLeft: "1px solid #2A382A",
    borderRight: "1px solid #2A382A",
    width: "100%",
    padding: "20px",
  };

  return (
    <header className="lg:hidden md:hidden flex justify-between my-4 relative">
      <img src={logo} alt="" className="w-[150px] my-4" />
      <Hamburger toggled={isOpen} toggle={setOpen} color="#427142" direction="right" />

      {isOpen && (
        <div className="bg-[#DBECDB] text-[rgb(15,22,15)] p-8 py-12 h-[100vh] w-[100%] absolute top-20 left-0 z-50">
          {/* w3m-button → appkit-button */}
          <appkit-button />

          <div className="text-[14px] mb-6 px-4 mt-4">
            <p className="text-[14px] text-[#0F160F] items-center py-2 font-bold">
              Wallet Address: <br />
              <span className="text-[#154A80]">{truncateAddress(address)}</span>
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[#0F160F] font-bold">
                USEDY Balance:{" "}
                <span className="text-[#154A80]">{displayBal()} USEDY</span>
              </p>
              <button
                onClick={handleRefreshBalance}
                className="ml-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
                title="Refresh balance"
              >
                🔄
              </button>
            </div>
          </div>

          <NavLink to="/dashboard" className="text-[14px] text-[#0F160F] flex items-center py-4 my-4 px-4 hover:text-[#154A80]" style={({ isActive }) => (isActive ? activeStyle : null)} end>
            <CgHomeAlt className="mr-4" /> Dashboard
          </NavLink>
          <NavLink to="chat" className="text-[14px] text-[#0F160F] flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" style={({ isActive }) => (isActive ? activeStyle : null)}>
            <BiBox className="mr-4" /> Chat
          </NavLink>
          <NavLink to="createprofile" className="text-[14px] text-[#0F160F] flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" style={({ isActive }) => (isActive ? activeStyle : null)}>
            <IoIosAddCircleOutline className="mr-4" /> Create Profile
          </NavLink>
          <NavLink to="market_place" className="text-[14px] text-[#0F160F] flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" style={({ isActive }) => (isActive ? activeStyle : null)}>
            <ImCart className="mr-4" /> Marketplace
          </NavLink>
          <NavLink to="transactions" className="text-[14px] text-[#0F160F] flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" style={({ isActive }) => (isActive ? activeStyle : null)}>
            <BsReceipt className="mr-4" /> Transactions
          </NavLink>
          <button className="text-[14px] text-[#0F160F] flex items-center py-4 mb-4 px-6 hover:text-[#154A80]" onClick={disconnect}>
            <TbSettings className="mr-4" /> Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default MobileSidebar;