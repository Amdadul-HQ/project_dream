"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Upload } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/shared/Logo/Logo";
import Image from "next/image";
import avatar from "@/assets/avatar.png";
import { registerUser } from "@/services/auth";
import { FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GoogleLogin from "@/components/auth/GoogleLogin/GoogleLogin";

// Zod schema for validation
const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{11}$/.test(val), {
      message: "Phone must be exactly 11 digits",
    }),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
  profile: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, {
      message: "Invalid file format",
    })
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, {
      message: "Image must be less than 2MB",
    })
    .refine((file) => !file || ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPG or PNG files are allowed",
    }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Watch profileImage to show preview
  const profileImage = watch("profile");
  useEffect(() => {
    if (profileImage instanceof File) {
      const previewURL = URL.createObjectURL(profileImage);
      setImagePreview(previewURL);
      return () => URL.revokeObjectURL(previewURL);
    } else {
      setImagePreview(null);
    }
  }, [profileImage]);

  // Form submission
  const onSubmit = async (data: RegisterFormData) => {
    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("phone", data.phone || "");
    form.append("password", data.password);
    
    if (data.profile) {
      form.append("profile", data.profile);
    }

    try {
      const res = await registerUser(form);
      
      if (res?.success) {
        toast.success(res?.message || "Registration successful!");
        router.push("/login");
      } else {
        toast.error(res?.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again later.");
    } finally {
      reset();
      setImagePreview(null);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <div>
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-3 text-slate-900">
            Create your account.
          </h2>
          <div className="flex items-center justify-center mt-5">
            <Image
              src={imagePreview || avatar.src}
              alt="Preview"
              width={50}
              height={50}
              className="w-20 h-20 object-cover rounded-full border shrink-0 p-1"
            />
          </div>
        </div>
        
        <CardContent className="mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </Label>
              <Input
                id="phone"
                type="text"
                {...register("phone")}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Profile Image */}
            <div>
              <Label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                Profile Image
              </Label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="profileImage"
                  className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none flex items-center justify-center gap-1.5 text-sm cursor-pointer"
                >
                  <Upload size={16} />
                  <span className="font-medium">Choose Image</span>
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setValue("profile", file, { shouldValidate: true });
                  }}
                />
              </div>
              {errors.profile?.message && (
                <p className="text-red-500 text-sm">{String(errors.profile.message)}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2F2685] text-white py-2 px-4 rounded-md hover:bg-[#302685e4] transition cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isSubmitting ? <FaSpinner className="animate-spin" /> : "Register"}
            </Button>

            {/* Login Redirect */}
            <p className="text-sm text-center mt-2 font-medium">
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

          {/* Google Login Component */}
          <GoogleLogin isRegistration={true} />
        </CardContent>
      </Card>
    </div>
  );
}