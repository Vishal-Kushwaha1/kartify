import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginProps } from "../Type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loading } from "@/components/loading";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({ 
    resolver: zodResolver(loginSchema)
   });

  const navigate = useNavigate();
  const handleLogin = (data: LoginProps) => {
    setLoading(true);
    // login will implemented
    console.log("data:",data)
    navigate("/home");
    setLoading(false);
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-95">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
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
              Login
            </Button>
          </form>

          <p className="text-sm text-center">
            Don't have an account?
            <Link to={"/signup"} className="text-blue-500 ml-1">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
