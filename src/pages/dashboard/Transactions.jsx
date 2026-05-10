import { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import bgIcon from "../../assets/transaction.png";
import emptyCart from "../../assets/cart.png";
import ApprovePayment from "../../components/ApprovePayment";
import useGetPendingPayments from "../../hooks/useGetPendingPayments";
import { useGetApprovedPayments } from "../../hooks/useGetApprovedPayments"; 
import { useProduct } from "../../context/ContextProvider";
import { formatPrice } from "../../utils/priceUtils";

const Transactions = () => {
  const navigate = useNavigate();
  const { address } = useAppKitAccount();
  const { products, sellers } = useProduct();
  const {
    pendingPayments,
    loading: pendingLoading,
    refetchPendingPayments,
  } = useGetPendingPayments();
  const {
    approvedPayments,
    loading: approvedLoading,
    refetchApprovedPayments,
  } = useGetApprovedPayments();
  const [value, setValue] = useState("1");

  const userSeller = address
    ? sellers.find((s) => s?.address?.toLowerCase() === address.toLowerCase())
    : null;

  // pendingPayments / approvedPayments are arrays of product IDs (numbers)
  const pendingProducts = products.filter((p) =>
    pendingPayments.includes(p.id)
  );
  const approvedProducts = products.filter((p) =>
    approvedPayments.includes(p.id)
  );

  const handlePaymentApproved = () => {
    refetchPendingPayments();
    refetchApprovedPayments();
  };

  return (
    <main>
      {/* Hero banner */}
      <section className="flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-full text-white">
        <div className="lg:w-[60%] md:w-[60%] w-full p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy — Where environmental consciousness gets you rewarded
          </h2>
          <p>
            View all your eco-friendly product purchases in one place. Track
            your contributions to a greener planet with each sustainable product
            you buy.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/marketplace")}
              className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] font-bold text-[16px] lg:w-[50%] w-full my-2 hover:bg-[#C7D5D8]"
            >
              Buy Product
            </button>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-full bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img src={bgIcon} alt="dashboard" className="w-[70%] mx-auto" />
        </div>
      </section>

      {/* User identity */}
      <section>
        <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] font-[700] mt-4">
          Purchased Products
        </h2>
        <div className="flex mb-6 text-[#0F160F] items-center">
          <img
            src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg?t=st=1719630441~exp=1719634041~hmac=3d0adf83dadebd27f07e32abf8e0a5ed6929d940ed55342903cfc95e172f29b5&w=2000"
            alt=""
            className="w-[40px] h-[40px] rounded-full"
          />
          {userSeller ? (
            <p className="ml-4 font-bold">{userSeller.name}</p>
          ) : (
            <p className="ml-4">Unregistered.</p>
          )}
        </div>
      </section>

      {/* Tabs */}
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(_, v) => setValue(v)}
              aria-label="transaction tabs"
            >
              <Tab label="Pending Approval" value="1" />
              <Tab label="Approved Items" value="2" />
            </TabList>
          </Box>

          {/* ── Pending ── */}
          <TabPanel value="1">
            <section className="text-[#0F160F]">
              <h3 className="text-lg font-bold mb-4">
                Items Pending Payment Approval
              </h3>
              {pendingLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading pending payments…</p>
                </div>
              ) : pendingProducts.length === 0 ? (
                <div className="flex flex-col items-center w-full">
                  <img src={emptyCart} alt="" />
                  <p>No items pending approval</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {pendingProducts.map((product) => {
                    const { formatted, symbol } = formatPrice(
                      product.price,
                      product.paymentMode
                    );
                    // paymentMode string for the ApprovePayment button
                    const mode =
                      product.paymentMode && "spl" in product.paymentMode
                        ? "spl"
                        : "sol";
                    return (
                      <div
                        key={product.id}
                        className="border p-4 mb-4 rounded-lg shadow-md"
                      >
                        <img
                          src={
                            product.image ||
                            "https://cdn-icons-png.flaticon.com/512/3342/3342137.png"
                          }
                          alt={product.name}
                          className="w-full h-[200px] object-cover mb-4 rounded"
                        />
                        <p className="font-bold text-lg mb-2">
                          {product.name || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-2">
                          {product.location || "Unknown location"}
                        </p>
                        <p className="flex justify-between my-4 font-bold">
                          Price per kg:{" "}
                          <span>
                            {formatted} {symbol}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Status:{" "}
                          <span className="text-orange-600 font-semibold">
                            Pending Approval
                          </span>
                        </p>
                        {/* paymentMode passed so hook calls the right instruction */}
                        <ApprovePayment
                          productId={product.id}
                          paymentMode={mode}
                          onSuccess={handlePaymentApproved}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </TabPanel>

          {/* ── Approved ── */}
          <TabPanel value="2">
            <section className="text-[#0F160F]">
              <h3 className="text-lg font-bold mb-4">Approved Items</h3>
              {approvedLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading approved items…</p>
                </div>
              ) : approvedProducts.length === 0 ? (
                <div className="flex flex-col items-center w-full">
                  <img src={emptyCart} alt="" />
                  <p>No approved items yet</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {approvedProducts.map((product) => {
                    const { formatted, symbol } = formatPrice(
                      product.price,
                      product.paymentMode
                    );
                    return (
                      <div
                        key={product.id}
                        className="border p-4 mb-4 rounded-lg shadow-md"
                      >
                        <img
                          src={
                            product.image ||
                            "https://cdn-icons-png.flaticon.com/512/3342/3342137.png"
                          }
                          alt={product.name}
                          className="w-full h-[200px] object-cover mb-4 rounded"
                        />
                        <p className="font-bold text-lg mb-2">
                          {product.name || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-2">
                          {product.location || "Unknown location"}
                        </p>
                        <p className="flex justify-between my-4 font-bold">
                          Price per kg:{" "}
                          <span>
                            {formatted} {symbol}
                          </span>
                        </p>
                        <p className="text-sm mb-4">
                          Status:{" "}
                          <span className="text-green-600 font-semibold">
                            ✓ Payment Approved
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </TabPanel>
        </TabContext>
      </Box>
    </main>
  );
};

export default Transactions;