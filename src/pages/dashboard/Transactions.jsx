import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import bgIcon from "../../assets/transaction.png";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ContextProvider";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import emptyCart from "../../assets/cart.png";
import { formatUnits } from "ethers";
import ApprovePayment from "../../components/ApprovePayment";
import useGetPendingPayments from "../../hooks/useGetPendingPayments";
import useGetApprovedPayments from "../../hooks/useGetApprovedPayments";

const Transactions = () => {
  const navigate = useNavigate();
  const { address } = useAppKitAccount();
  const { products, sellers, purchaseId } = useProduct();
  const { pendingPayments, loading: pendingLoading, refetchPendingPayments } = useGetPendingPayments();
  const { approvedPayments, loading: approvedLoading, refetchApprovedPayments } = useGetApprovedPayments();
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const userSeller = address
    ? sellers.find(
        (data) => data?.address?.toLowerCase() === address.toLowerCase()
      )
    : null;

  // Get products that are pending approval
  const pendingProducts = products.filter(product => 
    pendingPayments.includes(product.id)
  );

  // Get products that have been approved
  const approvedProducts = products.filter(product => 
    approvedPayments.includes(product.id)
  );

  const handlePaymentApproved = () => {
    // Refresh both pending and approved payments lists
    refetchPendingPayments();
    refetchApprovedPayments();
  };

  return (
    <main>
      <section className="flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white">
        <div className="lg:w-[60%] md:w-[60%] w-[100%] p-8">
          <h2 className="lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4">
            Usedy - Where environmental consciousness gets you rewarded
          </h2>
          <p>
            View all your eco-friendly product purchases in one place. Track
            your contributions to a greener planet with each sustainable product
            you buy.
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard/marketplace")}
              className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:bg-[#C7D5D8] hover:font-bold"
            >
              Buy Product
            </button>
          </div>
        </div>
        <div className="lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center">
          <img src={bgIcon} alt="dashboard" className="w-[70%] mx-auto" />
        </div>
      </section>
      <section>
        <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-4">
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
            <p>Unregistered.</p>
          )}
        </div>
      </section>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Pending Approval" value="1" />
              <Tab label="Approved Items" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <section className="text-[#0F160F]">
              <h3 className="text-lg font-bold mb-4">Items Pending Payment Approval</h3>
              {pendingLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Loading pending payments...</p>
                </div>
              ) : pendingProducts?.length === 0 ? (
                <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
                  <img src={emptyCart} alt="" />
                  <p>No items pending approval</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="border p-4 mb-4 rounded-lg shadow-md">
                      <div>
                        <img
                          src={product?.image || "https://cdn-icons-png.flaticon.com/512/3342/3342137.png"}
                          alt={product?.name}
                          className="w-full h-[200px] object-cover mb-4 rounded"
                        />
                        <p className="font-bold text-lg mb-2">{product?.name || "N/A"}</p>
                        <p className="text-gray-600 mb-2">{product?.location || "Unknown location"}</p>
                        <p className="flex justify-between my-4 font-bold">
                          Price per kg: <span>{product?.price ? formatUnits(product.price) : "0.00"} U2U</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Status: <span className="text-orange-600 font-semibold">Pending Approval</span>
                        </p>
                        <ApprovePayment 
                          productId={product.id} 
                          onSuccess={handlePaymentApproved}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </TabPanel>
          <TabPanel value="2">
            <section className="text-[#0F160F]">
              <h3 className="text-lg font-bold mb-4">Approved Items</h3>
              {approvedLoading ? (
                <div className="flex justify-center items-center p-8">
                  <p>Loading approved items...</p>
                </div>
              ) : approvedProducts?.length === 0 ? (
                <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
                  <img src={emptyCart} alt="" />
                  <p>No approved items yet</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {approvedProducts.map((product) => (
                    <div key={product.id} className="border p-4 mb-4 rounded-lg shadow-md">
                      <div>
                        <img
                          src={product?.image || "https://cdn-icons-png.flaticon.com/512/3342/3342137.png"}
                          alt={product?.name}
                          className="w-full h-[200px] object-cover mb-4 rounded"
                        />
                        <p className="font-bold text-lg mb-2">{product?.name || "N/A"}</p>
                        <p className="text-gray-600 mb-2">{product?.location || "Unknown location"}</p>
                        <p className="flex justify-between my-4 font-bold">
                          Price per kg: <span>{product?.price ? formatUnits(product.price) : "0.00"} U2U</span>
                        </p>
                        <p className="text-sm mb-4">
                          Status: <span className="text-green-600 font-semibold">✓ Payment Approved</span>
                        </p>
                      </div>
                    </div>
                  ))}
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
