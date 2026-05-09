import { RotateLoader } from "react-spinners";

const LoadingSpinner = () => (
  <div className='text-center grid place-content-center'>
     <RotateLoader color="#154A80" size={15} />
  </div>
);

export default LoadingSpinner;