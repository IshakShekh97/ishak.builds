import { AlertTriangle } from "lucide-react";
import React from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactElement<{ className?: string }>;
  className?: string;
}

export function FormField({
  label,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 font-mono w-full", className)}>
      <span className="text-xs uppercase text-foreground font-bold block">
        {label}
      </span>
      <div className="relative">
        {React.cloneElement(children, {
          className: cn(
            children.props.className,
            error && "border-red-500/50 focus:border-red-500",
          ),
        })}
      </div>
      {error && (
        <span className="text-[10px] text-red-500 font-bold flex items-center gap-1.5 animate-pulse mt-1">
          <AlertTriangle size={10} />
          {"ERR_VAL // "}
          {error.message}
        </span>
      )}
    </div>
  );
}
