"use client";

import React, { useState } from "react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { resetPassword } from "@/services/auth/auth";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useCustomToast();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirm_password: "" },
  });

  const onSubmit = async (values: FormData) => {
    if (!token || !email) {
      toast.error({ message: "Reset token or email is missing" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(token, values.password, email);

      if (response.success) {
        setResetSuccess(true);
        toast.success({ message: "Password reset successfully!" });
      } else {
        toast.error({
          message: response.message || response.error || "Reset failed",
        });
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

  // Invalid link state
  if (!token || !email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Invalid Reset Link
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push("/forget-password")} className="gap-2">
              Request New Link
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Link
              href="/sign-in"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800" />
        <Image
          src="/photo-1616024088876-6a83436b7956.avif"
          alt="Reset password background"
          fill
          unoptimized
          className="object-cover mix-blend-overlay opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-auto brightness-0 invert"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Set your new
            <br />
            password
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Choose a strong password to keep your account secure and get back to
            your workspace.
          </p>
          <div className="mt-12 space-y-3">
            <div className="flex items-center gap-3 text-sm text-white/70">
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              At least 8 characters long
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              Mix of letters and numbers recommended
            </div>
            <div className="flex items-center gap-3 text-sm text-white/70">
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              Avoid using common words
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Back link */}
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {!resetSuccess ? (
            <>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Reset password
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Create a new password for{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Min. 8 characters"
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm_password"
                      type={showPassword ? "text" : "password"}
                      {...register("confirm_password")}
                      placeholder="Repeat your password"
                      className="pl-10 h-11"
                    />
                  </div>
                  {errors.confirm_password && (
                    <p className="text-sm text-red-500">
                      {errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 gap-2 font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="space-y-6 text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Password reset!
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Your password has been updated successfully. You can now sign
                  in with your new password.
                </p>
              </div>
              <Button
                onClick={() => router.push("/sign-in")}
                className="gap-2"
              >
                Continue to Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
