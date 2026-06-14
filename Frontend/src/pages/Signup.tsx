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
} from "@/components/ui/card";
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
        }
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
      navigate("/");
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
      navigate("/");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === "form") return <LoadingPage />;

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
            Join the Kartify <br />Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Unlock exclusive deals, track your orders in real-time, and experience the future of premium online shopping.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-muted/20 py-12">
        <div className="w-full max-w-sm space-y-6">
          
          {step === "form" && (
            <>
              <div className="flex flex-col space-y-2 text-center lg:text-left mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 lg:hidden">
                  <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg">
                    K
                  </div>
                  <span className="font-bold text-xl">Kartify</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
                <p className="text-sm text-muted-foreground">
                  Sign up to get started with your premium experience.
                </p>
              </div>

              <Card className="border-border/50 shadow-lg bg-background/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Full Name"
                        autoComplete="name"
                        className="h-11 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-destructive font-medium pl-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>
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
                        placeholder="Create Password"
                        className="h-11 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-xs text-destructive font-medium pl-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    
                    <Button className="w-full h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-all mt-2" type="submit" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign Up
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

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === "otp" && verifiedEmail && (
            <>
              <div className="flex flex-col space-y-2 text-center lg:text-left mb-8">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-4">
                  <MailCheck className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit verification code to <br className="hidden lg:block"/>
                  <span className="font-medium text-foreground">{verifiedEmail}</span>
                </p>
              </div>

              <Card className="border-border/50 shadow-lg bg-background/60 backdrop-blur-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6 sm:p-8 space-y-6 flex flex-col items-center">
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
                        <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg rounded-xl border-border/50 bg-background" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {loading && <Loader2 className="h-6 w-6 animate-spin text-primary mt-2" />}

                  <div className="flex flex-col items-center gap-4 mt-6 w-full">
                    <Button
                      variant="ghost"
                      className="text-sm font-medium hover:text-primary transition-colors h-9"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Didn't receive a code? Resend
                    </Button>
                    <button
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
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
