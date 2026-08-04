import { forwardRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  error?: string;
};

/** Labelled input with optional leading icon, password reveal and error text. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, icon, error, className, type = "text", id, ...props }, ref) => {
    const [reveal, setReveal] = useState(false);
    const isPassword = type === "password";
    const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          {icon ? (
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            type={isPassword && reveal ? "text" : type}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm text-foreground",
              "placeholder:text-muted-foreground/70 transition-all duration-200",
              "focus:border-primary focus:ring-2 focus:ring-primary/25 focus:outline-none",
              icon && "pl-11",
              isPassword && "pr-11",
              error && "border-destructive focus:border-destructive focus:ring-destructive/25",
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              aria-label={reveal ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {reveal ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          ) : null}
        </div>
        {error ? <p className="mt-1.5 text-xs text-destructive">{error}</p> : null}
      </div>
    );
  },
);
TextField.displayName = "TextField";
