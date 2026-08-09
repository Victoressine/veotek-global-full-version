import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    document.title = "Login | VeoTek CMS";
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await login(email, password);

      toast.success("Login successful.");

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error?.message || "Unable to log in. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
                V
              </div>

              <div>
                <p className="text-xl font-semibold">VeoTek Global</p>
                <p className="text-sm text-slate-400">
                  Content Management System
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              Secure Administration
            </p>

            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              Manage your website content from one secure platform.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Publish services, portfolio projects, articles, team profiles,
              testimonials and website updates.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} VeoTek Global. All rights reserved.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
                  V
                </div>

                <div>
                  <p className="font-semibold">VeoTek Global</p>
                  <p className="text-xs text-slate-400">CMS</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-sm font-medium text-cyan-400">
                Administrator access
              </p>

              <h2 className="text-3xl font-semibold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Enter your authorised account details to access the dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="admin@veotekglobal.com"
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={isSubmitting}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white disabled:cursor-not-allowed"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-slate-500">
              Access is restricted to authorised VeoTek Global administrators.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}