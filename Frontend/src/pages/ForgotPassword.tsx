import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Step = "email" | "otp" | "password";
type Inputs = { email: string; newPassword: string; confirmPassword: string };

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  // step skip protection
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSendOtp = async ({ email }: Inputs) => {
    try {
      setLoading(true);
      //TODO: go to next when user exists
      const { error: otpError } =
        await authClient.emailOtp.requestPasswordReset({
          email,
        });
      if (otpError) return toast.error(otpError.message);
      setVerifiedEmail(email); // ✅ email save, step unlock
      toast.success("OTP sent!");
      setStep("otp");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (value: string) => {
    if (!verifiedEmail) return; // step skip protection
    try {
      setLoading(true);
      const { error } = await authClient.emailOtp.checkVerificationOtp({
        email: verifiedEmail,
        type: "forget-password",
        otp: value,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setOtpVerified(true); // ✅ otp verified, password step unlock
      toast.success("OTP verified!");
      setStep("password");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async ({
    newPassword,
    confirmPassword,
  }: Inputs) => {
    if (!otpVerified) return; // step skip protection
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const { error } = await authClient.emailOtp.resetPassword({
        email: verifiedEmail,
        otp: otp,
        password: newPassword,
      });
      if (error) return toast.error(error.message);
      toast.success("Password reset!");
      navigate("/login");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        {/* Step 1 — Email */}
        {step === "email" && (
          <>
            <CardHeader>
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>
                Enter your email to receive an OTP.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleSendOtp)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    placeholder="you@example.com"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {/* Step 2 — OTP (only if email verified) */}
        {step === "otp" && verifiedEmail && (
          <>
            <CardHeader>
              <CardTitle>Enter OTP</CardTitle>
              <CardDescription>OTP sent to {verifiedEmail}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {loading && (
                <p className="text-sm text-muted-foreground">Verifying...</p>
              )}
              <button
                className="text-sm text-muted-foreground underline"
                onClick={() => setStep("email")}
              >
                Wrong email? Go back
              </button>
            </CardContent>
          </>
        )}

        {/* Step 3 — Password (only if otp verified) */}
        {step === "password" && otpVerified && (
          <>
            <CardHeader>
              <CardTitle>Set new password</CardTitle>
              <CardDescription>Choose a strong password.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <Label>New password</Label>
                  <Input
                    type="password"
                    {...register("newPassword", {
                      required: "Required",
                      minLength: { value: 8, message: "Min. 8 characters" },
                    })}
                    placeholder="Min. 8 characters"
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Confirm password</Label>
                  <Input
                    type="password"
                    {...register("confirmPassword", { required: "Required" })}
                    placeholder="Repeat password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
