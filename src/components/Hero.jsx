import React from "react";
import heroImg from "../assets/hero.jpg";

const Hero = () => {
  return (
    <div
      style={{ backgroundImage: `url(${heroImg})` }}
      className="w-[100%] lg:w-[90%] md:w-[90%] mx-auto flex bg-cover bg-center bg-black/50 bg-blend-overlay rounded-xl lg:h-[80vh] md:h-[80vh] h-[100vh] py-8"
    >
      <div className="bg-white rounded-xl py-4 lg:px-12 md:px-8 px-4 w-[90%] lg:w-[80%] md:w-[80%] mt-auto mx-auto flex flex-col items-center justify-center text-center">
        <h1 className="lg:text-[28px] md:text-[28px] text-[20px] font-[700] my-4 font-titilium">
          Empower sustainable climate action through a decentralized marketplace
          for used and reuseable products
        </h1>
        <p className="text-[18px] text-[#0F160F]/80">
          Trade recyclables on the blockchain, earn rewards, and power the green
          revolution with every sale and purchase
        </p>
        <div className="mt-6">
          <button className="bg-[#154A80] rounded-lg p-3 text-white mr-4 text-[18px]">
            Sell Products
          </button>
          <button className="border border-[#154A80] rounded-lg p-3 text-[#154A80] bg-white text-[18px]">
            Buy Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
