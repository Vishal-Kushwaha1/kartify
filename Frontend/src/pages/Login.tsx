import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginProps } from "../Type";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingPage } from "@/components/LoadingPage";
import { authClient } from "@/lib/authClient";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const handleLogin = async (formData: LoginProps) => {
    try {
      setLoading(true);
      const { email, password } = formData;
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        console.log("Error while login. ", error);
        return;
      }
      navigate("/dashboard");
    } catch (error) {
      console.log("Something went wrong ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
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
