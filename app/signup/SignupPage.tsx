'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
  } = useForm();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-700">Sign Up</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to create an account</p>
          <div className="mt-2 border-b-2 border-gray-300 w-16 mx-auto"></div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700">Name</Label>
              <Input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
            </div>
            <Button type="submit" className="mt-5 mb-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
