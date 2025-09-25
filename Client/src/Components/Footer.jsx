import React from 'react';
import { FaTwitter, FaFacebookF, FaInstagram, FaYoutube, FaLinkedin, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaLeaf, FaGlobe, FaChartLine } from 'react-icons/fa';
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full bg-green-700 text-white">
      <div className="container mx-auto px-6 py-16">
        {/* Footer main grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-14 mb-10">

          {/* Left Section */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={assets.logo} alt="Climate Ace Logo" className="w-20" />
              <h1 className="text-3xl font-bold">
                SARUBIMA <span className="text-yellow-300">.LK</span>
              </h1>
            </div>
            <p className="text-green-100 leading-relaxed mb-6">
              Empowering individuals and businesses to reduce their carbon footprint through data-driven insights and actionable recommendations.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center text-green-200 hover:text-yellow-300">
                <FaLeaf className="mr-2" /> Sustainable Solutions
              </div>
              <div className="flex items-center text-green-200 hover:text-yellow-300">
                <FaGlobe className="mr-2" /> Global Impact
              </div>
              <div className="flex items-center text-green-200 hover:text-yellow-300">
                <FaChartLine className="mr-2" /> Data-Driven Insights
              </div>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-semibold mb-5">Quick Links</h2>
            <ul className="space-y-3 text-green-100">
              {["Carbon Calculator","Sustainability Solutions","Climate Education","Community Initiatives","Research & Insights"].map((link, i) => (
                <li key={i} className="flex items-center cursor-pointer hover:text-yellow-300">
                  <span className="w-2 h-2 bg-yellow-300 rounded-full mr-2"></span>
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div>
            <h2 className="text-xl font-semibold mb-5">Contact Us</h2>
            <ul className="space-y-3 text-green-100">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-1 text-yellow-300" /> 123 World tred Center , Colombo, Sri Lanka
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2 text-yellow-300" /> +94 123 456 7890
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-yellow-300" /> contact@SARUBIMA.org
              </li>
            </ul>

            {/* Newsletter */}
             <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 text-white">Join Our Newsletter</h3>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-sm focus:outline-none text-white w-full 
             border border-white bg-none placeholder-white"
                />
                <button className="bg-yellow-300 hover:bg-yellow-400 text-green-800 font-bold px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-green-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Icons */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            {[{icon: FaTwitter, link:"https://twitter.com"}, {icon: FaFacebookF, link:"https://facebook.com"}, {icon: FaInstagram, link:"https://instagram.com"}, {icon: FaYoutube, link:"https://youtube.com"}, {icon: FaLinkedin, link:"https://linkedin.com"}].map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-yellow-300">
                  <Icon size={20} />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-green-200 text-center md:text-right">
            © {new Date().getFullYear()} SARUBIMA.LK  All rights reserved. <span className="block md:inline-block md:ml-2">Committed to a sustainable future.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
