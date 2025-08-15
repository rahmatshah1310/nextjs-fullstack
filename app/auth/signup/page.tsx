"use client";

import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/constants/icons";
import { Button } from "@/components/ui/button";
import { SignupFormValues, signupSchema } from "@/validation/authSchema";
import { toast } from "react-toastify";
import { useSignupMutation } from "@/utils/authApi";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useEffect } from "react";

export default function SignupRoute() {
  const router = useRouter();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (signupMutation.status === "success") {
      toast.success("Account created succesfully!");
      router.push("/");
    } else if (signupMutation.status === "error") {
      const err = signupMutation.error;
      toast.error(err.message);
    }
  }, [signupMutation.status, signupMutation.error, router]);

  const onSubmit: SubmitHandler<SignupFormValues> = (data: SignupFormValues) => {
    signupMutation.mutate({
      name: data.fullName,
      email: data.email,
      password: data.password,
      company: data.company,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-xl flex items-center justify-center">
            <Icons.user className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join us and start managing your business</p>
        </div>

        {/* Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              icon={<Icons.user className="h-5 w-5 text-gray-400" />}
              placeholder="John Doe"
              {...register("fullName")}
              error={errors.fullName?.message}
              labelColor="text-gray-600"
              className="block text-gray-600 w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
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
              label="Company Name"
              icon={<Icons.building className="h-5 w-5 text-gray-400" />}
              labelColor="text-gray-600"
              placeholder="Your company"
              className="block text-gray-600 w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              {...register("company")}
              error={errors.company?.message}
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
            <Input
              label="Confirm Password"
              type="password"
              isPassword
              icon={<Icons.lock className="h-5 w-5 text-gray-400" />}
              passwordToggleIcons={{
                show: <Icons.eye className="h-5 w-5 text-gray-400" />,
                hide: <Icons.eyeOff className="h-5 w-5 text-gray-400" />,
              }}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              labelColor="text-gray-600"
              className="block text-gray-600 w-full pl-10 pr-3 py-3 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            {/* Terms */}
            <div className="flex items-start">
              <input type="checkbox" {...register("acceptTerms")} className="mt-1" />
              <label className="ml-3 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="font-medium text-green-600">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-green-600">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>}
            {/* Submit */}
            <Button type="submit" className="w-full bg-green-600 text-white rounded-lg py-3 hover:bg-green-700" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? "Creating..." : "Create Account"}
            </Button>
            <div className="w-full text-center text-gray-600">
              Already have account?
              <Link href="/auth/login" className="!text-blue-500">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
