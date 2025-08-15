"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/validation/authSchema";
import Input from "@/components/ui/Input";
import { Icons } from "@/constants/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/utils/authApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function LoginRoute() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (loginMutation.status === "success") {
      toast.success("Login Successfully!");
      router.push("/");
    } else if (loginMutation.status === "error") {
      const err = loginMutation.error;
      console.log(err.message);
      toast.error(err.message);
    }
  }, [loginMutation.status, router, loginMutation.error]);

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Icons.lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your dashboard account</p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              icon={<Icons.mail className="h-5 w-5 text-gray-400" />}
              placeholder="you@example.com"
              labelColor="text-gray-600"
              className="block text-gray-600 w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              isPassword
              labelColor="text-gray-600"
              icon={<Icons.lock className="h-5 w-5 text-gray-400" />}
              className="block text-gray-600 w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              passwordToggleIcons={{
                show: <Icons.eye className="h-5 w-5 text-gray-400" />,
                hide: <Icons.eyeOff className="h-5 w-5 text-gray-400" />,
              }}
              placeholder="Create a password"
              {...register("password")}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
