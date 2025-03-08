'use client';

import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await axios.post('/api/auth/register', data);
      console.log('Signup successful:', response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error signing up:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-700">Sign Up</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to create an account</p>
          <div className="mt-2 border-b-2 border-gray-300 w-16 mx-auto"></div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                {...register("username", { required: "Username is required" })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            <Button type="submit" className="mt-5 mb-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
