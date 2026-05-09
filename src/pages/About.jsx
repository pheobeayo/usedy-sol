import aboutimage from "../assets/aboutimage.jpg";

const About = () => {
  return (
    <div>
      <h2 className="text-[#154A80] lg:text-[28px] md:text-[28px] text-[26px] font-[700] my-8 text-center mb-12">
        How Usedy work
      </h2>
      <div>
        <div className="flex justify-between flex-col lg:flex-row md:flex-row items-center px-4 lg:px-0 md:px-0">
          <div className="text-[#0F160F]/70 lg:w-[50%] md:w-[50%] w-[90%] flex flex-wrap justify-between">
            <div className="mb-4  lg:w-[48%] md:w-[48%] w-[100%] shadow-lg p-4 rounded-xl border border-black/10">
              <p className="text-[18px] my-5">
                <strong>Sign Up and Get Started</strong>
              </p>
              <p className="text-[14px]">
                {" "}
                Begin by signing up on the Usedy platform. Join a community of
                eco-conscious individuals dedicated to making a positive impact
                on the environment.
              </p>
            </div>
            <div className="mb-4  lg:w-[48%] md:w-[48%] w-[100%] shadow-lg p-4 rounded-xl border border-black/10">
              <p className="text-[18px] my-5">
                <strong>
                  Proceed to sell or buy button to post or buy Recyclable
                  Products
                </strong>
              </p>
              <p className="text-[14px]">
                {" "}
                Provide details about the recyclable materials you want to sell
                including images, type, quality, price in cryptocurrency, and
                location
              </p>
            </div>
            <div className="mb-4  lg:w-[48%] md:w-[48%] w-[100%] shadow-lg p-4 rounded-xl border border-black/10">
              <p className="text-[18px] my-5">
                <strong>
                  {" "}
                  Users get directed based on the buy or sell button
                </strong>
              </p>
              <p className="text-[14px]">
                {" "}
                If you are a buyer, proceed to the marketplace page to check the
                recyclable products available for sale. And for sellers, proceed
                to post your products
              </p>
            </div>
            <div className="mb-4  lg:w-[48%] md:w-[48%] w-[100%] shadow-lg p-4 rounded-xl border border-black/10">
              <p className="text-[18px] my-5">
                <strong> Secure Blockchain Payment</strong>
              </p>
              <p className="text-[14px]">
                {" "}
                As a buyer your payment is secured on the blockchain. Escrow
                service holds cryptocurrency until a buyer confirms receipt of
                recyclable materials
              </p>
            </div>
          </div>
          <div className="lg:w-[45%] md:w-[45%] w-[100%]">
            <img src={aboutimage} alt="" className="w-[100%] h-[60vh] object-cover object-center rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
