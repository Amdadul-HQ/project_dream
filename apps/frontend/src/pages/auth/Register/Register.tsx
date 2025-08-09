"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Form Data:", Object.fromEntries(formData.entries()));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">User Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" required />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="text" required />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" type="text" required />
            </div>

            {/* Password with toggle */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Social Links */}
            {["facebook", "youtube", "twitter", "instagram", "pinterest", "linkedin", "tiktok"].map((social) => (
              <div key={social}>
                <Label htmlFor={social} className="capitalize">
                  {social}
                </Label>
                <Input id={social} name={social} type="text" placeholder={`Enter ${social} URL`} />
              </div>
            ))}

            {/* Profile Image Upload */}
            <div>
              <Label htmlFor="profileImage">Profile Image</Label>
              <div className="flex items-center gap-4">
                <label htmlFor="profileImage" className="cursor-pointer border rounded-lg px-4 py-2 bg-white shadow hover:bg-gray-50">
                  Choose Image
                </label>
                <Input id="profileImage" name="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-full border" />}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-[#2F2685] text-white py-2 px-4 rounded-md hover:bg-[#302685e4] transition">
              Register
            </Button>

            {/* Redirect to Login */}
            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2F2685] hover:underline">
                Login
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => console.log("Google Login Clicked")}
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
