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
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterProps } from "../types/schema";
import { Loader2, MailCheck } from "lucide-react";

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

  const handleRegister = async (formData: RegisterProps) => {
    const { email, password, fullName } = formData;
    try {
      setLoading(true);
      const { error } = await authClient.signUp.email({
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

  const handleVerifyOtp = async (value: string) => {
    if (!verifiedEmail) return;
    try {
      setLoading(true);
      const { error } = await authClient.emailOtp.verifyEmail({
        email: verifiedEmail,
        otp: value,
      });
      if (error) return toast.error(error.message || "Invalid OTP");
      toast.success("Email verified!");
      navigate("/products");
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
      navigate("/products");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === "form") return <LoadingPage />;

  return (
    <div className="bg-background flex min-h-screen">
      {/* Left Column - Image/Graphic */}
      <div className="bg-muted relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        <div className="bg-primary/10 absolute inset-0 z-10 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
          alt="Abstract Background"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="from-background/90 relative z-20 flex h-full w-full flex-col items-start justify-end bg-linear-to-t to-transparent p-16">
          <div className="bg-primary text-primary-foreground mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-bold shadow-xl">
            K
          </div>
          <h2 className="text-foreground mb-4 text-4xl leading-tight font-bold">
            Join the Kartify <br />
            Community
          </h2>
          <p className="text-muted-foreground max-w-md text-lg">
            Unlock exclusive deals, track your orders in real-time, and
            experience the future of premium online shopping.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="bg-muted/20 flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-6">
          {step === "form" && (
            <>
              <div className="mb-8 flex flex-col space-y-2 text-center lg:text-left">
                <div className="mb-2 flex items-center justify-center gap-2 lg:hidden lg:justify-start">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold">
                    K
                  </div>
                  <span className="text-xl font-bold">Kartify</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Create account
                </h1>
                <p className="text-muted-foreground text-sm">
                  Sign up to get started with your premium experience.
                </p>
              </div>

              <Card className="border-border/50 bg-background/60 overflow-hidden rounded-2xl shadow-lg backdrop-blur-xl">
                <CardContent className="space-y-6 p-6 sm:p-8">
                  <form
                    onSubmit={handleSubmit(handleRegister)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Input
                        placeholder="Full Name"
                        autoComplete="name"
                        className="bg-background border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-destructive pl-1 text-xs font-medium">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        className="bg-background border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-destructive pl-1 text-xs font-medium">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="password"
                        placeholder="Create Password"
                        className="bg-background border-border/50 focus-visible:ring-primary/20 h-11 rounded-xl"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-destructive pl-1 text-xs font-medium">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      className="mt-2 h-11 w-full rounded-xl font-medium shadow-md transition-all hover:shadow-lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Sign Up
                    </Button>
                  </form>

                  {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="border-border/50 w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs font-medium tracking-wider uppercase">
                      <span className="bg-background text-muted-foreground border-border/50 rounded-full border px-3">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="bg-background hover:bg-muted/50 border-border/50 h-11 w-full rounded-xl font-medium"
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
                  </Button> */}
                </CardContent>
              </Card>

              <p className="text-muted-foreground mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === "otp" && verifiedEmail && (
            <>
              <div className="mb-8 flex flex-col space-y-2 text-center lg:text-left">
                <div className="bg-primary/10 text-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl lg:mx-0">
                  <MailCheck className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Check your email
                </h1>
                <p className="text-muted-foreground text-sm">
                  We've sent a 6-digit verification code to{" "}
                  <br className="hidden lg:block" />
                  <span className="text-foreground font-medium">
                    {verifiedEmail}
                  </span>
                </p>
              </div>

              <Card className="border-border/50 bg-background/60 overflow-hidden rounded-2xl shadow-lg backdrop-blur-xl">
                <CardContent className="flex flex-col items-center space-y-6 p-6 sm:p-8">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOtp}
                    disabled={loading}
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="border-border/50 bg-background h-12 w-12 rounded-xl text-lg"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {loading && (
                    <Loader2 className="text-primary mt-2 h-6 w-6 animate-spin" />
                  )}

                  <div className="mt-6 flex w-full flex-col items-center gap-4">
                    <Button
                      variant="ghost"
                      className="hover:text-primary h-9 text-sm font-medium transition-colors"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Didn't receive a code? Resend
                    </Button>
                    <button
                      className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4 transition-colors"
                      onClick={() => setStep("form")}
                      disabled={loading}
                    >
                      Wrong email? Go back
                    </button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
