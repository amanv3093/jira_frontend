"use client";
import React, { useState } from "react";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forgetPassword } from "@/services/auth/auth";

const formSchema = z.object({
  email_address: z.string().email("Please enter a valid email address"),
});

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useCustomToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await forgetPassword(values.email_address);

      if (response.success) {
        toast.success({
          message: "Reset password link has been sent to your email",
        });
        router.push("/sign-in");
      } else {
        toast.error({ message: response.message });
      }
    } catch {
      toast.error({ message: "Something went wrong. Please try again." });
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
              Forgot Password
            </h1>
            <p className="text-gray-600 mb-8">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          className="py-2 px-4 rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
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
            <h2 className="text-4xl font-bold mb-4">Password Recovery</h2>
            <p className="text-xl">
              We&apos;ll help you get back into your account
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
