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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Bitcoin } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

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
      await register(data.name, data.email, data.password);

      toast.success("Account created successfully! Welcome to Coin Trackr.");
      reset();
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <Card className="w-full max-w-lg p-8">
      <CardHeader className="flex flex-col items-start justify-center text-left px-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-1.5">
            <Bitcoin className="h-6 w-6 text-muted dark:text-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text">
            CoinTrackr
          </h1>
        </div>
        <CardTitle className="text-2xl font-bold">
          Create an account
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Create an account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
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
              variant="glow"
              className="w-full text-foreground cursor-pointer"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
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
