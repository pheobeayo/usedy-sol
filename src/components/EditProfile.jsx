import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useEditProfile from "../hooks/useEditProfile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  color: "white",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 10,
  boxShadow: 24,
  maxHeight: "90vh",        
  overflowY: "auto",  
  border: "1px solid #42714262",
  backgroundColor: "#1E1D34",
  p: 4,
};

const EditProfile = ({ id }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [location, setLocation] = useState("");
  const [mail, setMail] = useState("");
  const handleEditProfile = useEditProfile();
  
  const handleEdit = async () => {
    try {
      if (!location || !mail) {
        toast.error("Please fill in all fields");
        return;
      }
      await handleEditProfile(location, mail);
      setLocation("");
      setMail("");
      handleClose();
    } catch (error) {
      console.error("Error editing profile:", error);
      toast.error("Failed to edit profile");
    }
  };

  return (
    <div>
      <div>
        <button
          className="border-[#0C3B45] border text-[#0C3B45] py-2 px-4 rounded-lg font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold"
          onClick={handleOpen}
        >
          Edit Profile
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <input
              type="text"
              placeholder="Location"
              value={location}
              className="rounded-lg w-[100%] border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none"
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="email"
              placeholder="Mail"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none"
            />
            <button
              className="bg-[#073F77] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4"
              onClick={handleEdit}
            >
              Edit Profile&rarr;
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default EditProfile;