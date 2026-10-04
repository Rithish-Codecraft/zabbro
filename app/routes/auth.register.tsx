import { useState } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/auth.register";
import { getUserByEmail, createUser } from "~/db/index.server";
import { hashPassword, createUserSession, getUser } from "~/lib/auth.server";
import { redirect } from "react-router";
import { Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";

export function meta() {
  return [
    { title: "Create Account // ZABBRO™" },
    { name: "description", content: "Join ZABBRO and unlock exclusive drops." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  if (user) return redirect("/profile");
  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return { error: "An account with this email already exists." };
    }

    const passwordHash = hashPassword(password);
    const user = await createUser({ name, email, passwordHash, role: "customer" });
    return createUserSession(user.id, "/profile");
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Could not create account. Make sure the database is configured." };
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-bg flex items-center justify-center min-h-screen px-4 py-16">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              ZABBRO<span style={{ color: "#c8ff00" }}>.</span>
            </h1>
          </Link>
          <p className="mt-3 text-zinc-400 text-sm tracking-widest uppercase"
            style={{ fontFamily: "'Times New Roman', serif", letterSpacing: "0.3em" }}>
            Join the Inner Circle
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="text-3xl font-black text-white mb-2"
            style={{ fontFamily: "'Times New Roman', serif", fontStyle: "italic" }}>
            Create Account
          </h2>
          <p className="text-zinc-400 mb-8 text-base">Access exclusive drops & track your orders.</p>

          {actionData?.error && (
            <div className="mb-6 px-4 py-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
              {actionData.error}
            </div>
          )}

          <Form method="post" className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Times New Roman', serif" }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                autoComplete="name"
                placeholder="Your Name"
                className="glass-input w-full px-4 py-3.5 rounded-lg text-white text-base placeholder:text-zinc-600"
                style={{ fontFamily: "'Times New Roman', serif" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Times New Roman', serif" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="reg-email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="glass-input w-full px-4 py-3.5 rounded-lg text-white text-base placeholder:text-zinc-600"
                style={{ fontFamily: "'Times New Roman', serif" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Times New Roman', serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="reg-password"
                  required
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="glass-input w-full px-4 py-3.5 pr-12 rounded-lg text-white text-base placeholder:text-zinc-600"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 tracking-widest uppercase"
                style={{ fontFamily: "'Times New Roman', serif" }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirm-password"
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                className="glass-input w-full px-4 py-3.5 rounded-lg text-white text-base placeholder:text-zinc-600"
                style={{ fontFamily: "'Times New Roman', serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="register-btn"
              className="btn-volt w-full flex items-center justify-center gap-3 text-lg py-4 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Already a member?{" "}
              <Link to="/auth/login" className="text-[#c8ff00] font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">
            ← Back to the store
          </Link>
        </div>
      </div>
    </div>
  );
}
