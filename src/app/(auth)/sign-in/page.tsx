"use client";

import { useCustomToast } from "@/components/providers/toaster-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const router = useRouter();
  const toast = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/workspace";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        const message =
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error;
        toast.error({ message });
      } else if (result?.ok) {
        toast.success({ message: "Logged in successfully!" });
        router.push(callbackUrl, { scroll: false });
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

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl });
    } catch {
      toast.error({ message: "Failed to sign in with Google" });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-2xl animate-pulse [animation-delay:1s]" />
          <div className="absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-blue-300/10 blur-2xl animate-pulse [animation-delay:2s]" />
          {/* Grid pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="signin-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#signin-grid)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to
            <br />
            your workspace
          </h1>
          <p className="text-lg text-white/70 max-w-md mb-12">
            A personal project management tool to plan, track, and organize
            your work.
          </p>

          {/* Animated Kanban Board Illustration */}
          <div className="relative w-full max-w-md">
            {/* Board columns */}
            <div className="flex gap-3">
              {/* To Do Column */}
              <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10">
                <p className="text-xs font-semibold text-white/80 mb-3">To Do</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white/15 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite]">
                    <div className="h-2 w-3/4 rounded bg-white/30" />
                    <div className="h-2 w-1/2 rounded bg-white/20 mt-1.5" />
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-4 w-4 rounded-full bg-blue-400/40" />
                      <div className="h-1.5 w-8 rounded bg-white/20" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite_0.5s]">
                    <div className="h-2 w-full rounded bg-white/20" />
                    <div className="h-2 w-2/3 rounded bg-white/15 mt-1.5" />
                  </div>
                </div>
              </div>

              {/* In Progress Column */}
              <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10">
                <p className="text-xs font-semibold text-white/80 mb-3">In Progress</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white/15 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite_1s]">
                    <div className="h-2 w-full rounded bg-white/30" />
                    <div className="h-2 w-1/3 rounded bg-white/20 mt-1.5" />
                    <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                      <div className="h-1.5 w-3/5 rounded-full bg-yellow-400/50 animate-[progressBar_4s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite_1.5s]">
                    <div className="h-2 w-2/3 rounded bg-white/20" />
                    <div className="flex items-center gap-1.5 mt-2">
                      <div className="h-4 w-4 rounded-full bg-green-400/40" />
                      <div className="h-1.5 w-10 rounded bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Done Column */}
              <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm p-3 border border-white/10">
                <p className="text-xs font-semibold text-white/80 mb-3">Done</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white/15 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite_2s]">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-400 animate-[checkPop_2s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="h-2 w-full rounded bg-white/20 line-through" />
                    </div>
                    <div className="h-2 w-1/2 rounded bg-white/15 mt-1.5 ml-6" />
                  </div>
                  <div className="rounded-lg bg-white/10 p-2.5 animate-[fadeSlideDown_3s_ease-in-out_infinite_2.5s]">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="h-2 w-3/4 rounded bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification badge */}
            <div className="absolute -top-4 -right-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 animate-bounce [animation-duration:3s]">
              <p className="text-xs font-medium">3 tasks completed</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeSlideDown {
            0%, 100% { opacity: 0.7; transform: translateY(-4px); }
            50% { opacity: 1; transform: translateY(0); }
          }
          @keyframes progressBar {
            0%, 100% { width: 40%; }
            50% { width: 75%; }
          }
          @keyframes checkPop {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}</style>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Google Sign In */}
          {googleEnabled && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-11 gap-3 font-medium"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-background text-muted-foreground">
                    or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="name@company.com"
                  className="pl-10 h-11"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forget-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 gap-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={`/sign-up?${searchParams.toString()}`}
              className="text-primary font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
