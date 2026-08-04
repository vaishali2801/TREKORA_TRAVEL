import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { FiLock, FiMail, FiUser, FiUserPlus } from "react-icons/fi";
import AuthShell from "@/components/auth/AuthShell";
import { TextField } from "@/components/common/TextField";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — TrekVista Tours & Treks" },
      {
        name: "description",
        content:
          "Create your free TrekVista account to book treks, rent gear and track every adventure booking.",
      },
      { property: "og:title", content: "Create Account — TrekVista" },
      {
        property: "og:description",
        content: "Join TrekVista for member departures and gear discounts.",
      },
    ],
  }),
  component: RegisterPage,
});

type Field = "name" | "email" | "password" | "confirm";
type Errors = Partial<Record<Field, string>>;

const STRENGTH = ["Too short", "Weak", "Fair", "Strong", "Excellent"] as const;
const STRENGTH_TONE = [
  "bg-destructive",
  "bg-destructive",
  "bg-accent",
  "bg-secondary",
  "bg-secondary",
];

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^\w\s]/.test(pw)) score++;
  return Math.min(score, 4);
}

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => scorePassword(form.password), [form.password]);

  const set = (key: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!accepted) {
      toast.error("Please accept the terms to continue.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await register(form.name.trim(), form.email, form.password);
      toast.success(`Account created — welcome, ${user?.name ?? form.name}!`);
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join 18,000+ travellers exploring with TrekVista."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="Ananya Menon"
          icon={<FiUser size={16} />}
          value={form.name}
          onChange={set("name")}
          error={errors.name}
        />
        <TextField
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<FiMail size={16} />}
          value={form.email}
          onChange={set("email")}
          error={errors.email}
        />
        <div>
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<FiLock size={16} />}
            value={form.password}
            onChange={set("password")}
            error={errors.password}
          />
          {form.password ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-1.5 flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${
                      i < strength ? STRENGTH_TONE[strength] : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{STRENGTH[strength]}</span>
            </div>
          ) : null}
        </div>
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          icon={<FiLock size={16} />}
          value={form.confirm}
          onChange={set("confirm")}
          error={errors.confirm}
        />

        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
          />
          <span>
            I agree to the{" "}
            <Link to="/about" className="text-primary hover:underline">
              terms of service
            </Link>{" "}
            and privacy policy.
          </span>
        </label>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"} <FiUserPlus />
        </Button>
      </form>
    </AuthShell>
  );
}
