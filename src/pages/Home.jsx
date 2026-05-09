
import Hero from "../components/Hero";
import MarketplaceHome from "./MarketplaceHome";
import About from "./About";

const Home = () => {
  return (
    <main>
      <section className="bg-[#073F77]/5 pb-10">
        <Hero />
      </section>
      <section className="bg-white py-20">
        <div className="lg:w-[90%] md:w-[90%] w-[100%] mx-auto">
          <h2 className="lg:text-[32px] md:text-[32px] text-[24px] text-center font-[700] text-[#154A80] lg:w-[70%] md:w-[70%] w-[100%] font-titiliumweb mx-auto mb-10">
            Welcome to Usedy, where environmental consciousness meets blockchain
            innovation
          </h2>
          <div className="flex flex-col lg:flex-row md:flex-row justify-between">
            <div className="py-6 border rounded-xl border-[#154A80]/40 px-4 text-center shadow-lg lg:w-[32%] md:w-[32%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Tangible Rewards
              </h3>
              <p>
                Recycling is now more rewarding than ever. Earn tokens for every
                eco-conscious action you take.
              </p>
            </div>
            <div className="py-6 border rounded-xl border-[#154A80]/40 px-4 text-center shadow-lg lg:w-[32%] md:w-[32%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Be a Part of the Future
              </h3>
              <p>
                Usedy harnesses the potential of blockchain and technology for a
                better world.
              </p>
            </div>
            <div className="py-6 border rounded-xl border-[#154A80]/40 px-4 text-center shadow-lg lg:w-[32%] md:w-[32%] w-[90%] mx-auto mb-4">
              <h3 className="lg:text-[24px] md:text-[24px] text-[18px] font-[700] font-titiliumweb mb-4">
                Simple and Engaging
              </h3>
              <p>
                Usedy makes sustainability accessible and engaging. Embrace the
                future of sustainability
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className=" my-10">
        <h2 className="px-4 lg:px-0 md:px-0 lg:text-[28px] md:text-[28px] text-[20px] font-[700] my-6 flex justify-between flex-col lg:flex-row md:flex-row  w-[90%] mx-auto font-titiliumweb items-center text-center lg:text-left md:text-left">Recyclable materials for sale (Prices are in Unit of Measure) <span className="text-[16px] font-[400]">View More</span></h2>
        <MarketplaceHome />
      </section>
      <section id="about-us" className="lg:w-[90%] md:w-[90%] w-[100%] mx-auto my-14">
        <About />
      </section>
    </main>
  );
};

export default Home;
