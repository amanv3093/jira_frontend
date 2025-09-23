"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/services/auth/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;
function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: SignupFormData) => {
    try {
      // Call your signup API
      console.log(data);
      const response = await signup(data);
      router.push("/login");
      // Handle success (e.g., show toast, redirect, etc.)
      console.log("Signup successful:", response);
      // Example: redirect to login page
      // router.push("/login");
    } catch (error: any) {
      // Handle errors from the API
      console.error("Signup failed:", error);
      // Example: show error toast or form error
    }
  };
  return (
    <div className="bg-[#1e3a60] h-screen w-full flex justify-center items-center">
      <div className="w-[75%] h-[90%] bg-white rounded-[30px] p-4">
        <div className="grid grid-cols-2 h-full">
          <div className="relative w-[90%] h-full">
            {" "}
            {/* Parent container sets size */}
            <Image
              src="/photo-1616024088876-6a83436b7956.avif"
              alt="profile"
              fill
              className="object-cover rounded-[30px]"
            />
          </div>

          <div className="rounded-[30px] flex items-center justify-center ">
            <div className="w-full max-w-md  space-y-6 bg-white rounded-2xl ">
              <h2 className="text-3xl font-medium text-start">
                Create an Account
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/*  Name */}
                <div className="flex justify-between w-full gap-6">
                  {/* First Name */}
                  <div className="w-full">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      {...register("first_name")}
                      placeholder="First name"
                      className="rounded-full focus:border-red-100 w-full"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="w-full">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      {...register("last_name")}
                      placeholder="Last name"
                      className="rounded-full focus:border-red-100  w-full"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>
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
                    className="absolute top-[68%] right-3 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 rounded-full bg-black text-white hover:bg-black"
                >
                  Sign Up
                </Button>
              </form>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <Link href="/sign-in">Already have an account? Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
