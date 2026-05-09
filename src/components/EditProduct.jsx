/**
 * EditProduct.jsx  (Solana version)
 * Replaces: EVM EditProduct.jsx
 *
 * Key changes:
 * - formatUnits(productData.price, 18) → formatSol() / formatSpl() from priceUtils
 * - ethers.parseUnits(productPrice) → BN conversion before calling hook
 * - Payment mode selector added (must match the original mode, or allow change)
 * - Negotiation tiers pre-populated from productData.negotiationTiers
 * - useEditProduct hook signature: (id, name, image, desc, price BN, weight BN, mode, tiers)
 */

import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { RiImageAddFill } from "react-icons/ri";
import useEditProduct from "../hooks/useEditProduct";
import usePinataUpload from "../hooks/usePinataUpload";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { formatSol, formatSpl } from "../utils/priceUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  maxHeight: "90vh",
  overflowY: "auto",
  p: 4,
};

const EditProduct = ({ id, productData }) => {
  const [open, setOpen] = useState(false);
  const handleEdit = useEditProduct();
  const { uploadToPinata, isUploading } = usePinataUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("sol");
  const [tiers, setTiers] = useState([]);
  const [imageError, setImageError] = useState("");

  // ── Pre-populate from productData ──────────────────────────────────────────
  const populateForm = () => {
    if (!productData) return;
    setImageUrl(productData.image ?? "");
    setProductName(productData.name ?? "");
    setProductDesc(productData.product ?? productData.description ?? "");
    setProductWeight(productData.weight?.toString() ?? "");

    // Detect payment mode
    const isSpl = productData.paymentMode && "spl" in productData.paymentMode;
    setPaymentMode(isSpl ? "spl" : "sol");

    // Format price back to human-readable for the input field
    if (productData.price) {
      setProductPrice(
        isSpl
          ? formatSpl(productData.price)
          : formatSol(productData.price)
      );
    }

    // Pre-populate tiers
    if (productData.negotiationTiers?.length) {
      setTiers(
        productData.negotiationTiers.map((t) => ({
          quantity: t.quantity.toString(),
          discountPercentage: t.discountPercentage.toString(),
        }))
      );
    }
  };

  useEffect(() => {
    populateForm();
  }, [productData]);

  const handleOpen = () => {
    populateForm();
    setOpen(true);
  };

  const handleClose = () => {
    populateForm(); // reset to original data
    setOpen(false);
  };

  // ── Tier helpers ────────────────────────────────────────────────────────────
  const addTier = () => {
    if (tiers.length >= 5) return;
    setTiers((p) => [...p, { quantity: "", discountPercentage: "" }]);
  };
  const updateTier = (idx, field, value) =>
    setTiers((p) => p.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  const removeTier = (idx) => setTiers((p) => p.filter((_, i) => i !== idx));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleEditProduct = async () => {
    setIsSubmitting(true);
    try {
      let priceBN;
      if (paymentMode === "sol") {
        priceBN = new BN(Math.round(Number(productPrice) * LAMPORTS_PER_SOL));
      } else {
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

      await handleEdit(
        id,
        productName,
        imageUrl,
        productDesc,
        priceBN,
        weightBN,
        modeArg,
        validTiers
      );
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Image ───────────────────────────────────────────────────────────────────
  const convertIpfsUrl = (url) =>
    url?.startsWith("ipfs://") ? url.replace("ipfs://", "https://ipfs.io/ipfs/") : url;

  const changeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size / (1024 * 1024) > 1) {
      setImageError("File size exceeds 1 MB.");
      return;
    }
    setImageError("");
    try {
      setImageUrl(await uploadToPinata(file));
    } catch { /* usePinataUpload toasts error */ }
  };

  return (
    <div>
      <button
        className="border border-[#0C3B45] text-[#0C3B45] py-2 px-4 rounded-lg text-[18px] font-bold w-full my-2 hover:bg-bg-ash"
        onClick={handleOpen}
        disabled={productData?.inProgress > 0}
        title={productData?.inProgress > 0 ? "Cannot edit while escrow is active" : ""}
      >
        {productData?.inProgress > 0 ? "Escrow Active" : "Edit Product"}
      </button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <p className="font-bold text-[24px] text-center my-6">
            Edit Product{productData?.name ? ` — ${productData.name}` : ""}
          </p>
          <p className="text-center mb-4 text-sm text-gray-300">
            {productData ? "Pre-populated with current data" : "Loading…"}
          </p>

          {/* Image */}
          <label className="block mb-1 text-sm">Product Image (max 1 MB)</label>
          <div className="mb-4 w-full relative">
            {imageUrl ? (
              <div className="relative w-[150px] mx-auto border border-white/20 rounded-md overflow-hidden">
                <img src={convertIpfsUrl(imageUrl)} alt="Product" className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => document.getElementById("editFileInput").click()}
                  className="absolute bottom-0 right-0 bg-black/80 p-2 rounded-full"
                >
                  <RiImageAddFill className="text-white text-xl" />
                </button>
              </div>
            ) : (
              <div
                className="w-[150px] my-3 mx-auto flex items-center justify-center h-26 rounded-lg border border-white/20 cursor-pointer"
                onClick={() => document.getElementById("editFileInput").click()}
              >
                <RiImageAddFill className="text-[64px] text-white/70" />
              </div>
            )}
            <input id="editFileInput" type="file" accept="image/*" onChange={changeHandler} className="hidden" disabled={isUploading} />
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                <LoadingSpinner />
              </div>
            )}
            {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
          </div>

          {/* Read-only ID */}
          <p className="mb-2 text-sm">Product ID</p>
          <input value={id} readOnly className="border mb-4 border-white/20 w-full rounded-md p-3 bg-gray-600 cursor-not-allowed" />

          {/* Text fields */}
          {[
            { label: "Product Name", value: productName, setter: setProductName },
            { label: "Description", value: productDesc, setter: setProductDesc },
            { label: "Weight / Quantity (kg)", value: productWeight, setter: setProductWeight },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <p className="mb-2 text-sm">{label}</p>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="border mb-4 border-white/20 w-full rounded-md p-3 bg-transparent text-white focus:outline-none"
              />
            </div>
          ))}

          {/* Payment mode */}
          <p className="mb-2 text-sm">Payment Mode</p>
          <div className="flex gap-3 mb-4">
            {["sol", "spl"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMode(m)}
                className={`flex-1 py-2 rounded-lg border font-semibold transition ${
                  paymentMode === m ? "border-white bg-white/10 text-white" : "border-white/20 text-white/50"
                }`}
              >
                {m === "sol" ? "SOL" : "SPL (USDC)"}
              </button>
            ))}
          </div>

          {/* Price */}
          <p className="mb-2 text-sm">Price per kg ({paymentMode === "sol" ? "SOL" : "USDC"})</p>
          <input
            type="text"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="border mb-4 border-white/20 w-full rounded-md p-3 bg-transparent text-white focus:outline-none"
          />

          {/* Tiers */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Bulk Discount Tiers</p>
              <button type="button" onClick={addTier} className="text-xs text-blue-400">+ Add Tier</button>
            </div>
            {tiers.map((tier, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input type="number" value={tier.quantity} onChange={(e) => updateTier(idx, "quantity", e.target.value)} placeholder="Min kg" className="w-1/2 border border-white/20 rounded-md p-2 bg-transparent text-white text-sm focus:outline-none" />
                <input type="number" value={tier.discountPercentage} onChange={(e) => updateTier(idx, "discountPercentage", e.target.value)} placeholder="%" min="1" max="99" className="w-1/2 border border-white/20 rounded-md p-2 bg-transparent text-white text-sm focus:outline-none" />
                <button type="button" onClick={() => removeTier(idx)} className="text-red-400 text-lg">×</button>
              </div>
            ))}
          </div>

          <button
            className="bg-[#073F77] text-white py-2 px-4 rounded-lg text-[16px] lg:text-[20px] font-bold w-full my-4 disabled:opacity-50"
            onClick={handleEditProduct}
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Saving…" : "Edit Product →"}
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default EditProduct;