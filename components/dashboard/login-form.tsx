"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Shield, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignIn } from "@/app/actions/auth.action";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { PixelButton } from "@/components/ui/PixelButton";
import { type SignInSchemaType, SignInSchema } from "@/lib/zod.schema";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    // biome-ignore lint/suspicious/noExplicitAny: resolver type mismatch
    resolver: zodResolver(SignInSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInSchemaType) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await SignIn(data);
      if (result.response) {
        setSuccessMessage(
          "SESSION_ESTABLISHED: Access granted. Initializing core dashboard...",
        );
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      } else {
        setErrorMessage(
          result.message ||
            "AUTHENTICATION_FAILED: Credentials rejected by security vault.",
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl border-2 border-foreground bg-background shadow-[8px_8px_0px_var(--color-primary)] p-6 sm:p-8 relative select-none">
      {/* Corner Decorators */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-accent" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-accent" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-accent" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-accent" />

      {/* Header telemetry info */}
      <div className="border-b border-border/30 pb-4 mb-6 flex justify-between items-center">
        <div className="flex gap-2 items-center text-accent">
          <Shield size={14} className="animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase font-bold">
            SECURITY_VAULT_V2.0
          </span>
        </div>
        <div className="font-mono text-[8px] text-muted-foreground uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>VAULT: LOCKED</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h1 className="font-sans font-black text-2xl uppercase tracking-tighter leading-none text-foreground">
          AUTHENTICATE_SESSION
        </h1>
        <p className="font-mono text-[10px] text-muted-foreground leading-relaxed normal-case">
          Access to admin dashboards is restricted. Ingest credential parameters
          to establish a secure auth session.
        </p>
      </div>

      {/* Alert feeds */}
      {errorMessage && (
        <div className="border border-red-500 bg-red-500/5 p-3 flex gap-2 items-start text-red-500 font-mono text-[10px] mb-6">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">VAULT_REJECTION:</span>
            {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="border border-emerald-500 bg-emerald-500/5 p-3 flex gap-2 items-start text-emerald-500 font-mono text-[10px] mb-6 animate-pulse">
          <CheckCircle size={14} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase block">SESSION_GRANTED:</span>
            {successMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Field>
          <FieldLabel>
            <FieldTitle>Email Address</FieldTitle>
          </FieldLabel>
          <FieldContent>
            <input
              type="email"
              disabled={isSubmitting}
              className="w-full bg-background border-2 border-foreground p-3 focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none font-mono text-xs"
              placeholder="admin@domain.com"
              {...register("email")}
            />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>
            <FieldTitle>Secure Password</FieldTitle>
          </FieldLabel>
          <FieldContent>
            <input
              type="password"
              disabled={isSubmitting}
              className="w-full bg-background border-2 border-foreground p-3 focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none font-mono text-xs"
              placeholder="••••••••••••"
              {...register("password")}
            />
            <FieldError
              errors={errors.password ? [errors.password] : undefined}
            />
          </FieldContent>
        </Field>

        <div className="pt-2 border-t border-border/20 flex justify-end">
          <PixelButton
            type="submit"
            disabled={isSubmitting}
            className="border-accent text-accent shadow-[4px_4px_0px_var(--color-primary)] active:translate-x-[2px] active:translate-y-[2px] w-full py-3"
          >
            <Terminal size={12} className="mr-1.5 inline-block" />
            {isSubmitting ? "DECRYPTING_CREDENTIALS..." : "ESTABLISH_SESSION"}
          </PixelButton>
        </div>
      </form>
    </div>
  );
}
