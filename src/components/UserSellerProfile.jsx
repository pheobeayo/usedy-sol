import { useState, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { Link } from "react-router-dom";
import { useProduct } from "../context/ContextProvider";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { formatPrice } from "../utils/priceUtils";
import emptyCart from "../assets/cart.png";

const UserSellerProfile = () => {
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(true);
  const { sellers, products } = useProduct();

  useEffect(() => {
    if (products.length > 0 || sellers.length > 0) {
      setIsLoading(false);
    }
  }, [products, sellers]);

  const userSeller = sellers.find(
    (s) => s?.address?.toLowerCase() === address?.toLowerCase()
  );
  const userProducts = products.filter(
    (p) => p?.address?.toLowerCase() === address?.toLowerCase()
  );

  return (
    <div>
      <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] font-[700] mt-2">
        Listed Products
      </h2>

      <div className="flex mb-6 text-[#0F160F] items-center">
        <img
          src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg"
          alt=""
          className="w-[40px] h-[40px] rounded-full"
        />
        {userSeller ? (
          <p className="ml-4 font-bold">{userSeller.name}</p>
        ) : (
          <p className="ml-4">Unregistered.</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row justify-between flex-wrap md:flex-row">
        {isLoading ? (
          <LoadingSpinner />
        ) : userProducts.length === 0 ? (
          <div className="flex flex-col items-center w-full text-[#0F160F]">
            <img src={emptyCart} alt="" className="w-[300px] h-[300px]" />
            <h2 className="text-[18px] lg:text-[24px] mb-4 text-center">
              No Products yet!
            </h2>
          </div>
        ) : (
          userProducts.map((info, index) => {
            const { formatted, symbol } = formatPrice(info.price, info.paymentMode);
            return (
              <div
                key={index}
                className="w-full lg:w-[31%] md:w-[31%] rounded-lg border border-[#154A80] bg-white p-4 mt-6"
              >
                <Link to={`/dashboard/market_place/${info.id}`} className="text-[#0F160F]">
                  <img
                    src={info.image}
                    alt={info.name}
                    className="w-full h-[237px] object-cover object-center rounded-lg"
                  />
                  <h3 className="font-bold mt-4 lg:text-[20px] text-[18px] capitalize">
                    {info.name}
                  </h3>
                  <p className="flex justify-between my-4">
                    Quantity <span>{info.weight}</span>
                  </p>
                  <p className="flex justify-between my-4">
                    Seller&apos;s location <span>{info.location}</span>
                  </p>
                  <p className="flex justify-between my-4 font-bold">
                    Price{" "}
                    <span>
                      {formatted} {symbol}
                    </span>
                  </p>
                  <button className="my-4 border w-full py-2 px-4 border-[#154A80] text-[#0C3B45] rounded-lg">
                    View details
                  </button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserSellerProfile;