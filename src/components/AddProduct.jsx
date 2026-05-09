import React, { useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { RiImageAddFill } from "react-icons/ri";
import { toast } from "react-toastify";
import useAddProduct from "../hooks/useAddProduct";
import usePinataUpload from "../hooks/usePinataUpload"; 
import LoadingSpinner from "./Loader/LoadingSpinner";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 440,
  borderRadius: 10,
  boxShadow: 24,
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  maxHeight: "90vh",
  overflowY: "auto",
  p: 4,
};

const EMPTY_TIER = { quantity: "", discountPercentage: "" };

const AddProduct = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleAdd = useAddProduct();
  const { uploadToPinata, isUploading } = usePinataUpload();


  const [imageUrl, setImageUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("sol"); 
  const [tiers, setTiers] = useState([]);               
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setImageUrl("");
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductWeight("");
    setPaymentMode("sol");
    setTiers([]);
    setImageError("");
  };

 
  const addTier = () => {
    if (tiers.length >= 5) {
      toast.warn("Maximum 5 negotiation tiers allowed");
      return;
    }
    setTiers((prev) => [...prev, { ...EMPTY_TIER }]);
  };

  const updateTier = (idx, field, value) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t))
    );
  };

  const removeTier = (idx) =>
    setTiers((prev) => prev.filter((_, i) => i !== idx));

 
  const handleListProduct = async () => {
    if (!productPrice || isNaN(Number(productPrice))) {
      toast.error("Enter a valid price");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert price: SOL → lamports, SPL → raw base units (assumed 6 decimals like USDC)
      let priceBN;
      if (paymentMode === "sol") {
        priceBN = new BN(Math.round(Number(productPrice) * LAMPORTS_PER_SOL));
      } else {
        // SPL / USDC: 6 decimals
        priceBN = new BN(Math.round(Number(productPrice) * 1_000_000));
      }

      const weightBN = new BN(Number(productWeight));

      const modeArg = paymentMode === "sol" ? { sol: {} } : { spl: {} };

      const validTiers = tiers
        .filter((t) => t.quantity && t.discountPercentage)
        .map((t) => ({
          quantity: new BN(Number(t.quantity)),
          discountPercentage: Number(t.discountPercentage),
        }));

      const txSig = await handleAdd(
        productName,
        imageUrl,
        productDesc,
        priceBN,
        weightBN,
        modeArg,
        validTiers
      );

      if (txSig) {
        resetForm();
        handleClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const convertIpfsUrl = (url) =>
    url.startsWith("ipfs://")
      ? url.replace("ipfs://", "https://ipfs.io/ipfs/")
      : url;

  const changeHandler = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > 1) {
      setImageError("File size exceeds 1 MB. Please choose a smaller file.");
      return;
    }
    setImageError("");
    try {
      const uploadedUrl = await uploadToPinata(file);
      setImageUrl(uploadedUrl);
    } catch {
      // usePinataUpload already toasts the error
    }
  };

 
  return (
    <div>
      <button
        className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-full lg:w-[50%] md:w-[50%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
        onClick={handleOpen}
      >
        Add New Product
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <p className="font-bold text-[24px] text-center font-titiliumweb my-6">
            List Product
          </p>

          {/* ── Image upload ── */}
          <label className="block mb-1 text-sm">
            Product Image (max 1 MB)
          </label>
          <div className="mb-4 w-full relative">
            {imageUrl ? (
              <div className="relative w-[150px] mx-auto h-26 border border-white/20 rounded-md overflow-hidden">
                <img
                  src={convertIpfsUrl(imageUrl)}
                  alt="Uploaded"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput").click()}
                  className="absolute bottom-0 right-0 bg-black/80 p-2 rounded-full hover:bg-black/70 transition"
                  title="Change image"
                >
                  <RiImageAddFill className="text-white text-xl" />
                </button>
              </div>
            ) : (
              <div
                className="w-[150px] my-3 mx-auto flex items-center justify-center h-26 rounded-lg border border-white/20 cursor-pointer hover:border-[#aaa] transition"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <RiImageAddFill className="text-[64px] text-white/70" />
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={changeHandler}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <LoadingSpinner />
              </div>
            )}
            {imageError && (
              <p className="text-red-500 text-sm mt-2">{imageError}</p>
            )}
          </div>

          {/* ── Text fields ── */}
          {[
            { label: "Product Name", value: productName, setter: setProductName, placeholder: "e.g. Organic Maize" },
            { label: "Description", value: productDesc, setter: setProductDesc, placeholder: "Describe your product" },
            { label: "Weight / Quantity (kg)", value: productWeight, setter: setProductWeight, placeholder: "e.g. 500" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <p className="mb-2 text-sm">{label}</p>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="border mb-4 border-white/20 w-full rounded-md p-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              />
            </div>
          ))}

          {/* ── Payment mode ── */}
          <p className="mb-2 text-sm">Payment Mode</p>
          <div className="flex gap-3 mb-4">
            {["sol", "spl"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMode(m)}
                className={`flex-1 py-2 rounded-lg border font-semibold transition ${
                  paymentMode === m
                    ? "border-white bg-white/10 text-white"
                    : "border-white/20 text-white/50 hover:border-white/40"
                }`}
              >
                {m === "sol" ? "SOL" : "SPL (USDC)"}
              </button>
            ))}
          </div>

          {/* ── Price ── */}
          <p className="mb-2 text-sm">
            Price per kg ({paymentMode === "sol" ? "SOL" : "USDC"})
          </p>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder={paymentMode === "sol" ? "e.g. 0.05" : "e.g. 2.50"}
            className="border mb-4 border-white/20 w-full rounded-md p-3 bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
          />

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Bulk Discount Tiers (optional)</p>
              <button
                type="button"
                onClick={addTier}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Add Tier
              </button>
            </div>
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="number"
                  value={tier.quantity}
                  onChange={(e) => updateTier(idx, "quantity", e.target.value)}
                  placeholder="Min kg"
                  className="w-1/2 border border-white/20 rounded-md p-2 bg-transparent text-white text-sm focus:outline-none"
                />
                <input
                  type="number"
                  value={tier.discountPercentage}
                  onChange={(e) =>
                    updateTier(idx, "discountPercentage", e.target.value)
                  }
                  placeholder="Discount %"
                  min="1"
                  max="99"
                  className="w-1/2 border border-white/20 rounded-md p-2 bg-transparent text-white text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeTier(idx)}
                  className="text-red-400 hover:text-red-300 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="bg-[#073F77] text-white py-2 px-4 rounded-lg text-[16px] lg:text-[20px] font-bold w-full my-4 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleListProduct}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Listing…" : "Create →"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default AddProduct;