import React from "react";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaFacebookF, FaYoutube, FaInstagram, FaPinterestP } from "react-icons/fa";
import Logo from "./Logo/Logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto hidden sm:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Section - Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              {/* <Image
                src={logo}
                alt="Obliq Logo"
                width={100}
                height={60}
                className="max-w-[150px] min-h-[35px]"
              /> */}
              <Logo />
            </div>

            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Speed Lighter Template is Designed Theme for Giving Enhanced look Various Features are available Which is designed in User friendly to
              handle by Piki Developers.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-gray-600" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label="Pinterest"
              >
                <FaPinterestP className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
                      Profile
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
                      Contact us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
                      Privacy policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section - Call to Action */}
          <div className="lg:col-span-1">
            <div className="bg-gray-100 rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Join now to save</h3>
                <p className="text-lg font-medium text-gray-900 mb-6">your reads</p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="ghost"
                    className="cursor-pointer flex-1 bg-hover text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 w-full"
                  >
                    <Link href={"/login"}>Log in</Link>
                  </Button>

                  <Button className="cursor-pointer flex-1 bg-accent hover:bg-indigo-700 text-white w-full">
                    <Link href={"/register"}>Sign up</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-400 text-sm">All right reserved by Obliq 2025</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
