import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaPinterest, FaYoutube } from "react-icons/fa";

const SocialMedia = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 space-y-4">
    <h1 className="text-xl font-semibold text-purple-800">Social Media</h1>
      <div className="flex items-center gap-2">
        <FaFacebook className="text-blue-500 text-xl" />
        <p className="text-lg">Facebook</p>
      </div>
      <div className="flex items-center gap-2">
        <BsTwitterX className="text-black text-xl" />
        <p className="text-lg">Twitter (X) </p>
      </div>
      <div className="flex items-center gap-2">
        <FaYoutube className="text-red-500 text-xl" />
        <p className="text-lg">Youtube</p>
      </div>
      <div className="flex items-center gap-2">
        <FaInstagram className="text-red-500 text-xl" />
        <p className="text-lg">Instagram</p>
      </div>
      <div className="flex items-center gap-2">
        <FaPinterest className="text-red-500 text-xl" />
        <p className="text-lg">Pinterest</p>
      </div>
    </div>
  );
};

export default SocialMedia;
