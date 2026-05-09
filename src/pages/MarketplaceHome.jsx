import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import useMediaQuery from "@mui/material/useMediaQuery";
import useGetProduct from "../hooks/useGetProduct";
import LoadingSpinner from "../components/Loader/LoadingSpinner";
import { formatPrice } from "../utils/priceUtils";

const MarketplaceHome = () => {
  const { product, loading } = useGetProduct();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const itemsPerPage = isMobile ? 2 : 6;

  useEffect(() => {
    // Stop spinner once the fetch resolves (even if empty)
    if (!loading) setIsLoading(false);
  }, [loading]);

  const handlePageChange = (_, value) => setCurrentPage(value);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = product.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="lg:w-[90%] md:w-[90%] w-full mx-auto py-12 px-4 lg:px-0 md:px-0">
      {isLoading ? (
        <div className="text-black flex items-center gap-2">
          <LoadingSpinner /> Loading…
        </div>
      ) : product.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No products listed yet.</p>
      ) : (
        <>
          <div className="flex lg:flex-row md:flex-row flex-col justify-between items-center flex-wrap">
            {displayedProducts.map((info) => {
              const { formatted, symbol } = formatPrice(info.price, info.paymentMode);
              return (
                <div
                  className="lg:w-[32%] md:w-[32%] w-full p-4 border border-[#0F160F]/20 rounded-lg mb-4 shadow-lg"
                  key={info.id}
                >
                  <Link to={`/marketplace/${info.id}`} className="text-[#0F160F]">
                    <img
                      src={info.image}
                      alt={info.name}
                      className="w-full h-[237px] object-cover object-center rounded-lg"
                    />
                    <h3 className="font-bold mt-4 lg:text-[20px] text-[18px] font-titiliumweb capitalize">
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
                    <button className="my-4 border w-full py-2 px-4 border-[#3F9AAE] bg-white text-[#3F9AAE] rounded-lg">
                      View details
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
          <Pagination
            count={Math.ceil(product.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            className="mt-4 flex justify-center"
          />
        </>
      )}
    </div>
  );
};

export default MarketplaceHome;