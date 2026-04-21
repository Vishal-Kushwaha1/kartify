import { authClient } from "@/lib/authClient";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { LoadingPage } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterProps } from "../types/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/userSlice";
import type { User } from "@/types/type";

type Step = "form" | "otp";

export const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [verifiedEmail, setVerifiedEmail] = useState(""); // step skip protection

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    resolver: zodResolver(registerSchema),
  });

  const dispatch = useDispatch();
  // Step 1 — Register + Send OTP
  const handleRegister = async (formData: RegisterProps) => {
    const { email, password, fullName } = formData;
    try {
      setLoading(true);
      const {  error } = await authClient.signUp.email({
        email,
        password,
        name: fullName,
      });
      if (error)
        return toast.error("Registration failed", {
          description: error.message,
        });
      

      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: "email-verification",
        },
      );
      if (otpError)
        return toast.error("OTP send failed", {
          description: otpError.message,
        });

      setVerifiedEmail(email); // unlock otp step
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async (value: string) => {
    if (!verifiedEmail) return; // step skip protection
    try {
      setLoading(true);
      const {  error } = await authClient.emailOtp.verifyEmail({
        email: verifiedEmail,
        otp: value,
      });
      if (error) return toast.error(error.message || "Invalid OTP");
      toast.success("Email verified!");

      const {data: session} = await authClient.getSession()
      dispatch(setUser(session?.user as User))
      navigate("/user");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verifiedEmail) return;
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: verifiedEmail,
        type: "email-verification",
      });
      if (error)
        return toast.error("Resend failed", { description: error.message });
      toast.success("OTP resent!");
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/user`,
      });
      if (error)
        return toast.error("Google login failed", {
          description: error.message,
        });
      navigate("/user");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        {/* Step 1 — Register Form */}
        {step === "form" && (
          <>
            <CardHeader>
              <CardTitle className="text-center">Create account</CardTitle>
              <CardDescription className="text-center">
                Sign up to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={handleSubmit(handleRegister)}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <Input
                    placeholder="Full Name"
                    autoComplete="name"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button className="w-full" type="submit">
                  Sign Up
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                Sign in with Google
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline">
                  Login
                </Link>
              </p>
            </CardContent>
          </>
        )}

        {/* Step 2 — OTP (only if verifiedEmail set) */}
        {step === "otp" && verifiedEmail && (
          <>
            <CardHeader>
              <CardTitle className="text-center">Verify your email</CardTitle>
              <CardDescription className="text-center">
                OTP sent to {verifiedEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col items-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleVerifyOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button
                variant="ghost"
                className="text-sm text-muted-foreground"
                onClick={handleResendOtp}
              >
                Resend OTP
              </Button>
              <button
                className="text-sm text-muted-foreground underline"
                onClick={() => setStep("form")}
              >
                Wrong email? Go back
              </button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
