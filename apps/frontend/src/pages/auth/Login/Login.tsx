"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import Logo from "@/components/shared/Logo/Logo";
import { loginUser } from "@/services/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { CloudCog } from "lucide-react";
import useUser from "@/hooks/useUser";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { setIsLoading,setUser } = useUser();
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  const searchParams = useSearchParams();
  const [redirect, setRedirect] = useState<string | null>(null);
  useEffect(() => {
    if(searchParams){
      setRedirect(searchParams.get("redirectPath"));
    }
  }, [searchParams]);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData); // send JSON to API
    try {
      const res = await loginUser(formData);

      if (res?.success) {
        setUser(res?.data?.user);
        toast.success(res?.message);
        setIsLoading(true);
        if (redirect) {
          router.push(redirect);
        } else {
          router.push("/");
        }
      } 
    } catch (err: any) {
      console.error(err);
      toast.success("Failed to login user. Try again later !!");
    }finally{
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Google OAuth logic
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md mx-2">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 mt-3 text-slate-900">Login to your account.</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password with Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-[#2F2685] text-white py-2 px-4 rounded-md hover:bg-[#302685e4] transition cursor-pointer flex items-center justify-center">
            {loading ? <FaSpinner className="animate-spin"/> : "Login"}
          </button>

          {/* Redirect to Register */}
          <p className="text-sm text-center mt-2 font-medium">
            Don’t have an account?{" "}
            <Link href="/register" className="text-[#2F2685] hover:underline">
              Register
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
        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle size={22} />
          <span>Login with Google</span>
        </button>
      </div>
    </div>
  );
}
