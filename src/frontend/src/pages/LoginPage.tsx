import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { Fingerprint, Shield } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginStatus, identity, isLoggingIn } = useInternetIdentity();

  useEffect(() => {
    if (loginStatus === "success" && identity) {
      router.navigate({ to: "/role-select" });
    }
  }, [loginStatus, identity, router]);

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 glow-cyan mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            MED<span className="text-primary">REACH</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Secure Medical Research Platform
          </p>
        </div>

        <div className="card-surface rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-2">Sign In</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Use Internet Identity to securely authenticate. Your credentials are
            cryptographically verified on the Internet Computer.
          </p>
          <div className="space-y-3 mb-8">
            {[
              "Zero-knowledge authentication",
              "No passwords to remember",
              "Works with any device",
            ].map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{point}</span>
              </div>
            ))}
          </div>
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan h-12"
            disabled={isLoggingIn}
            onClick={login}
            data-ocid="login.primary_button"
          >
            <Fingerprint className="w-5 h-5 mr-2" />
            {isLoggingIn ? "Authenticating..." : "Login with Internet Identity"}
          </Button>
          {loginStatus === "loginError" && (
            <p
              className="text-destructive text-sm text-center mt-4"
              data-ocid="login.error_state"
            >
              Authentication failed. Please try again.
            </p>
          )}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is protected by the Internet Computer blockchain.
        </p>
      </div>
    </div>
  );
}
