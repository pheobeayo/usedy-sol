import CreateProfile from "../../components/CreateProfile";
import EditProfile from "../../components/EditProfile";
import profileBg from "../../assets/profile.png";
import { useAppKitAccount } from "@reown/appkit/react";
import { useProduct } from "../../context/ContextProvider";
import { formatSol } from "../../utils/priceUtils";

const CreateSellerProfile = () => {
  const { sellers } = useProduct();
  const { address } = useAppKitAccount();

  // Solana addresses are 44 chars; show first 8 + ellipsis
  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}…`;
  };

  // Derive a readable label from the userType enum object
  const getUserTypeLabel = (userType) => {
    if (!userType) return "—";
    if ("buyer" in userType) return "Buyer";
    if ("seller" in userType) return "Seller";
    if ("both" in userType) return "Buyer & Seller";
    return "—";
  };

  return (
    <main>
      {/* Hero */}
      <div className="flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-full text-white">
        <div className="lg:w-[60%] md:w-[60%] w-full p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy — Where environmental consciousness gets you rewarded
          </h2>
          <p>
            To get started listing your eco-friendly product, create a seller's
            profile.
          </p>
          <div className="mt-6">
            <CreateProfile />
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img
            src={profileBg}
            alt="dashboard"
            className="w-full lg:w-[60%] md:w-[60%]"
          />
        </div>
      </div>

      {/* All seller profiles */}
      <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold my-6">
        All Sellers&apos; Profiles
      </h2>

      <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 text-[#0F160F] flex-wrap">
        {sellers?.map((info) => (
          <div
            className="lg:w-[32%] md:w-[32%] w-full p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg"
            key={info.id}
          >
            <img
              src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg"
              alt=""
              className="w-[120px] h-[120px] rounded-full mx-auto"
            />

            <h3 className="font-bold lg:text-[20px] text-[18px] capitalize text-center mt-2">
              {info.name}
            </h3>

            {/* Role badge */}
            <div className="text-center my-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {getUserTypeLabel(info.userType)}
              </span>
            </div>

            <p className="flex justify-between my-4 truncate">
              Mail <span className="ml-2 truncate">{info.mail}</span>
            </p>
            <p className="flex justify-between my-4">
              Location <span>{info.location}</span>
            </p>

            {/* Solana: recycledCount = completed sales, totalWeight = kg sold */}
            <p className="flex justify-between my-4">
              Completed Sales <span>{info.recycledCount ?? 0}</span>
            </p>
            <p className="flex justify-between my-4">
              Total kg Sold <span>{info.totalWeight ?? 0} kg</span>
            </p>

            <p className="flex justify-between my-4">
              Wallet{" "}
              <span className="font-mono text-sm">
                {truncateAddress(info.address)}
              </span>
            </p>

            {/* totalPayout is stored in lamports (SOL) */}
            <p className="flex justify-between my-4 font-bold">
              Total Payout{" "}
              <span>{formatSol(info.totalPayout ?? 0)} SOL</span>
            </p>

            {/* Show edit button only to the profile owner */}
            {info.address &&
              address &&
              info.address.toLowerCase() === address.toLowerCase() && (
                <div className="mt-4">
                  <EditProfile />
                </div>
              )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default CreateSellerProfile;