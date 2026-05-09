/**
 * CreateProfile.jsx  (Solana version)
 * Replaces: EVM CreateProfile.jsx
 *
 * Change: adds a userType selector — the Solana program requires it.
 * The hook signature is: createProfile(name, location, mail, userType)
 * Everything else (modal, inputs, styling) is identical to your original.
 */

import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "react-toastify/dist/ReactToastify.css";
import useCreateProfile from "../hooks/useCreateProfile";

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

const USER_TYPE_OPTIONS = [
  { label: "Buyer",  value: { buyer: {}  } },
  { label: "Seller", value: { seller: {} } },
  { label: "Both",   value: { both: {}   } },
];

const CreateProfile = () => {
  const [open, setOpen] = useState(false);
  const [sellerName, setSellerName] = useState("");
  const [location, setLocation] = useState("");
  const [mail, setMail] = useState("");
  const [userType, setUserType] = useState({ buyer: {} }); // default
  const handleCreateProfile = useCreateProfile();

  const handleCreate = async () => {
    await handleCreateProfile(sellerName, location, mail, userType);
    setSellerName("");
    setLocation("");
    setMail("");
    setUserType({ buyer: {} });
    setOpen(false);
  };

  return (
    <div>
      <button
        className="bg-white text-[#0C3B45] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-full lg:w-[50%] md:w-[50%] my-2 hover:bg-bg-ash hover:text-darkGrey"
        onClick={() => setOpen(true)}
      >
        Create Profile
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <input
            type="text"
            placeholder="Your Name"
            value={sellerName}
            className="rounded-lg w-full text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            onChange={(e) => setSellerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            className="rounded-lg w-full border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none"
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={mail}
            className="text-white rounded-lg w-full p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            onChange={(e) => setMail(e.target.value)}
          />

          {/* User type selector — required by the Solana program */}
          <p className="mb-2 text-sm text-white/80">Account Type</p>
          <div className="flex gap-2 mb-4">
            {USER_TYPE_OPTIONS.map((opt) => {
              const key = Object.keys(opt.value)[0];
              const active = Object.keys(userType)[0] === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setUserType(opt.value)}
                  className={`flex-1 py-2 rounded-lg border font-semibold text-sm transition ${
                    active
                      ? "border-white bg-white/10 text-white"
                      : "border-white/20 text-white/50 hover:border-white/40"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <button
            className="bg-[#073F77] text-white py-2 px-4 rounded-lg lg:text-[20px] font-bold text-[16px] w-full my-4"
            onClick={handleCreate}
          >
            Create →
          </button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateProfile;