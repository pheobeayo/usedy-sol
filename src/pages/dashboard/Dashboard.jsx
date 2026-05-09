import bannerImg from '../../assets/dashboard.svg'
import { useNavigate } from 'react-router-dom'
 import UserSellerProfile from '../../components/UserSellerProfile';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <main className="bg-white">
      <div className='flex flex-col mt-4 lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
          <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>Usedy - Where environmental consciousness gets you rewarded</h2>
          <p>Trade recyclables, used and reuseable products on the blockchain, earn rewards, and power the green revolution with every sale and purchase.</p>
          <div className='mt-6'>
            <button onClick={() => navigate('/dashboard/createprofile')} className="bg-white text-[#154A80] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] lg:w-[50%] md:w-[50%] w-[100%] my-2 hover:border-white hover:border hover:text-white hover:bg-transparent hover:font-bold">Create Profile</button>
          </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
          <img src={bannerImg} alt="dashboard" />
        </div>
      </div>
      <div className='my-6 w-[100%]'>
        <UserSellerProfile /> 
      </div>
    </main>

  );
};

export default Dashboard;