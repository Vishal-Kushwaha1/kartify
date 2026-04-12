import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterProps } from "../Type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/loading";
import { authClient } from "@/lib/authClient";

export const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (formData: RegisterProps) => {
    setLoading(true);
    const { email, password, fullName } = formData;

    try {
      const {data, error } = await authClient.signUp.email({
        email,
        password,
        name: fullName,
        callbackURL: "/dashboard",
      });
      if(error){
        console.log("error", error)
        return
      }
      console.log("data", data)
      navigate("/dashboard")
    } catch (error) {
      console.log("Something went wrong", error)
    }finally{
      setLoading(false)
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-95">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            <Input
              type="fullName"
              placeholder="Full Name"
              {...register("fullName", { required: true })}
            />
            <p>{errors.fullName?.message}</p>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <p>{errors.email?.message}</p>
            <Input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <p>{errors.password?.message}</p>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center">
            Already have an account?
            <Link to={"/login"} className="text-blue-500 ml-1">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
