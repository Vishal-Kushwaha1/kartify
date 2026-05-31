import { useState } from "react";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginProps } from "../types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingPage } from "@/components/LoadingPage";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import type {User} from "@/types/type";
import {  Loader2 } from "lucide-react";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (formData: LoginProps) => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });
      if (error)
        return toast.error("Login failed", { description: error.message });
      toast.success("Login successful");
      const { data: session } = await authClient.getSession();
      dispatch(setUser(session?.user as User));
      navigate("/");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/products`,
      });
      if (error)
        return toast.error("Google login failed", {
          description: error.message,
        });
      toast.success("Login successful");
      navigate("/")
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Column - Image/Graphic */}
      <div className="hidden lg:flex flex-1 relative bg-muted items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" 
          alt="Abstract Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="relative z-20 flex flex-col items-start justify-end h-full w-full p-16 bg-linear-to-t from-background/90 to-transparent">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 shadow-xl">
            K
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            Welcome back to <br />Kartify
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Your premium destination for the finest products. Sign in to access your saved items, track orders, and discover new deals.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="w-full max-w-sm space-y-6">
          
          <div className="flex flex-col space-y-2 text-center lg:text-left mb-8">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 lg:hidden">
              <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
                K
              </div>
              <span className="font-bold text-xl">Kartify</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to access your account.
            </p>
          </div>

          <Card className="border-border/50 shadow-lg bg-background/60 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-11 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                    {...register("email")} 
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive font-medium pl-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    className="h-11 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive font-medium pl-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button className="w-full h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-all" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign in
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                  <span className="bg-background px-3 text-muted-foreground rounded-full border border-border/50">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 rounded-xl bg-background hover:bg-muted/50 border-border/50 font-medium"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
