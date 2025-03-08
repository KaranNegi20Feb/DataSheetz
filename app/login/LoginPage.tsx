'use client';
import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";

export default function LoginPage() {
  const {
    register,
  } = useForm();

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-700">Login</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to access your account</p>
          <div className="mt-2 border-b-2 border-gray-300 w-16 mx-auto"></div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 border-gray-300 focus:border-green-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="mt-1 border-gray-300 focus:border-green-500"
              />
            </div>
            <Button type="submit" className="w-full mb-5 mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold">
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
