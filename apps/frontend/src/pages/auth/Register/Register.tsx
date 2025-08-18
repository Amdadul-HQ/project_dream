// "use client";

// import React, { useEffect, useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import { FcGoogle } from "react-icons/fc";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Upload } from "lucide-react";
// import Link from "next/link";
// import Logo from "@/components/shared/Logo/Logo";

// export default function RegisterPage() {
//   // Use state to manage form data and validation errors
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     profileImage: null as File | null,
//   });
//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     profileImage: "",
//   });
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   // Effect to handle image preview whenever the profileImage state changes
//   useEffect(() => {
//     if (formData.profileImage) {
//       const previewURL = URL.createObjectURL(formData.profileImage);
//       setImagePreview(previewURL);
//       // Clean up the URL object when the component unmounts or the image changes
//       return () => URL.revokeObjectURL(previewURL);
//     } else {
//       setImagePreview(null);
//     }
//   }, [formData.profileImage]);

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { id, value, files } = e.target;
//     // Reset any validation errors for the changed field
//     setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));

//     if (id === "profileImage" && files) {
//       setFormData((prevData) => ({
//         ...prevData,
//         profileImage: files[0] || null,
//       }));
//     } else {
//       setFormData((prevData) => ({ ...prevData, [id]: value }));
//     }
//   };

//   // Validate the form and return true if valid
//   const validateForm = () => {
//     const newErrors = {
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       profileImage: "",
//     };
//     let isValid = true;

//     // Name validation
//     if (!formData.name) {
//       newErrors.name = "Name is required";
//       isValid = false;
//     }

//     // Email validation
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//       isValid = false;
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = "Invalid email address";
//       isValid = false;
//     }

//     // Phone validation
//     // const phoneRegex = /^[0-9]{11}$/;
//     // if (!formData.phone) {
//     //   newErrors.phone = "Phone is required";
//     //   isValid = false;
//     // } else if (!phoneRegex.test(formData.phone)) {
//     //   newErrors.phone = "Phone must be 11 digits";
//     //   isValid = false;
//     // }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//       isValid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       isValid = false;
//     }

//     // Profile Image validation
//     if (!formData.profileImage) {
//       newErrors.profileImage = "Profile image is required";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Handle form submission
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (validateForm()) {
//       const form = new FormData();
//       form.append("name", formData.name);
//       form.append("email", formData.email);
//       form.append("phone", formData.phone);
//       form.append("password", formData.password);
//       if (formData.profileImage) {
//         form.append("profileImage", formData.profileImage);
//       }

//       console.log("FormData entries:");
//       // Log the form data to the console
//       for (let pair of form.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       // Reset the form after successful submission
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         password: "",
//         profileImage: null,
//       });
//       setErrors({
//         name: "",
//         email: "",
//         phone: "",
//         password: "",
//         profileImage: "",
//       });
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//       <Card className="w-full max-w-xl shadow-lg rounded-2xl">
//         <div>
//           <div className="flex items-center justify-center">
//             <Logo />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-center mt-3 text-slate-900">Create your account.</h2>
//         </div>
//         <CardContent>
//           <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
//             {/* Name */}
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" type="text" value={formData.name} onChange={handleChange} />
//               {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={formData.email} onChange={handleChange} />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>

//             {/* Phone */}
//             <div>
//               <Label htmlFor="phone">Phone</Label>
//               <Input id="phone" type="text" value={formData.phone} onChange={handleChange} />
//               {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                 >
//                   {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
//                 </button>
//               </div>
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//             </div>

//             {/* Profile Image */}
//             <div>
//               <Label htmlFor="profileImage">Profile Image</Label>
//               <div className="flex items-center gap-4">
//                 <label
//                   htmlFor="profileImage"
//                   className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none flex items-center justify-center gap-1.5 text-sm cursor-pointer"
//                 >
//                   <Upload size={16} />
//                   <span className="font-medium">Choose Image</span>
//                 </label>
//                 <Input id="profileImage" type="file" accept="image/*" className="hidden" onChange={handleChange} />
//                 {imagePreview && <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-full border shrink-0" />}
//               </div>
//               {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage}</p>}
//             </div>

//             {/* Submit */}
//             <Button type="submit" className="w-full bg-[#2F2685] text-white py-2 px-4 rounded-md hover:bg-[#302685e4] transition cursor-pointer">
//               Register
//             </Button>

//             {/* Login Redirect */}
//             <p className="text-sm text-center mt-2 font-medium">
//               Already have an account?{" "}
//               <Link href="/login" className="text-[#2F2685] hover:underline">
//                 Login
//               </Link>
//             </p>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center my-4">
//             <div className="flex-1 h-px bg-gray-300"></div>
//             <span className="px-3 text-gray-500 text-sm">or</span>
//             <div className="flex-1 h-px bg-gray-300"></div>
//           </div>

//           {/* Google Login */}
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full flex items-center justify-center gap-2 cursor-pointer"
//             onClick={() => console.log("Google Login Clicked")}
//           >
//             <FcGoogle size={20} />
//             Continue with Google
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

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

// ✅ Zod schema for validation
const registerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .refine((val) => !val || /^[0-9]{11}$/.test(val), {
      message: "Phone must be exactly 11 digits",
    }),
  password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters"),
  profileImage: z
    .instanceof(File, { message: "Profile image is required" })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Image must be less than 2MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPG or PNG files are allowed",
    }),
});

// ✅ TypeScript type from schema
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ React Hook Form setup with Zod
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Watch profileImage to show preview
  const profileImage = watch("profileImage");
  useEffect(() => {
    if (profileImage instanceof File) {
      const previewURL = URL.createObjectURL(profileImage);
      setImagePreview(previewURL);
      return () => URL.revokeObjectURL(previewURL);
    } else {
      setImagePreview(null);
    }
  }, [profileImage]);

  // ✅ Form submission
  const onSubmit = (data: RegisterFormData) => {
    const form = new FormData();
    form.append("name", data.name);
    form.append("email", data.email);
    form.append("phone", data.phone || "");
    form.append("password", data.password);
    form.append("profileImage", data.profileImage);

    console.log("FormData entries:");
    for (const pair of form.entries()) {
      console.log(pair[0], pair[1]);
    }

    reset();
    setImagePreview(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl shadow-lg rounded-2xl">
        <div>
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-3 text-slate-900">Create your account.</h2>
        </div>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="text" {...register("phone")} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} />
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
              <Label htmlFor="profileImage">Profile Image</Label>
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
                    if (file) setValue("profileImage", file, { shouldValidate: true });
                  }}
                />
                {imagePreview && <Image src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-full border shrink-0" />}
              </div>
              {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage.message}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full bg-[#2F2685] text-white py-2 px-4 rounded-md hover:bg-[#302685e4] transition cursor-pointer">
              Register
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

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
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
