import React from "react";

function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-16 flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Divine Reading Oasis
      </h1>
      <h2 className="text-2xl">An initiative by OMPH Church</h2>
      <p className="text-xl text-center">
        Welcome to Divine Reading Oasis, your source for free access to
        Christian <br /> religious books and spiritual wisdom.
      </p>
      <div className="flex gap-4">
        <button className="bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-blue-100 transition">
          Browse the Library
        </button>
        <button className="bg-blue-800 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
