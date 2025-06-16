import React from "react";
import HeroSection from "./HeroSection";
import FeaturedBooksSection from "./FeaturedBooksSection";
import CategoriesSection from "./CategoriesSection";
import MissionSection from "./MissionSection";
import Footer from "./Footer";

function Home() {
  return (
    <div className="text-black">
      <HeroSection />
      <FeaturedBooksSection />
      <CategoriesSection />
      <MissionSection />
    </div>
  );
}

export default Home;
