"use client";
import React, { useState } from "react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/services/auth/auth";

const formSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useCustomToast();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token || !email) {
      toast.error({ message: "Reset token or email is missing" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(token, values.password, email);

      if (response.success) {
        toast.success({ message: "Password reset successful" });
        router.push("/sign-in");
      } else {
        toast.error({ message: response.message });
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
    <section className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative">
          <Button
            onClick={() => router.push("/sign-in")}
            variant="ghost"
            className="absolute top-0 left-[-10px] p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <div className="mt-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Reset Password
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your new password to reset your account.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        New Password
                      </FormLabel>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          className="py-2 px-4 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <Eye className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeOff className="h-5 w-5 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white hover:bg-primary/90 transition-colors font-semibold py-3 rounded-lg text-lg shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin mr-2" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 bg-primary relative">
        <div className="absolute inset-0 bg-opacity-70 bg-primary flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-xl">
              Create a new secure password for your account
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
