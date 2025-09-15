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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Bitcoin } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
    const router = useRouter()
    const { login, isLoading } = useAuth();

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
        await login(data.email, data.password)
        
        toast.success("Welcome back to Coin Trackr.")
        
        router.push("/dashboard")

        reset()
      } catch (err) {
        console.error("Login failed:", err);
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg p-8 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-col items-start justify-center text-left px-0">
          <motion.div 
            className="flex items-center gap-2 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo rounded-lg p-1.5"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bitcoin className="h-6 w-6 text-muted dark:text-foreground" />
              </motion.div>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-br from-gradient-amber via-gradient-sky to-gradient-indigo text-transparent bg-clip-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              CoinTrackr
            </motion.h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CardTitle className="text-2xl font-bold">
              Welcome back!
            </CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <CardDescription className="text-sm text-muted-foreground">
              Log in to your account to access your portfolio
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <motion.div 
                className="grid gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Label htmlFor="email">Email</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input {...field} type="email" placeholder="m@example.com" required />
                    </motion.div>
                  )}
                />
                {errors.email && (
                  <motion.p 
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div 
                className="grid gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input {...field} type="password" required />
                    </motion.div>
                  )}
                />
                {errors.password && (
                  <motion.p 
                    className="text-red-500 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="glow" type="submit" className="w-full text-muted dark:text-foreground cursor-pointer" disabled={isLoading}>
                  {isLoading ? (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Logging in...
                    </motion.div>
                  ) : (
                    "Login"
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Button
              variant="link"
              asChild
              className="font-normal text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Link href="/register">Don&apos;t have an account? Register</Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
