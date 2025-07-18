"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormInputs, loginFormSchema } from "@/schemas/authSchemas";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function Login() {
    const router = useRouter()

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<LoginFormInputs>({
      resolver: zodResolver(loginFormSchema),
      mode: "onChange",
      defaultValues: {
        email: "",
        password: "",
      },
    });

    const onSubmit = async (data: LoginFormInputs) => {
      try {
        await useAuthStore
          .getState()
          .login(data.email, data.password)
        
        toast.success("Welcome back to Coin Trackr.")
        
        router.push("/dashboard")

        reset()
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const axiosError = err as AxiosError;
          const errorMessage =
            axiosError.response?.data?.message ||
            "An unexpected error occurred.";
          toast.error(errorMessage);
        } else {
          toast.error(
            "An unexpected error occurred: " +
              (err instanceof Error ? err.message : String(err))
          );
        }
      }
    };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl font-bold">
          Welcome to Coin Trackr
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Login to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input {...field} type="email" placeholder="m@example.com" required />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input {...field} type="password" required />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          variant="link"
          asChild
          className="font-normal text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <Link href="/register">Don&apos;t have an account? Register</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
