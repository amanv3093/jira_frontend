"use client";

import React, { useState } from "react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  ArrowLeft,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { forgetPassword } from "@/services/auth/auth";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof formSchema>;

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setIsLoading(true);
      const response = await forgetPassword(values.email);

      if (response.success) {
        setEmailSent(true);
        toast.success({
          message: "Reset link sent! Check your email.",
        });
      } else {
        toast.error({ message: response.message || "Something went wrong" });
      }
    } catch {
      toast.error({ message: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left - Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800" />
        <Image
          src="/photo-1616024088876-6a83436b7956.avif"
          alt="Forgot password background"
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
            Forgot your
            <br />
            password?
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            No worries. We&apos;ll send you a secure link to reset your password
            and get back to work.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <KeyRound className="h-5 w-5 text-white/80" />
              <div>
                <p className="text-sm font-medium">Secure Reset</p>
                <p className="text-xs text-white/60">Link expires in 1 hour</p>
              </div>
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

          {!emailSent ? (
            <>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Forgot password
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="name@company.com"
                      className="pl-10 h-11"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
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
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
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
                  Check your email
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  We&apos;ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground">
                    {getValues("email")}
                  </span>
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or
                </p>
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="gap-2"
                  size="sm"
                >
                  Try another email
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
