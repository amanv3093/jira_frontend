"use client";

import { useCustomToast } from "@/components/providers/toaster-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import Link from "next/link";
// import { AnimatePresence, motion } from "framer-motion";
// Define Zod schema for validation
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;



const SignInForm = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log("result", result);
      if (result?.error) {
        // If error is JSON string from backend
        console.log("Error");
        try {
          const errorData = JSON.parse(result.error);
          toast.error({ message: errorData.message });
        } catch {
          toast.error({ message: result.error });
        }
      } else if (result?.ok) {
        console.log("Not Error");
        toast.success({ message: "Logged in successfully!" });
      router.push(callbackUrl , { scroll: false });

      }
    } catch (error) {
      toast.error({
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="bg-[#832326] h-screen w-full flex justify-center items-center overflow-hidden">
      <div className="w-[75%] h-[90%] bg-white rounded-[30px] p-4">
        <div className="grid grid-cols-2 h-full">
          {/* Left Image */}
          <div className="relative w-[90%] h-full">
            <Image
              src= "/photo-1616024088876-6a83436b7956.avif"
              alt="profile"
              fill
              className="object-cover rounded-[30px]"
            />
          </div>

         
          {/* Right Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-white rounded-2xl p-6">
              <h2 className="text-3xl font-medium text-start">Sign In</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="john@example.com"
                    className="rounded-full focus:border-red-100 bg-white focus:ring-0"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="Enter your password"
                    className="rounded-full focus:border-red-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-[70%] right-3 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-4 rounded-full bg-black text-white hover:bg-black flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Sign In
                </Button>

                {/* Optional: Links */}
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <Link href={`/sign-up?${searchParams.toString()}`}>Create account</Link>
                  <Link href="/auth/forgot-password">Forgot password?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
