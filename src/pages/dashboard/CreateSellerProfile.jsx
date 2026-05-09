
import CreateProfile from "../../components/CreateProfile";
import profileBg from "../../assets/profile.png";
import { formatUnits } from "ethers";
import EditProfile from "../../components/EditProfile";
import { useAppKitAccount } from "@reown/appkit/react";
import { useProduct } from "../../context/ContextProvider";

const CreateSellerProfile = () => {
  const { sellers } = useProduct();
  const { address } = useAppKitAccount();

  const truncateAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 8);
    return `${start}...`;
  };

  const convertToWholeNumber = (formattedNumber) => {
    const number = parseFloat(formattedNumber);
    return Math.floor(number);
  };

  return (
    <main>
      <div className="flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white">
        <div className="lg:w-[60%] md:w-[60%] w-[100%] p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy - Where environmental consciousness gets you rewarded
          </h2>
          <p>
            To get started listing your eco friendly product, create a seller's
            profile.
          </p>
          <div className="mt-6">
            <CreateProfile />
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img
            src={profileBg}
            alt="dashboard"
            className="w-[100%] lg:w-[60%] md:w-[60%]"
          />
        </div>
      </div>
      <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold my-6">
        All Seller's Profile
      </h2>
      <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center my-10 text-[#0F160F] flex-wrap">
        {sellers?.map((info) => (
          <div
            className="lg:w-[32%] md:w-[32%] w-[100%] p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg"
            key={info.id}
          >
            <img
              src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg"
              alt=""
              className="w-[120px] h-[120px] rounded-full mx-auto"
            />
            <h3 className="font-bold lg:text-[20px] md:text-[20px] text-[18px] capitalize text-center">
              {info.name}
            </h3>
            <p className="flex justify-between my-4 truncate">
              Mail <span className="ml-2">{info.mail}</span>
            </p>
            <p className="flex justify-between my-4">
              Location <span>{info.location}</span>
            </p>
            <p className="flex justify-between my-4">
              Products <span>{info.product}</span>
            </p>
            <p className="flex justify-between my-4">
              Seller's wallet address:{" "}
              <span>{truncateAddress(info.address)}</span>
            </p>
            <p className="flex justify-between my-4 font-bold">
              Payment Total:{" "}
              <span>{formatUnits(info.payment)} U2U</span>
            </p>
            {info.address && address && info.address.toLowerCase() === address.toLowerCase() && (
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