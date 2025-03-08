'use client';

import { useForm } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  username: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-700">Log In</CardTitle>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to log in</p>
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
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="mt-1 border-gray-300 focus:border-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
            <Button type="submit" className="mt-5 mb-5 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
              Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
