import bannerImg from '../assets/product.png'
import AddProduct from './AddProduct'

const Banner = () => {
  return (
    <div className='flex flex-col lg:flex-row md:flex-row bg-[#263E59] rounded-[20px] w-[100%] text-white'>
        <div className='lg:w-[60%] md:w-[60%] w-[100%] p-8'>
            <h2 className='lg:text-[24px] md:text-[24px] text-[18px] font-bold mb-4'>Usedy - Where environmental consciousness gets you rewarded</h2>
            <p>Trade recyclables on the blockchain, earn rewards, and power the green revolution with every sale and purchase</p>
            <div className='mt-6'>
            <AddProduct />
            </div>
        </div>
        <div className='lg:w-[40%] md:w-[40%] w-[100%] bg-[#EDF5FE] lg:rounded-tl-[50%] md:rounded-tl-[50%] lg:rounded-bl-[50%] rounded-tl-[50%] rounded-tr-[50%] text-right lg:rounded-tr-[20px] rounded-bl-[20px] rounded-br-[20px] p-6 flex justify-center'>
            <img src={bannerImg} alt="dashboard" className='w-[100%] lg:w-[60%] md:w-[60%]' />
        </div>
    </div>
  )
}

export default Banner