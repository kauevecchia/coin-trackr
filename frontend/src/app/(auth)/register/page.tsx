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
import { RegisterFormInputs, registerFormSchema } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function Register() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await useAuthStore
        .getState()
        .register(data.name, data.email, data.password);

      toast.success("Account created successfully! Welcome to Coin Trackr.");
      reset();
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        const errorMessage =
          axiosError.response?.data?.message || "An unexpected error occurred.";
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
          Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-1">
              <Label htmlFor="name">Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Your name here"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
              
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                  />
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
                render={({ field }) => <Input {...field} type="password" />}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => <Input {...field} type="password" />}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              Register
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
          <Link href="/login">Already have an account? Login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
