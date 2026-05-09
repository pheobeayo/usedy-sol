import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import useProgram from "./useProgram";
import { getProfilePDA } from "../utils/pdas";
import { getErrorMessage } from "../utils/parseAnchorError";
import { useProduct } from "../context/ContextProvider";

const useEditProfile = () => {
  const program = useProgram(true);
  const { address: _address, isConnected } = useAppKitAccount();
  const publicKey = _address ? new PublicKey(_address) : null;
  const { refreshSellers } = useProduct();

  return useCallback(
    async (location, mail) => {
      if (!location || !mail) {
        toast.error("Location and email are required");
        return;
      }

      if (!publicKey) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!program) {
        toast.error("Program not initialised — check your wallet connection");
        return;
      }

    
      const [profilePDA] = getProfilePDA(publicKey);

      
      try {
        const txSig = await program.methods
          .updateProfile(location, mail)
          .accounts({
            userProfile: profilePDA,
            user: publicKey,
          })
          .rpc();

        toast.success(`Profile updated! Tx: ${txSig.slice(0, 8)}…`);
        refreshSellers?.();
        return txSig;
      } catch (err) {
        const reason = getErrorMessage(err);
        toast.error(`Failed to update profile — ${reason}`, {
          position: "top-center",
        });
        console.error("updateProfile error:", err);
      }
    },
    [program, publicKey, refreshSellers]
  );
};

export default useEditProfile;