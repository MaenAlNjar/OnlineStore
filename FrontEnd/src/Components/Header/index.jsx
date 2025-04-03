import React, { useState } from "react";
import { ChevronRight, Menu } from "lucide-react";
import "./index.css";

const EcommerceHeader = () => {
  // Start at slide 0 (first slide)
  const [activeSlide, setActiveSlide] = useState(0);

  // Slide data for the hero section
  const slides = [
    {
      title: "THE NEW STANDARD",
      subtitle: "UNDER FAVORABLE SMARTWATCHES",
      price: "$749.99",
      buttonText: "Start Buying",
      image:
        "https://res.cloudinary.com/dgsjdx06z/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1739976282/zqzwc4jo4rrt1qzzxc3j.jpg",
    },
    {
      title: "EXCLUSIVE OFFERS",
      subtitle: "DISCOVER AMAZING DEALS",
      price: "$599.99",
      buttonText: "Shop Now",
      image:
        "https://res.cloudinary.com/dgsjdx06z/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1739976332/hu0ukwd39cajzpug04xe.jpg",
    },
    {
      title: "LATEST TRENDS",
      subtitle: "STYLE MEETS INNOVATION",
      price: "$699.99",
      buttonText: "Discover More",
      image:
        "https://res.cloudinary.com/dgsjdx06z/image/upload/v1739977739/a1a381181962681.Y3JvcCwxODAwLDE0MDgsMCww_csxqsf.jpg",
    },
  ];

  // Department data remains the same
  const departments = [
    { name: "Value of the Day", link: "#" },
    { name: "Top 100 Offers", link: "#" },
    { name: "New Arrivals", link: "#" },
    { name: "Computers & Accessories", link: "#", hasSubmenu: true },
    { name: "Cameras, Audio & Video", link: "#", hasSubmenu: true },
    { name: "Mobiles & Tablets", link: "#", hasSubmenu: true },
    { name: "Movies, Music & Video Game", link: "#", hasSubmenu: true },
    { name: "TV & Audio", link: "#", hasSubmenu: true },
    { name: "Watches & Eyewear", link: "#", hasSubmenu: true },
    { name: "Car, Motorbike & Industrial", link: "#", hasSubmenu: true },
    { name: "Accessories", link: "#", hasSubmenu: true },
  ];

  // Get current slide data based on activeSlide index
  const currentSlide = slides[activeSlide];

  return (
    <div className="Header-Continer">
      {/* Top Navigation */}
      <div className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <button className="bg-yellow-400 px-4 py-2 rounded flex items-center font-medium">
              <Menu className="w-5 h-5 mr-2" />
              All Departments
            </button>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Super Deals
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Featured Brands
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Trending Styles
              </a>
              <a href="#" className="text-gray-700 hover:text-gray-900">
                Gift Cards
              </a>
            </div>
          </div>

          {/* Right Section */}
          <div className="text-gray-600">Free Shipping on Orders $50+</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <ul className="bg-white rounded shadow">
              {departments.map((dept, index) => (
                <li key={index} className="border-b last:border-b-0">
                  <a
                    href={dept.link}
                    className="px-4 py-3 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                  >
                    {dept.name}
                    {dept.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Slider*/}

          <div className="Slider w-full h-[400px] md:h-[500px] lg:h-[600px]">
            <div
              className="relative rounded-lg p-8 bg-cover bg-center w-full h-full transition-all duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${slides[activeSlide].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Optional Overlay for better contrast */}
              <div className="absolute inset-0 bg-black opacity-40 rounded"></div>

              {/* Slide Content */}
              <div className="relative max-w-lg text-white z-10">
                <h1 className="text-5xl font-light mb-4">
                  {slides[activeSlide].title}
                </h1>
                <h2 className="text-xl mb-6">{slides[activeSlide].subtitle}</h2>
                <div className="text-3xl font-medium mb-6">
                  FROM <span className="ml-2">{slides[activeSlide].price}</span>
                </div>
                <button className="bg-yellow-400 px-8 py-3 rounded font-medium hover:bg-yellow-500">
                  {slides[activeSlide].buttonText}
                </button>
              </div>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      activeSlide === index ? "bg-gray-800" : "bg-gray-400"
                    }`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceHeader;
