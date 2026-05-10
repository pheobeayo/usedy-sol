import { CgHomeAlt } from "react-icons/cg";
import { BiBox } from "react-icons/bi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { TbSettings } from "react-icons/tb";
import { ImCart } from "react-icons/im";
import { BsReceipt } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";
import logo from "../assets/whitelogo.svg";
import { useDisconnect } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useProduct } from "../context/ContextProvider";
// formatUnits removed — userBal is now a BN from Anchor, not an ethers BigInt
// useGetUsedyToken returns balanceUI (plain number) for direct display

const Sidebar = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAppKitAccount();
  const { userBal, refreshBalance } = useProduct();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isConnected && address && refreshBalance) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        refreshBalance();
      }, 30000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isConnected, address, refreshBalance]);

  const handleRefreshBalance = () => refreshBalance?.();

  const activeStyle = {
    borderLeft: "1px solid #FFFFFF",
    borderRight: "1px solid #FFFFFF",
    width: "100%",
    padding: "20px",
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...`;
  };

  // userBal is a BN — convert safely for display
  // useGetUsedyToken also exposes balanceUI (plain number) but userBal from
  // context is the raw BN. Convert here with toNumber() / toString().
  const displayBal = () => {
    if (!userBal) return "0";
    try {
      // BN from Anchor — divide by 10^decimals if needed, or just show raw
      // USEDY is minted as whole tokens (1 per action), so toNumber() is fine
      return typeof userBal.toNumber === "function"
        ? userBal.toNumber().toString()
        : userBal.toString();
    } catch {
      return "0";
    }
  };

  return (
    <div className="bg-[#263E59] text-white p-8 py-12 hidden h-full w-[100%] lg:flex md:flex flex-col overflow-y-auto no-scrollbar">
      <img src={logo} alt="logo" className="mb-10 w-[150px]" />

      <div className="text-[14px] mb-10 px-6">
        <p className="text-[14px] text-white items-center py-2 font-bold">
          Wallet Address: <br />
          <span>{truncateAddress(address)}</span>
        </p>
        <div className="flex items-center justify-between">
          <p>USEDY Balance: {displayBal()} USEDY</p>
          <button
            onClick={handleRefreshBalance}
            className="ml-2 text-xs opacity-70 hover:opacity-100 transition-opacity"
            title="Refresh balance"
          >
            🔄
          </button>
        </div>
      </div>

      <NavLink to="/dashboard" className="text-[14px] text-white flex items-center py-4 mb-4 px-6" style={({ isActive }) => (isActive ? activeStyle : null)} end>
        <CgHomeAlt className="mr-4" /> Dashboard
      </NavLink>
      <NavLink to="chat" className="text-[14px] text-white flex items-center py-4 mb-4 px-6" style={({ isActive }) => (isActive ? activeStyle : null)}>
        <BiBox className="mr-4" /> Chat
      </NavLink>
      <NavLink to="createprofile" className="text-[14px] text-white flex items-center py-4 mb-4 px-6" style={({ isActive }) => (isActive ? activeStyle : null)}>
        <IoIosAddCircleOutline className="mr-4" /> Create Profile
      </NavLink>
      <NavLink to="market_place" className="text-[14px] text-white flex items-center py-4 mb-4 px-6" style={({ isActive }) => (isActive ? activeStyle : null)}>
        <ImCart className="mr-4" /> Marketplace
      </NavLink>
      <NavLink to="transactions" className="text-[14px] text-white flex items-center py-4 mb-4 px-6" style={({ isActive }) => (isActive ? activeStyle : null)}>
        <BsReceipt className="mr-4" /> Transactions
      </NavLink>
      <button className="text-[14px] text-white flex items-center py-4 mb-4 px-6" onClick={disconnect}>
        <TbSettings className="mr-4" /> Log out
      </button>
    </div>
  );
};

export default Sidebar;